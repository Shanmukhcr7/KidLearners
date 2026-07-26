'use client'

import { useEffect, useState, useRef } from 'react'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { collection, query, orderBy, where, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore'
import { storage, db } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { UploadCloud, Image as ImageIcon, Video, Trash2, Loader2, Copy, Link } from 'lucide-react'

interface MediaItem {
  id: string
  name: string
  url: string
  type: 'image' | 'video'
  fullPath: string
}

export default function MediaGalleryPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [externalUrl, setExternalUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { profile, role, schoolId } = useAuth()

  const fetchMedia = async () => {
    setLoading(true)
    try {
      let q;
      if (role === 'superadmin') {
        q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))
      } else {
        q = query(collection(db, 'gallery'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'))
      }
      
      const snap = await getDocs(q)
      setItems(snap.docs.map(d => ({
        id: d.id,
        name: d.data().title,
        url: d.data().imageUrl,
        type: d.data().imageUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? 'video' : 'image',
        fullPath: d.data().storagePath || ''
      } as unknown as MediaItem)))
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profile) fetchMedia()
  }, [profile, role, schoolId])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    const storagePath = `gallery/${Date.now()}_${file.name}`
    const storageRef = ref(storage, storagePath)
    const uploadTask = uploadBytesResumable(storageRef, file)

    setUploading(true)
    setProgress(0)

    uploadTask.on('state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProgress(p)
      },
      (error) => {
        console.error("Upload failed", error)
        setUploading(false)
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        
        await addDoc(collection(db, 'gallery'), {
          title: file.name,
          imageUrl: url,
          storagePath,
          schoolId: role === 'superadmin' ? 'global' : schoolId,
          tags: [],
          date: new Date().toISOString(),
          createdAt: new Date().toISOString()
        })

        setUploading(false)
        fetchMedia() // Refresh the list
      }
    )
  }

  const handleAddUrl = async () => {
    if (!externalUrl) return
    setUploading(true)
    try {
      await addDoc(collection(db, 'gallery'), {
        title: externalUrl.split('/').pop() || 'External Media',
        imageUrl: externalUrl,
        storagePath: '', // No storage path for external URLs
        schoolId: role === 'superadmin' ? 'global' : schoolId,
        tags: [],
        date: new Date().toISOString(),
        createdAt: new Date().toISOString()
      })
      setExternalUrl('')
      setShowUrlInput(false)
      fetchMedia()
    } catch (error) {
      console.error("Failed to add URL", error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fullPath: string, docId?: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return
    try {
      if (fullPath) {
        const fileRef = ref(storage, fullPath)
        await deleteObject(fileRef).catch(console.error)
      }
      if (docId) {
        await deleteDoc(doc(db, 'gallery', docId))
      }
      fetchMedia()
    } catch (error) {
      console.error("Failed to delete", error)
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    alert("URL copied to clipboard!")
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media Gallery</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Upload workshop photos, school visits, and videos.</p>
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*,video/*" 
            className="hidden" 
          />
          <div className="flex items-center gap-3">
            {showUrlInput ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://..." 
                  className="px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                />
                <Button onClick={handleAddUrl} disabled={uploading}>Save</Button>
                <Button variant="outline" onClick={() => setShowUrlInput(false)}>Cancel</Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setShowUrlInput(true)}>
                <Link className="w-4 h-4 mr-2" /> Add URL
              </Button>
            )}
            
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading && !showUrlInput ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading {Math.round(progress)}%</>
              ) : (
                <><UploadCloud className="w-4 h-4 mr-2" /> Upload Media</>
              )}
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-slate-200 rounded-2xl bg-white shadow-sm">
          <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="font-bold text-slate-900 mb-1 text-lg">No media yet</h3>
          <p className="text-slate-500 text-sm">Upload your first photo or video to use in chapters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="aspect-square bg-slate-100 relative flex items-center justify-center overflow-hidden">
                {item.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.name} className="object-cover w-full h-full" />
                ) : (
                  <video src={item.url} className="object-cover w-full h-full" />
                )}
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-[#3A2E1F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => copyUrl(item.url)} className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors" title="Copy URL">
                    <Copy className="w-4 h-4 text-slate-900" />
                  </button>
                  <button onClick={() => handleDelete(item.fullPath, item.id)} className="p-2 bg-white rounded-full hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Badge */}
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur text-white text-[10px] uppercase font-bold px-2 py-1 rounded flex items-center gap-1">
                  {item.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                  {item.type}
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-slate-900 truncate" title={item.name}>{item.name.replace(/^\d+_/, '')}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
