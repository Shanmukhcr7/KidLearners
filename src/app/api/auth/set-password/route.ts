// POST /api/auth/set-password
// Student sets a new password (first login or requested reset)

import { NextRequest, NextResponse } from 'next/server'
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin'
import * as crypto from 'crypto'

function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('Authorization')
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }
    const idToken   = authorization.slice(7)
    const decoded   = await getAdminAuth().verifyIdToken(idToken)
    const studentId = decoded.uid

    if (decoded.role !== 'student') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { newPassword } = await req.json()
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const passwordHash = hashPassword(newPassword, studentId)

    await getAdminDb().collection('students').doc(studentId).update({
      passwordHash,
      mustResetPassword: false,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[set-password]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
