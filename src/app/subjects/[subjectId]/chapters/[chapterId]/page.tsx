'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import type { Chapter, ChapterProgress } from '@/lib/firebase/firestore'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Clock, BookOpenText, CheckCircle } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { PageTurn } from '@/components/ui/Transitions'

export default function ChapterReaderPage() {
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>()
  const router  = useRouter()
  const { loading: authLoading, profile } = useAuth()

  const [chapter,   setChapter]   = useState<Chapter | null>(null)
  const [progress,  setProgress]  = useState<ChapterProgress | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [marking,   setMarking]   = useState(false)
  const [readPct,   setReadPct]   = useState(0)

  useEffect(() => {
    if (authLoading) return
    if (!profile) return

    async function load() {
      const chapSnap  = await getDoc(doc(db, 'chapters', chapterId))
      if (!chapSnap.exists()) { router.push('/subjects'); return }
      const chap = { id: chapSnap.id, ...chapSnap.data() } as Chapter
      setChapter(chap)

      const user = auth.currentUser
      if (user) {
        const progSnap = await getDoc(
          doc(db, 'studentChapterProgress', user.uid, 'chapters', chapterId)
        )
        if (progSnap.exists()) setProgress(progSnap.data() as ChapterProgress)
        else {
          await setDoc(doc(db, 'studentChapterProgress', user.uid, 'chapters', chapterId), {
            status: 'reading', firstAttemptScore: null, bestAttemptScore: null, attempts: 0, completedAt: null,
          })
          setProgress({ status: 'reading', firstAttemptScore: null, bestAttemptScore: null, attempts: 0, completedAt: null })
        }
      }
      setLoading(false)
    }
    load()
  }, [chapterId, router, authLoading, profile])

  useEffect(() => {
    function handleScroll() {
      const el  = document.documentElement
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
      setReadPct(Math.min(100, Math.round(pct)))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function markAsRead() {
    if (!auth.currentUser || !chapter) return
    setMarking(true)
    try {
      await setDoc(
        doc(db, 'studentChapterProgress', auth.currentUser.uid, 'chapters', chapterId),
        { status: 'quiz_available' },
        { merge: true }
      )
      setProgress(p => p ? { ...p, status: 'quiz_available' } : p)
      toast.success('Chapter marked as read!')
      setTimeout(() => {
        router.push(`/subjects/${subjectId}/chapters/${chapterId}/quiz`)
      }, 800)
    } catch {
      toast.error('Could not save progress')
    } finally {
      setMarking(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[var(--deep-night)] story-mode">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
        <div className="skeleton bg-white/10 h-10 w-2/3 rounded-xl" />
        <div className="skeleton bg-white/10 h-6 w-1/3 rounded-xl" />
        <div className="skeleton bg-white/10 h-96 w-full rounded-2xl" />
      </div>
    </div>
  )

  const isCompleted = progress?.status === 'completed'
  const hasQuiz     = !!chapter?.quizId

  return (
    <div className="min-h-screen bg-[var(--deep-night)] story-mode overflow-hidden">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-white/10 z-50">
        <div
          className="h-full bg-[var(--color-accent-yellow)] transition-all duration-200"
          style={{ width: `${readPct}%` }}
        />
      </div>

      {/* Sticky header */}
      <header className="sticky top-0 bg-[var(--deep-night)]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center gap-4 z-40">
        <Link href={`/dashboard`} className="text-white/60 hover:text-white transition-colors p-2 bg-white/5 rounded-lg hover:bg-white/10">
          <ArrowLeft weight="bold" className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-base truncate">{chapter?.title}</p>
        </div>
        {isCompleted && (
          <div className="flex items-center gap-1.5 text-[var(--color-accent-green)] text-sm font-bold bg-[var(--color-accent-green)]/10 px-3 py-1.5 rounded-lg border border-[var(--color-accent-green)]/20">
            <CheckCircle weight="fill" className="w-5 h-5" />
            Completed
          </div>
        )}
      </header>

      <PageTurn keyId={chapterId}>
        <article className="max-w-3xl mx-auto px-6 py-12 lg:py-16 relative">
          {/* Subtle starry background effect could go here */}
          
          <div className="flex items-center gap-5 text-sm font-bold text-white/60 mb-8">
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Clock weight="fill" className="w-4 h-4 text-[var(--color-accent-yellow)]" />
              {chapter?.estimatedMinutes} min read
            </span>
            {hasQuiz && (
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <BookOpenText weight="fill" className="w-4 h-4 text-[var(--sunset-coral)]" />
                Quiz at the end
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-10 leading-tight">
            {chapter?.title}
          </h1>

          {chapter?.videoUrl && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
              {chapter.videoUrl.includes('youtube.com') || chapter.videoUrl.includes('youtu.be') ? (
                <iframe 
                  className="w-full aspect-video" 
                  src={chapter.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                  allowFullScreen 
                  title="Lesson Video"
                />
              ) : (
                <video 
                  controls 
                  className="w-full aspect-video" 
                  src={chapter.videoUrl} 
                />
              )}
            </div>
          )}

          <div
            className="prose prose-lg md:prose-xl max-w-none 
              prose-headings:font-display prose-headings:text-white prose-headings:font-bold
              prose-p:text-white/80 prose-p:leading-[1.8] prose-p:font-medium
              prose-strong:text-white prose-strong:font-bold
              prose-a:text-[var(--color-accent-yellow)] prose-a:no-underline hover:prose-a:underline
              prose-code:text-white prose-code:bg-white/10 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md
              prose-blockquote:border-l-[var(--color-accent-yellow)] prose-blockquote:text-white/70 prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-xl"
            dangerouslySetInnerHTML={{ __html: chapter?.content ?? '' }}
          />

          <div className="mt-16 pt-10 border-t border-white/10">
            {isCompleted ? (
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 text-[var(--color-accent-green)] font-bold text-lg">
                  <CheckCircle weight="fill" className="w-8 h-8" />
                  Quest Completed!
                </div>
                <div className="flex-1" />
                {hasQuiz && (
                  <Link href={`/subjects/${subjectId}/chapters/${chapterId}/quiz`}>
                    <Button variant="secondary" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">Retake Quiz</Button>
                  </Link>
                )}
              </div>
            ) : hasQuiz ? (
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center space-y-6">
                <div className="w-16 h-16 bg-[var(--sunset-coral)]/20 rounded-2xl flex items-center justify-center mx-auto">
                  <BookOpenText weight="fill" className="w-8 h-8 text-[var(--sunset-coral)]" />
                </div>
                <p className="text-lg text-white/80 font-bold max-w-md mx-auto">
                  Ready to test your knowledge and earn points for your school?
                </p>
                <Button onClick={markAsRead} loading={marking} size="lg" className="w-full sm:w-auto text-lg px-10">
                  Begin Quiz
                </Button>
              </div>
            ) : (
              <Button onClick={markAsRead} loading={marking} size="lg" className="w-full">
                Mark as complete
              </Button>
            )}
          </div>
        </article>
      </PageTurn>
    </div>
  )
}
