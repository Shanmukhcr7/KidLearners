'use client'

import { useEffect, useRef } from 'react'

export function PlayfulPhysicsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let shapesArray: Shape[] = []
    
    // Set up canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    // Mouse interaction
    const mouse = { x: -1000, y: -1000, radius: 150 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.x
      mouse.y = e.y
    }
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    const colors = [
      '#FF3366', // Bubblegum
      '#00E5FF', // Electric Blue
      '#FFD600', // Sunburst
    ]

    class Shape {
      x: number
      y: number
      size: number
      baseX: number
      baseY: number
      density: number
      color: string
      type: 'circle' | 'square' | 'triangle'
      rotation: number
      rotationSpeed: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.baseX = x
        this.baseY = y
        this.size = Math.random() * 20 + 10
        this.density = (Math.random() * 30) + 1
        this.color = colors[Math.floor(Math.random() * colors.length)]
        const types: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle']
        this.type = types[Math.floor(Math.random() * types.length)]
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.05
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        
        ctx.fillStyle = this.color
        ctx.globalAlpha = 0.6 // Semi-transparent playful feel
        
        ctx.beginPath()
        if (this.type === 'circle') {
          ctx.arc(0, 0, this.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (this.type === 'square') {
          // Rounded square feel
          ctx.roundRect(-this.size, -this.size, this.size * 2, this.size * 2, this.size * 0.3)
          ctx.fill()
        } else if (this.type === 'triangle') {
          ctx.moveTo(0, -this.size)
          ctx.lineTo(this.size, this.size)
          ctx.lineTo(-this.size, this.size)
          ctx.closePath()
          ctx.fill()
        }
        
        ctx.restore()
      }

      update() {
        this.rotation += this.rotationSpeed

        // Physics for mouse repulsion
        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        let forceDirectionX = dx / distance
        let forceDirectionY = dy / distance
        let maxDistance = mouse.radius
        let force = (maxDistance - distance) / maxDistance
        let directionX = forceDirectionX * force * this.density
        let directionY = forceDirectionY * force * this.density

        if (distance < mouse.radius) {
          this.x -= directionX
          this.y -= directionY
        } else {
          // Spring back to base position
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX
            this.x -= dx / 20
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY
            this.y -= dy / 20
          }
        }
      }
    }

    function init() {
      shapesArray = []
      // Less density than particles, these are big shapes
      let numberOfShapes = (canvas!.height * canvas!.width) / 30000
      for (let i = 0; i < numberOfShapes; i++) {
        let x = Math.random() * canvas!.width
        let y = Math.random() * canvas!.height
        shapesArray.push(new Shape(x, y))
      }
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < shapesArray.length; i++) {
        shapesArray[i].update()
        shapesArray[i].draw()
      }
      requestAnimationFrame(animate)
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReducedMotion) {
      init()
      animate()
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  )
}
