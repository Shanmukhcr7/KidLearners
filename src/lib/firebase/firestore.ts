// Typed Firestore helpers matching the schema in the build spec
import {
  collection,
  doc,
  CollectionReference,
  DocumentReference,
} from 'firebase/firestore'
import { db } from './client'

// ─── Types ─────────────────────────────────────────────────────────────────

export type SchoolStatus = 'active' | 'inactive'

export interface School {
  id:               string
  name:             string
  schoolCode:       string   // e.g. KL-HYD042
  logoUrl:          string
  city:             string
  contactPerson:    string
  contactEmail:     string
  tieUpDate:        string   // ISO
  active:           boolean
  aggregateScore:   number
  averageScore:     number
  activeStudentCount: number
  rank:             number
  rankTrend:        number   // positive = moved up, negative = moved down
  subscriptionTier?: 'free' | 'pro' | 'enterprise'
  stripeCustomerId?: string
}

export type Role = 'user' | 'student' | 'school_admin' | 'superadmin'

export interface User {
  id:               string
  name:             string
  email:            string
  role:             Role
  schoolId:         string | null
  avatarUrl:        string
  createdAt:        string
  lastActiveAt:     string
  
  // Student specific fields (only populated if role == 'student')
  grade?:           string
  subjectsInterested?: string[]
  streak?:          number
  difficultyTier?:  'beginner' | 'intermediate' | 'advanced'
  xp?:              number
  unlockedAvatars?: string[]
}

export interface Subject {
  id:          string
  name:        string
  description: string
  iconName:    string
  chapterCount: number
}

export interface Chapter {
  id:             string
  subjectId:      string
  title:          string
  order:          number
  content:        string   // rich text / HTML
  estimatedMinutes: number
  quizId:         string
}

export interface QuizQuestion {
  questionText: string
  options:      string[]
  correctIndex: number    // NEVER sent to client before submission
  points:       number
}

export interface Quiz {
  id:            string
  chapterId:     string
  questions:     QuizQuestion[]
  passThreshold: number   // 0-100 %
}

export type ChapterProgressStatus =
  | 'not_started'
  | 'reading'
  | 'quiz_available'
  | 'completed'

export interface ChapterProgress {
  status:           ChapterProgressStatus
  firstAttemptScore:  number | null
  bestAttemptScore:   number | null
  attempts:         number
  completedAt:      string | null
}

export interface Project {
  id:               string
  title:            string
  subjectId:        string
  difficulty:       'beginner' | 'intermediate' | 'advanced'
  steps:            { title: string; content: string }[]
  estimatedMinutes: number
}

export interface ChatMessage {
  id:        string
  role:      'student' | 'ai'
  text:      string
  timestamp: string
  flagged:   boolean
}

export interface Certificate {
  id:               string
  studentId:        string
  subjectId:        string
  issuedAt:         string
  fileUrl:          string
  verificationSlug: string
}

export interface Workshop {
  id:               string
  title:            string
  description:      string
  videoUrl:         string
  thumbnailUrl:     string
  date:             string // ISO
  tags:             string[]
  published:        boolean
  createdAt:        string
}

export interface GalleryItem {
  id:               string
  schoolId?:        string // if null, it's a global kidlearners event
  title:            string
  imageUrl:         string
  date:             string
  tags:             string[]
  createdAt:        string
}

export interface Blog {
  id:               string
  title:            string
  slug:             string
  content:          string // Rich text HTML
  authorId:         string
  coverImageUrl:    string
  published:        boolean
  createdAt:        string
}

export interface Task {
  id:               string
  schoolId:         string // The school this task is for
  title:            string
  description:      string
  dueDate:          string // ISO
  assignedTo:       string[] // Array of student IDs or "all"
  type:             'reading' | 'assignment' | 'project'
  createdAt:        string
}

export interface Exam {
  id:               string
  schoolId?:        string // if null, it's a global exam
  title:            string
  description:      string
  type:             'mcq' | 'short_answer' | 'coding'
  startTime:        string // ISO
  endTime:          string // ISO
  durationMinutes:  number
  questions:        any[] // Can define specific types later
  createdAt:        string
}

export interface Notification {
  id:               string
  userId:           string
  title:            string
  message:          string
  read:             boolean
  createdAt:        string
}

export interface SiteSettings {
  id: string // typically 'homepage'
  heroImageUrl?: string
  videoUrl?: string
  contentImageUrl?: string // The large image in the Fueling Minds section
  updatedAt?: string
}

// Legacy interfaces kept temporarily for backwards compat with scripts if needed
export interface Admin {
  id:       string
  name:     string
  email:    string
  role:     'admin' | 'superadmin'
  schoolId: string | null
}

// ─── Collection references ──────────────────────────────────────────────────

export const schoolsCol    = () => collection(db, 'schools')    as CollectionReference<School>
export const usersCol      = () => collection(db, 'users')      as CollectionReference<User>
export const subjectsCol   = () => collection(db, 'subjects')   as CollectionReference<Subject>
export const chaptersCol   = () => collection(db, 'chapters')   as CollectionReference<Chapter>
export const quizzesCol    = () => collection(db, 'quizzes')    as CollectionReference<Omit<Quiz, 'questions'> & { questions: Omit<QuizQuestion, 'correctIndex'>[] }>
export const projectsCol   = () => collection(db, 'projects')   as CollectionReference<Project>
export const certificatesCol = () => collection(db, 'certificates') as CollectionReference<Certificate>
export const workshopsCol  = () => collection(db, 'workshops')  as CollectionReference<Workshop>
export const galleryCol    = () => collection(db, 'gallery')    as CollectionReference<GalleryItem>
export const blogsCol      = () => collection(db, 'blogs')      as CollectionReference<Blog>
export const tasksCol      = () => collection(db, 'tasks')      as CollectionReference<Task>
export const examsCol      = () => collection(db, 'exams')      as CollectionReference<Exam>
export const notificationsCol = () => collection(db, 'notifications') as CollectionReference<Notification>
export const settingsCol   = () => collection(db, 'settings')   as CollectionReference<SiteSettings>

export const schoolDoc  = (id: string) => doc(db, 'schools', id)  as DocumentReference<School>
export const userDoc    = (id: string) => doc(db, 'users', id)    as DocumentReference<User>
export const subjectDoc = (id: string) => doc(db, 'subjects', id) as DocumentReference<Subject>
export const chapterDoc = (id: string) => doc(db, 'chapters', id) as DocumentReference<Chapter>
export const quizDoc    = (id: string) => doc(db, 'quizzes', id)

export const chapterProgressDoc = (studentId: string, chapterId: string) =>
  doc(db, 'studentChapterProgress', studentId, 'chapters', chapterId) as DocumentReference<ChapterProgress>

export const chapterProgressCol = (studentId: string) =>
  collection(db, 'studentChapterProgress', studentId, 'chapters') as CollectionReference<ChapterProgress>

export const chatMessagesCol = (studentId: string, subjectId: string) =>
  collection(db, 'chatSessions', studentId, 'subjects', subjectId, 'messages') as CollectionReference<ChatMessage>
