'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs, query, limit, doc, getDoc, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { GalleryItem, SiteSettings } from '@/lib/firebase/firestore'

// Default values while loading
const DEFAULT_HERO = "https://res.cloudinary.com/byytry3h/image/upload/v1785055106/school-image-website_krtofq.webp"
const DEFAULT_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4"

export default function LandingPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Settings
        const settingsSnap = await getDoc(doc(db, 'settings', 'homepage'))
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as SiteSettings)
        }

        // Fetch latest 4 gallery images
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(4))
        const galSnap = await getDocs(q)
        setGallery(galSnap.docs.map(d => d.data() as GalleryItem))
      } catch (err) {
        console.error("Failed to fetch landing data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const heroImage = settings?.heroImageUrl || DEFAULT_HERO
  const videoUrl = settings?.videoUrl || DEFAULT_VIDEO

  if (loading) {
    return <div className="min-h-screen bg-[#e6e3df] flex items-center justify-center font-cormorant text-2xl text-[#1a2634]">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-[#e6e3df] text-[#1a2634] font-sans selection:bg-[#1a2634] selection:text-[#e6e3df] overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[95vh] min-h-[700px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="Kids learning" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
        </div>

        {/* Minimal Navigation */}
        <nav className="absolute top-0 inset-x-0 z-50 px-8 py-8 flex items-center justify-between text-white">
          <Link href="/" className="font-cormorant text-2xl font-medium tracking-wide">
            Kidlearners
          </Link>
          <div className="flex items-center gap-10">
            <Link href="#gallery" className="text-sm font-medium hover:opacity-70 transition-opacity">
              Gallery
            </Link>
            <Link href="/login" className="bg-white text-slate-900 px-8 py-3 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors shadow-lg">
              Login
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-cormorant text-6xl md:text-8xl lg:text-[100px] text-white font-medium leading-[1.1] mb-6 tracking-tight whitespace-nowrap"
          >
            Unlock Serious Brainpower
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/90 text-lg md:text-xl max-w-2xl font-cormorant mb-10"
          >
            Dominate exams, crush deadlines, and unleash your academic<br />edge—fast.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/login" className="bg-white text-slate-900 px-10 py-4 rounded-full text-sm font-bold hover:scale-105 transition-transform duration-300 shadow-xl">
              Start Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Video Section */}
      <section className="bg-[#1a2634] text-white py-32 px-8 overflow-hidden">
        {/* Marquee Heading */}
        <div className="w-full overflow-hidden mb-24 relative whitespace-nowrap flex">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            className="flex font-cormorant text-[120px] leading-none whitespace-nowrap"
          >
            <span className="px-8">Learning—Anytime, Anywhere</span>
            <span className="px-8 text-white/50">•</span>
            <span className="px-8">Own Your Future</span>
            <span className="px-8 text-white/50">•</span>
            <span className="px-8">Learning—Anytime, Anywhere</span>
            <span className="px-8 text-white/50">•</span>
            <span className="px-8">Own Your Future</span>
            <span className="px-8 text-white/50">•</span>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-8 relative rounded-xl overflow-hidden aspect-video bg-black/20 group cursor-pointer shadow-2xl">
            <video src={videoUrl} className="w-full h-full object-cover" controls preload="metadata" />
          </div>
          
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="border border-white/20 p-10 relative">
              <div className="absolute top-6 right-6 w-5 h-5 rounded-full border-2 border-red-500/80 text-red-500/80 flex items-center justify-center text-xs font-bold font-sans">
                !
              </div>
              
              <h3 className="font-cormorant text-4xl mb-4">Unlimited Access</h3>
              <p className="text-5xl font-cormorant mb-6">₹100.00</p>
              <p className="text-sm text-white/60 font-sans mb-8 leading-relaxed">
                Get anytime access to our growing collection of classes, workshops, and exclusive content. New items added every month.
              </p>
              <Link href="/login" className="inline-block bg-white text-slate-900 px-8 py-3 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors shadow-lg">
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Content Section */}
      <section className="bg-[#1a2634] text-white pt-24 pb-0 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <h2 className="font-cormorant text-6xl md:text-7xl max-w-xl leading-tight">
            Fueling Minds,<br />Forging Futures
          </h2>
          <div className="flex flex-col sm:flex-row gap-8 md:gap-16 max-w-2xl text-white/80 font-cormorant text-[22px] leading-relaxed">
            <p className="flex-1">
              We deliver relentless academic support designed for ambitious learners who refuse to settle.
            </p>
            <p className="flex-1">
              Our methods merge data, discipline, and drive to create results that stick long after graduation.
            </p>
          </div>
        </div>
        
        <div className="w-full h-[600px] lg:h-[700px] overflow-hidden">
          <img 
            src={settings?.contentImageUrl || "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=3270&auto=format&fit=crop"} 
            alt="Students" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 4. Gallery Section */}
      <section id="gallery" className="bg-[#e6e3df] text-[#1a2634] py-32 px-8 overflow-hidden">
        <div className="w-full overflow-hidden mb-24 relative whitespace-nowrap flex">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
            className="flex font-cormorant text-[120px] leading-none whitespace-nowrap"
          >
            <span className="px-8">Knowledge Hits</span>
            <span className="px-8 text-black/20">•</span>
            <span className="px-8">Follow Our Journey</span>
            <span className="px-8 text-black/20">•</span>
            <span className="px-8">Knowledge Hits</span>
            <span className="px-8 text-black/20">•</span>
            <span className="px-8">Follow Our Journey</span>
            <span className="px-8 text-black/20">•</span>
          </motion.div>
        </div>

        <div className="flex justify-center mb-20">
          <Link href="/login" className="bg-[#1a2634] text-white px-10 py-4 rounded-full text-sm font-bold hover:scale-105 transition-transform duration-300 shadow-xl">
            Connect
          </Link>
        </div>

        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gallery.length > 0 ? gallery.map((item, i) => (
            <div key={item.id || i} className="aspect-square bg-white shadow-sm overflow-hidden group">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          )) : (
            <>
              {[
                "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1400&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?q=80&w=1400&auto=format&fit=crop"
              ].map((img, i) => (
                <div key={i} className="aspect-square bg-white shadow-sm overflow-hidden group">
                  <img src={img} alt="Gallery placeholder" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-[#e6e3df] border-t border-[#1a2634]/10 text-[#1a2634] py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h2 className="font-cormorant text-5xl mb-4">Kidlearners</h2>
            <p className="text-sm font-cormorant opacity-60">Made with Advanced Agentic AI</p>
          </div>
          <div>
            <a href="mailto:hello@kidlearners.com" className="font-cormorant text-4xl hover:opacity-70 transition-opacity">
              hello@kidlearners.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
