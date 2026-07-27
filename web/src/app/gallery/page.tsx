"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { useEffect, useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/gallery`)
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch gallery", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pt-24 pb-12 px-6">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-slate-500 hover:text-blue-600 flex items-center gap-2 font-medium mb-8 w-fit transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <AnimatedSection>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">Gallery</h1>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl leading-relaxed">
            See KidLearners in action. Discover how students across the country are using our gamified platform to learn AI and modern tech skills.
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-indigo-600 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin" />
            <span className="font-bold">Loading Gallery...</span>
          </div>
        ) : (
          <>
            {images.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                <ImageIcon size={64} className="mb-4 text-slate-300" />
                <h3 className="text-xl font-bold text-slate-700">No Photos Yet</h3>
                <p className="mt-2 text-slate-500 text-center max-w-md">Our super admins are working on uploading some amazing photos of our classrooms. Check back soon!</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {images.map((img, i) => (
                  <AnimatedSection key={img.id} delay={i * 0.1}>
                    <div className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-slate-200 border border-slate-200/50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={img.url} 
                        alt={img.title} 
                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <span className="text-white font-bold text-lg drop-shadow-md">{img.title}</span>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
