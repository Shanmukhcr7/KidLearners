'use client'

import { useEffect, useState } from 'react'

export function LoadingOverlay() {
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    // Wait for the window load event to ensure critical assets are ready,
    // or just fade out if already loaded
    const handleLoad = () => {
      // Add a slight delay so the animation can be appreciated
      setTimeout(() => {
        setIsFading(true)
        setTimeout(() => setIsVisible(false), 500) // Match CSS fade out duration
      }, 800)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');

        .kidlearners-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #F4EAD5;
          background-image: radial-gradient(circle at center, transparent 30%, rgba(19, 34, 63, 0.08) 120%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: opacity 0.5s ease-out;
        }

        .kidlearners-overlay.fading {
          opacity: 0;
        }

        .coin-scene {
          perspective: 800px;
          width: 120px;
          height: 120px;
          margin-bottom: 2rem;
          position: relative;
        }
        @media (min-width: 768px) {
          .coin-scene {
            width: 180px;
            height: 180px;
          }
        }

        .coin-wrapper {
          width: 100%;
          height: 100%;
          position: absolute;
          transform-style: preserve-3d;
          animation: coin-spin 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        /* The true 3D edge created by stacking discs */
        .coin-layer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #13223F;
        }

        .coin-face {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          backface-visibility: hidden;
          background-image: url('/logo-seal.png');
          background-size: cover;
          background-position: center;
          border: 2px solid #13223F;
        }

        .coin-front {
          transform: translateZ(4px);
        }
        
        .coin-back {
          transform: rotateY(180deg) translateZ(4px);
        }

        .coin-shadow {
          position: absolute;
          bottom: -40px;
          left: 50%;
          width: 80px;
          height: 15px;
          margin-left: -40px;
          background: rgba(19, 34, 63, 0.4);
          border-radius: 50%;
          filter: blur(8px);
          animation: shadow-pulse 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
        @media (min-width: 768px) {
          .coin-shadow {
            bottom: -50px;
            width: 120px;
            margin-left: -60px;
          }
        }

        .loading-text {
          font-family: 'Cinzel', serif;
          color: #13223F;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
        }
        @media (min-width: 768px) {
          .loading-text {
            font-size: 1.25rem;
          }
        }

        .dot {
          animation: dot-pulse 1.4s infinite;
          opacity: 0.2;
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes coin-spin {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          25% { transform: rotateX(12deg) rotateY(90deg); }
          50% { transform: rotateX(0deg) rotateY(180deg); }
          75% { transform: rotateX(-12deg) rotateY(270deg); }
          100% { transform: rotateX(0deg) rotateY(360deg); }
        }

        @keyframes shadow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          25%, 75% { transform: scale(0.4); opacity: 0.15; }
          50% { transform: scale(1); opacity: 0.5; }
        }

        @keyframes dot-pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .coin-wrapper {
            animation: reduce-pulse 2s ease-in-out infinite;
          }
          .coin-shadow {
            animation: none;
            opacity: 0.3;
          }
          .coin-back, .coin-layer {
            display: none;
          }
        }

        @keyframes reduce-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
      `}} />
      
      <div className={`kidlearners-overlay ${isFading ? 'fading' : ''}`}>
        <div className="coin-scene">
          <div className="coin-wrapper">
            {/* The 3D thickness layers */}
            <div className="coin-layer" style={{ transform: 'translateZ(3px)' }} />
            <div className="coin-layer" style={{ transform: 'translateZ(2px)' }} />
            <div className="coin-layer" style={{ transform: 'translateZ(1px)' }} />
            <div className="coin-layer" style={{ transform: 'translateZ(0px)' }} />
            <div className="coin-layer" style={{ transform: 'translateZ(-1px)' }} />
            <div className="coin-layer" style={{ transform: 'translateZ(-2px)' }} />
            <div className="coin-layer" style={{ transform: 'translateZ(-3px)' }} />
            
            {/* Faces */}
            <div className="coin-face coin-front" />
            <div className="coin-face coin-back" />
          </div>
          <div className="coin-shadow" />
        </div>
        
        <div className="loading-text">
          LOADING
          <span className="ml-1 tracking-normal">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>
        </div>
      </div>
    </>
  )
}
