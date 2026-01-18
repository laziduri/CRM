'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === 'undefined') return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      if (typeof window !== 'undefined' && canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Sphere parameters
    const numPoints = 60
    const radius = 250
    const centerX = canvas.width * 0.75
    const centerY = canvas.height * 0.5
    let rotationX = 0
    let rotationY = 0

    // Generate points on sphere
    const points: Array<{ x: number; y: number; z: number; originalX: number; originalY: number; originalZ: number }> = []
    for (let i = 0; i < numPoints; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      points.push({ x, y, z, originalX: x, originalY: y, originalZ: z })
    }

    // Animation loop
    let animationFrameId: number | null = null
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      rotationX += 0.002
      rotationY += 0.0015

      // Rotate points
      const rotatedPoints = points.map(point => {
        // Rotate around X axis
        let y = point.originalY * Math.cos(rotationX) - point.originalZ * Math.sin(rotationX)
        let z = point.originalY * Math.sin(rotationX) + point.originalZ * Math.cos(rotationX)
        
        // Rotate around Y axis
        const x = point.originalX * Math.cos(rotationY) + z * Math.sin(rotationY)
        z = -point.originalX * Math.sin(rotationY) + z * Math.cos(rotationY)

        return { x, y, z, originalX: point.originalX, originalY: point.originalY, originalZ: point.originalZ }
      })

      // Draw connections - using brand colors
      ctx.strokeStyle = 'rgba(15, 118, 110, 0.15)'
      ctx.lineWidth = 0.8
      
      for (let i = 0; i < rotatedPoints.length; i++) {
        for (let j = i + 1; j < rotatedPoints.length; j++) {
          const dx = rotatedPoints[i].x - rotatedPoints[j].x
          const dy = rotatedPoints[i].y - rotatedPoints[j].y
          const dz = rotatedPoints[i].z - rotatedPoints[j].z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
          
          if (distance < 140) {
            const opacity = Math.max(0, 1 - distance / 140) * 0.2
            // Mix teal and primary colors
            const r = Math.floor(15 + (30 - 15) * (i / rotatedPoints.length))
            const g = Math.floor(118 + (58 - 118) * (i / rotatedPoints.length))
            const b = Math.floor(110 + (95 - 110) * (i / rotatedPoints.length))
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(centerX + rotatedPoints[i].x, centerY + rotatedPoints[i].y)
            ctx.lineTo(centerX + rotatedPoints[j].x, centerY + rotatedPoints[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw points - using brand colors
      rotatedPoints.forEach(point => {
        const scale = 600 / (600 + point.z)
        const x = centerX + point.x * scale
        const y = centerY + point.y * scale
        const size = 2.5 * scale
        
        // Use teal color with varying opacity
        const opacity = (0.3 + scale * 0.4)
        ctx.fillStyle = `rgba(15, 118, 110, ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameId !== null && typeof window !== 'undefined') {
        cancelAnimationFrame(animationFrameId)
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', setCanvasSize)
      }
    }
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-white via-gray-50 to-white text-gray-900 min-h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Dotted background - using brand colors */}
      <div className="absolute inset-0 bg-dots-pattern-white opacity-50"></div>
      
      {/* Animated 3D Sphere */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
      />

      {/* Gradient overlays - soft colored lights */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-light/20 rounded-full blur-3xl animate-pulse-glow opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl animate-pulse-glow opacity-60" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center w-full">
          {/* Animated heading with words coming down */}
          <div className="mb-6 overflow-visible">
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 text-primary leading-tight pb-2">
              <span className="inline-block animate-word-drop">Find</span>{' '}
              <span className="inline-block animate-word-drop-delay-1">the</span>{' '}
              <span className="inline-block animate-word-drop-delay-2 text-teal">Best</span>
            </h1>
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-primary leading-tight pb-4">
              <span className="inline-block animate-word-drop-delay-3">Loans</span>{' '}
              <span className="inline-block animate-word-drop-delay-4">in</span>{' '}
              <span className="inline-block animate-word-drop-delay-5 text-teal pb-2">Singapore</span>
            </h1>
          </div>
          
          {/* Animated description */}
          <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-gray-700 max-w-4xl mx-auto animate-fade-in-up-delay">
            Compare personal loans, business loans, and more from top banks.{' '}
            <span className="text-gray-500">Fast approval, transparent rates, no hidden fees.</span>
          </p>
          
          {/* Animated buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up-delay-3">
            <Link href="/loans/business">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-10 py-5 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
                <span className="relative z-10">Business Loans</span>
              </Button>
            </Link>
            <Link href="/loans/personal">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-10 py-5 border-2 border-primary text-primary hover:bg-primary hover:text-white backdrop-blur-sm hover:scale-105 transition-all duration-300">
                Personal Loans
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade - seamless transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-gray-50/50 to-transparent pointer-events-none"></div>
    </section>
  )
}
