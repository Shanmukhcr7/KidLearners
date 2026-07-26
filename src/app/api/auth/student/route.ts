import { NextResponse } from 'next/server'
import { getAdminDb, getAdminAuth } from '@/lib/firebase/admin'
import * as crypto from 'crypto'

function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex')
}

export async function POST(req: Request) {
  try {
    const { studentCode, password } = await req.json()

    if (!studentCode || !password) {
      return NextResponse.json({ error: 'Missing studentCode or password' }, { status: 400 })
    }

    const db = getAdminDb()
    const usersRef = db.collection('users')
    
    // Find the user by studentCode
    const snapshot = await usersRef.where('studentCode', '==', studentCode).limit(1).get()
    
    if (snapshot.empty) {
      return NextResponse.json({ error: 'Invalid Student Code or Password' }, { status: 401 })
    }

    const userDoc = snapshot.docs[0]
    const userData = userDoc.data()

    // Verify password hash (using document ID as salt, as implemented in import script)
    const expectedHash = hashPassword(password, userDoc.id)
    
    if (userData.passwordHash !== expectedHash) {
      return NextResponse.json({ error: 'Invalid Student Code or Password' }, { status: 401 })
    }

    // Generate Firebase Custom Token
    const auth = getAdminAuth()
    const customToken = await auth.createCustomToken(userDoc.id)

    return NextResponse.json({ token: customToken })
  } catch (err: any) {
    console.error('Student login error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
