// POST /api/quiz/grade
// Receives raw student answers → grades server-side → saves progress → triggers ranking update
// correctIndex values are NEVER sent to the client — only accessible here on the server

import { NextRequest, NextResponse } from 'next/server'
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(req: NextRequest) {
  try {
    const { answers, chapterId, quizId } = await req.json()
    // answers: number[] — index of selected option per question

    // 1. Verify Firebase session token from Authorization header
    const authorization = req.headers.get('Authorization')
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }
    const idToken = authorization.slice(7)
    const decoded = await getAdminAuth().verifyIdToken(idToken)
    const studentId = decoded.uid
    const schoolId  = decoded.schoolId as string

    if (decoded.role !== 'student') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Fetch quiz (including correctIndex — never leaves this function)
    const quizSnap = await getAdminDb().collection('quizzes').doc(quizId).get()
    if (!quizSnap.exists) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }
    const quiz = quizSnap.data()!

    // 3. Grade
    let score    = 0
    let maxScore = 0
    const breakdown: { correct: boolean; points: number; correctIndex: number }[] = []

    quiz.questions.forEach((q: { correctIndex: number; points: number }, i: number) => {
      maxScore += q.points
      const isCorrect = answers[i] === q.correctIndex
      if (isCorrect) score += q.points
      breakdown.push({ correct: isCorrect, points: q.points, correctIndex: q.correctIndex })
    })

    const percentageScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
    const passed          = percentageScore >= (quiz.passThreshold ?? 70)

    // 4. Check if this is first attempt
    const progressRef  = getAdminDb()
      .collection('studentChapterProgress')
      .doc(studentId)
      .collection('chapters')
      .doc(chapterId)

    const progressSnap = await progressRef.get()
    const existing     = progressSnap.data()
    const isFirstAttempt = !existing || existing.firstAttemptScore == null

    // 5. Save progress
    await progressRef.set(
      {
        status:            'completed',
        attempts:          FieldValue.increment(1),
        bestAttemptScore:  Math.max(percentageScore, existing?.bestAttemptScore ?? 0),
        ...(isFirstAttempt && {
          firstAttemptScore: percentageScore,
          completedAt:       new Date().toISOString(),
        }),
      },
      { merge: true }
    )

    // 6. If first attempt: update school aggregate score and student XP
    let updatedSchoolRank: number | null = null
    let xpEarned = 0
    if (isFirstAttempt) {
      xpEarned = percentageScore
      const studentRef = getAdminDb().collection('students').doc(studentId)
      await studentRef.update({
        xp: FieldValue.increment(xpEarned)
      })
      if (schoolId) {
        updatedSchoolRank = await recalculateSchoolRanking(schoolId, studentId, percentageScore)
      }
    }

    return NextResponse.json({
      score:         percentageScore,
      maxScore:      100,
      passed,
      breakdown,
      isFirstAttempt,
      xpEarned,
      schoolRank:    updatedSchoolRank,
    })
  } catch (err) {
    console.error('[quiz/grade]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

async function recalculateSchoolRanking(
  schoolId: string,
  studentId: string,
  newScore: number
): Promise<number> {
  const schoolRef = getAdminDb().collection('schools').doc(schoolId)

  // Add score to running totals in a transaction
  await getAdminDb().runTransaction(async (txn) => {
    const schoolSnap = await txn.get(schoolRef)
    const school     = schoolSnap.data()!

    const currentTotal    = (school.aggregateScore ?? 0) + newScore
    const currentStudents = (school.activeStudentCount ?? 0)

    // Ensure student counted (idempotent with Set-like check)
    const studentSnap = await getAdminDb().collection('students').doc(studentId).get()
    const studentData = studentSnap.data()

    const newStudentCount = studentData ? Math.max(currentStudents, 1) : currentStudents
    const newAvgScore     = newStudentCount > 0 ? currentTotal / newStudentCount : 0

    txn.update(schoolRef, {
      aggregateScore:    currentTotal,
      averageScore:      Math.round(newAvgScore * 10) / 10,
      activeStudentCount: newStudentCount,
    })
  })

  // Recalculate ranks across all schools
  const allSchoolsSnap = await getAdminDb()
    .collection('schools')
    .where('active', '==', true)
    .orderBy('averageScore', 'desc')
    .get()

  const batch = getAdminDb().batch()
  let rank    = 1
  let myRank  = 1

  for (const schoolDoc of allSchoolsSnap.docs) {
    const prevRank = schoolDoc.data().rank ?? rank
    const trend    = prevRank - rank   // positive = moved up

    batch.update(schoolDoc.ref, { rank, rankTrend: trend })
    if (schoolDoc.id === schoolId) myRank = rank
    rank++
  }
  await batch.commit()

  return myRank
}
