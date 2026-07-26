'use client'

import { useEffect, useState, useRef } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Loader2, UploadCloud, Save, Image as ImageIcon, Video, Link as LinkIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SiteSettingsPage() {
  const { role } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [contentImageUrl, setContentImageUrl] = useState('')

  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingContent, setUploadingContent] = useState(false)
  
  const heroInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const contentInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchSettings() {
      if (role !== 'superadmin') return
      try {
        const snap = await getDoc(doc(db, 'settings', 'homepage'))
        if (snap.exists()) {
          const data = snap.data()
          if (data.heroImageUrl) setHeroImageUrl(data.heroImageUrl)
          if (data.videoUrl) setVideoUrl(data.videoUrl)
          if (data.contentImageUrl) setContentImageUrl(data.contentImageUrl)
        }
      } catch (err) {
        console.error("Failed to load settings", err)
        toast.error("Failed to load settings")
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [role])

  const handleSave = async () => {
    if (role !== 'superadmin') return
    setSaving(true)
    try {
      await setDoc(doc(db, 'settings', 'homepage'), {
        heroImageUrl,
        videoUrl,
        contentImageUrl,
        updatedAt: new Date().toISOString()
      }, { merge: true })
      toast.success("Homepage settings saved!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    type: 'hero' | 'video' | 'content'
  ) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const storagePath = `settings/${Date.now()}_${file.name}`
    const storageRef = ref(storage, storagePath)
    const uploadTask = uploadBytesResumable(storageRef, file)

    const setUploading = type === 'hero' ? setUploadingHero : type === 'video' ? setUploadingVideo : setUploadingContent
    const setUrl = type === 'hero' ? setHeroImageUrl : type === 'video' ? setVideoUrl : setContentImageUrl

    setUploading(true)
    toast.loading(`Uploading ${type}...`, { id: `upload-${type}` })

    uploadTask.on('state_changed',
      (snapshot) => {},
      (error) => {
        console.error("Upload failed", error)
        toast.error("Upload failed", { id: `upload-${type}` })
        setUploading(false)
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        setUrl(url)
        toast.success(`Upload complete!`, { id: `upload-${type}` })
        setUploading(false)
      }
    )
  }

  if (role !== 'superadmin') {
    return <div className="p-8">Access Denied</div>
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Site Settings</h1>
          <p className="text-slate-500 font-medium">Manage the global KidLearners landing page content.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg" className="rounded-full shadow-lg">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Hero Image Section */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Hero Background</h2>
              <p className="text-sm text-slate-500">The main full-screen image on the homepage.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Image URL
              </label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..." 
                  className="flex-1 p-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <input 
                  type="file" 
                  ref={heroInputRef} 
                  onChange={(e) => handleFileUpload(e, 'hero')} 
                  accept="image/*" 
                  className="hidden" 
                />
                <Button 
                  onClick={() => heroInputRef.current?.click()} 
                  disabled={uploadingHero}
                  variant="outline"
                  className="shrink-0"
                >
                  {uploadingHero ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                  Direct Upload
                </Button>
              </div>
            </div>

            {heroImageUrl && (
              <div className="mt-4 rounded-xl overflow-hidden aspect-video relative border border-slate-200 shadow-sm bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded font-bold">
                  Preview
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Video Section */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Landing Page Video</h2>
              <p className="text-sm text-slate-500">The video displayed in the Subscription section.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Video URL (MP4)
              </label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://.../video.mp4" 
                  className="flex-1 p-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <input 
                  type="file" 
                  ref={videoInputRef} 
                  onChange={(e) => handleFileUpload(e, 'video')} 
                  accept="video/*" 
                  className="hidden" 
                />
                <Button 
                  onClick={() => videoInputRef.current?.click()} 
                  disabled={uploadingVideo}
                  variant="outline"
                  className="shrink-0"
                >
                  {uploadingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                  Direct Upload
                </Button>
              </div>
            </div>

            {videoUrl && (
              <div className="mt-4 rounded-xl overflow-hidden aspect-video relative border border-slate-200 shadow-sm bg-black">
                <video src={videoUrl} controls className="w-full h-full object-contain" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded font-bold">
                  Preview
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Content Image Section */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Feature Section Image</h2>
              <p className="text-sm text-slate-500">The large image below the video (Fueling Minds section).</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Image URL
              </label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={contentImageUrl}
                  onChange={(e) => setContentImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..." 
                  className="flex-1 p-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <input 
                  type="file" 
                  ref={contentInputRef} 
                  onChange={(e) => handleFileUpload(e, 'content')} 
                  accept="image/*" 
                  className="hidden" 
                />
                <Button 
                  onClick={() => contentInputRef.current?.click()} 
                  disabled={uploadingContent}
                  variant="outline"
                  className="shrink-0"
                >
                  {uploadingContent ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                  Direct Upload
                </Button>
              </div>
            </div>

            {contentImageUrl && (
              <div className="mt-4 rounded-xl overflow-hidden aspect-video relative border border-slate-200 shadow-sm bg-slate-100 max-h-64 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={contentImageUrl} alt="Feature Preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded font-bold">
                  Preview
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
