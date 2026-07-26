'use client'

import { useRef, useState } from 'react'
import Papa from 'papaparse'
import { addDoc, collection, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Upload, CheckCircle2, AlertTriangle, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import * as crypto from 'crypto'

interface ParsedRow {
  name:    string
  grade:   string
  schoolId?: string
}

interface ImportResult {
  name:        string
  studentCode: string
  tempPassword: string
  error?:      string
}

function generateStudentCode(name: string, index: number): string {
  const prefix = name.trim().slice(0, 2).toUpperCase().replace(/[^A-Z]/g, 'X')
  return `STU-${prefix}${String(index).padStart(4, '0')}`
}

function generateTempPassword(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex')
}

export default function CSVImportPage() {
  const { role, schoolId: adminSchoolId } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview,  setPreview]  = useState<ParsedRow[]>([])
  const [results,  setResults]  = useState<ImportResult[]>([])
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse<ParsedRow>(file, {
      header:          true,
      skipEmptyLines:  true,
      transformHeader: h => h.trim().toLowerCase(),
      complete: (res) => {
        setPreview(res.data.slice(0, 10))
        setResults([])
        setDone(false)
      },
    })
  }

  async function handleImport() {
    if (!preview.length) return
    setLoading(true)
    const outcome: ImportResult[] = []

    for (let i = 0; i < preview.length; i++) {
      const row  = preview[i]
      const name = row.name?.trim()
      if (!name) { outcome.push({ name: '(blank)', studentCode: '', tempPassword: '', error: 'Missing name' }); continue }

      const targetSchoolId = (role === 'superadmin' && row.schoolId) ? row.schoolId : adminSchoolId
      if (!targetSchoolId) { outcome.push({ name, studentCode: '', tempPassword: '', error: 'No school ID' }); continue }

      try {
        const studentCode = generateStudentCode(name, i + 1)
        const tempPw      = generateTempPassword()
        // We need the doc ID before we can hash — create then update
        const docRef = await addDoc(collection(db, 'users'), {
          name,
          studentCode,
          schoolId:          targetSchoolId,
          role:              'student',
          grade:             row.grade?.trim() ?? '',
          avatarUrl:         '',
          subjectsInterested: [],
          passwordHash:      '',  // filled below
          mustResetPassword: true,
          streak:            0,
          difficultyTier:    'beginner',
          createdAt:         new Date().toISOString(),
          lastActiveAt:      new Date().toISOString(),
        })
        const passwordHash = hashPassword(tempPw, docRef.id)
        await updateDoc(docRef, { passwordHash })

        outcome.push({ name, studentCode, tempPassword: tempPw })
      } catch (err) {
        outcome.push({ name, studentCode: '', tempPassword: '', error: String(err) })
      }
    }

    setResults(outcome)
    setLoading(false)
    setDone(true)
    const succeeded = outcome.filter(r => !r.error).length
    toast.success(`Imported ${succeeded} of ${outcome.length} students`)
  }

  function downloadResults() {
    const header = 'Name,Student Code,Temp Password,Error\n'
    const rows   = results.map(r =>
      `"${r.name}","${r.studentCode}","${r.tempPassword}","${r.error ?? ''}"`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url; a.download = 'import-results.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Import Students via CSV</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Upload a CSV with columns: <code className="bg-slate-100 px-1 rounded text-xs">name</code>, <code className="bg-slate-100 px-1 rounded text-xs">grade</code>
          {role === 'superadmin' && <>, <code className="bg-slate-100 px-1 rounded text-xs">schoolId</code></>}
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div
            className="border-2 border-dashed border-slate-200 rounded-[8px] p-10 text-center cursor-pointer hover:border-[var(--color-primary)] hover:bg-slate-50 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-900">Click to upload or drag & drop</p>
            <p className="text-xs text-slate-500 font-medium mt-1">CSV files only</p>
          </div>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
        </CardContent>
      </Card>

      {preview.length > 0 && !done && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Preview ({preview.length} rows)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 text-xs text-slate-500 font-semibold uppercase">Name</th>
                    <th className="text-left py-2 text-xs text-slate-500 font-semibold uppercase">Grade</th>
                    {role === 'superadmin' && <th className="text-left py-2 text-xs text-slate-500 font-semibold uppercase">School ID</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE6D3]">
                  {preview.map((row, i) => (
                    <tr key={i}>
                      <td className="py-2 text-slate-900">{row.name}</td>
                      <td className="py-2 text-slate-500">{row.grade}</td>
                      {role === 'superadmin' && <td className="py-2 text-slate-500 text-xs font-mono">{row.schoolId}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <Button onClick={handleImport} loading={loading}>
                Import {preview.length} students
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {done && results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Import complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5">
                  {r.error
                    ? <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    : <CheckCircle2  className="w-4 h-4 text-green-500 shrink-0" />}
                  <span className="text-sm font-medium text-slate-900">{r.name}</span>
                  {!r.error && (
                    <span className="text-xs text-slate-500 font-mono ml-auto">{r.studentCode}</span>
                  )}
                  {r.error && <span className="text-xs font-bold text-red-500 ml-auto">{r.error}</span>}
                </div>
              ))}
            </div>
            <Button variant="secondary" onClick={downloadResults}>
              <Download className="w-4 h-4" /> Download credentials CSV
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
