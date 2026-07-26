import { NextRequest, NextResponse } from 'next/server'
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin'
import * as crypto from 'crypto'

function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex')
}

export async function GET(req: NextRequest) {
  // ONLY for development/demo purposes
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const db = getAdminDb()
    const auth = getAdminAuth()

    // 1. Create Demo School
    const schoolId = 'school_demo_123'
    await db.collection('schools').doc(schoolId).set({
      schoolCode: 'DEMO-123',
      name: 'Kid Learners Demo School',
      active: true,
      maxStudents: 100,
      createdAt: new Date().toISOString()
    })

    // 2. Create Demo Student
    const studentId = 'student_demo_01'
    const passwordHash = hashPassword('12345', studentId) // Passcode is 12345
    
    await db.collection('students').doc(studentId).set({
      schoolId: schoolId,
      studentCode: 'STUDENT-01',
      name: 'Demo Student',
      passwordHash: passwordHash,
      xp: 0,
      mustResetPassword: false,
      createdAt: new Date().toISOString()
    })

    // 3. Create Admin User (Superadmin)
    const adminEmail = 'admin@kidlearners.com'
    const adminPassword = 'password123'
    
    let adminRecord
    try {
      adminRecord = await auth.getUserByEmail(adminEmail)
    } catch (e) {
      // User doesn't exist, create it
      adminRecord = await auth.createUser({
        email: adminEmail,
        password: adminPassword,
        displayName: 'Demo Admin'
      })
    }

    // Set custom claims for admin
    await auth.setCustomUserClaims(adminRecord.uid, { role: 'superadmin' })
    
    // Create admin document in Firestore
    await db.collection('admins').doc(adminRecord.uid).set({
      email: adminEmail,
      name: 'Demo Admin',
      role: 'superadmin',
      createdAt: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully!',
      credentials: {
        student: {
          schoolId: 'DEMO-123',
          studentId: 'STUDENT-01',
          passcode: '12345'
        },
        admin: {
          email: adminEmail,
          password: adminPassword
        }
      }
    })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
