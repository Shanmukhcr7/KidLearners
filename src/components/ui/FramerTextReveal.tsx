'use client'

import { motion } from 'framer-motion'

export function FramerTextReveal({ 
  text, 
  className = "", 
  delay = 0, 
  highlightWord = "", 
  highlightClass = "" 
}: { 
  text: string, 
  className?: string, 
  delay?: number, 
  highlightWord?: string, 
  highlightClass?: string 
}) {
  const words = text.split(" ")

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay
      }
    }
  }

  const item = {
    hidden: { y: "100%", opacity: 0 },
    show: { 
      y: "0%", 
      opacity: 1, 
      transition: { 
        type: "spring", 
        damping: 15, 
        stiffness: 100 
      } 
    }
  }

  // To properly split punctuation attached to the highlight word
  const cleanHighlight = highlightWord.replace(/[^\w\s]/gi, '')

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className={`${className} flex flex-wrap`}
    >
      {words.map((word, wordIndex) => {
        const isHighlight = cleanHighlight && word.replace(/[^\w\s]/gi, '').includes(cleanHighlight)
        
        return (
          <div key={wordIndex} className="overflow-hidden mr-[0.25em] pb-2">
            <motion.span 
              variants={item}
              className={`inline-block ${isHighlight ? highlightClass : ''}`}
            >
              {word}
            </motion.span>
          </div>
        )
      })}
    </motion.div>
  )
}
