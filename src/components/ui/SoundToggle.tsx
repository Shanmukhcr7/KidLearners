'use client'

import { useState, useEffect } from 'react'
import { SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react/dist/ssr'
import { soundManager } from '@/lib/sound'

export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted())

  useEffect(() => {
    const handleMuteChange = (e: Event) => {
      setIsMuted((e as CustomEvent).detail)
    }
    window.addEventListener('kidlearner:mutechange', handleMuteChange)
    return () => window.removeEventListener('kidlearner:mutechange', handleMuteChange)
  }, [])

  return (
    <button
      onClick={() => soundManager.toggleMute()}
      className="p-2 text-[var(--neutral-subtext)] hover:text-slate-900 transition-colors rounded-lg hover:bg-[var(--border)]"
      title={isMuted ? "Unmute sounds" : "Mute sounds"}
      aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      {isMuted ? <SpeakerSlash weight="bold" className="w-5 h-5" /> : <SpeakerHigh weight="bold" className="w-5 h-5" />}
    </button>
  )
}
