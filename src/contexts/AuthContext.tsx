'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as FirebaseUser, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'
import type { User, Role } from '@/lib/firebase/firestore'

interface AuthContextValue {
  user:        FirebaseUser | null
  profile:     User | null
  role:        Role | null
  schoolId:    string | null
  loading:     boolean
  loginWithGoogle: () => Promise<void>
  logout:      () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user:        null,
  profile:     null,
  role:        null,
  schoolId:    null,
  loading:     true,
  loginWithGoogle: async () => {},
  logout:      async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,     setUser]     = useState<FirebaseUser | null>(null)
  const [profile,  setProfile]  = useState<User | null>(null)
  const [role,     setRole]     = useState<Role | null>(null)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) setLoading(true)
      setUser(firebaseUser)

      if (!firebaseUser) {
        setProfile(null)
        setRole(null)
        setSchoolId(null)
        setLoading(false)
        return
      }

      // Fetch unified user doc from Firestore
      const userRef = doc(db, 'users', firebaseUser.uid)
      const userSnap = await getDoc(userRef)
      
      let userData: User;

      if (userSnap.exists()) {
        userData = { id: userSnap.id, ...userSnap.data() } as User
      } else {
        // Auto-provision a new basic 'user'
        userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'New User',
          email: firebaseUser.email || '',
          role: 'user',
          schoolId: null,
          avatarUrl: firebaseUser.photoURL || '',
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        }
        await setDoc(userRef, userData)
      }

      // Update session cookie via API to keep Next.js middleware in sync (if needed)
      firebaseUser.getIdToken().then(token => {
        document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict`
      })

      setProfile(userData)
      setRole(userData.role)
      setSchoolId(userData.schoolId)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }
  
  const logout = async () => {
    await firebaseSignOut(auth)
    document.cookie = `__session=; path=/; max-age=0; SameSite=Strict` // clear cookie
  }

  return (
    <AuthContext.Provider value={{ user, profile, role, schoolId, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
