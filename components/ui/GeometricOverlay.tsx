'use client'

import { motion } from 'motion/react'

interface GeometricOverlayProps {
  className?: string
}

export default function GeometricOverlay({ className = '' }: GeometricOverlayProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Thick white lines forming geometric pattern - creating faceted effect */}
        {/* Main diagonal line from top-left to bottom-right */}
        <motion.line
          x1="0"
          y1="0"
          x2="1000"
          y2="800"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
        />
        
        {/* Diagonal line from top-right to bottom-left */}
        <motion.line
          x1="1000"
          y1="0"
          x2="0"
          y2="800"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
        />
        
        {/* Diagonal line - top section (left to right) */}
        <motion.line
          x1="0"
          y1="200"
          x2="600"
          y2="0"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
        />
        
        {/* Diagonal line - bottom section (left to right) */}
        <motion.line
          x1="400"
          y1="800"
          x2="1000"
          y2="600"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
        />
        
        {/* Horizontal line - upper section */}
        <motion.line
          x1="0"
          y1="300"
          x2="1000"
          y2="300"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
        />
        
        {/* Horizontal line - lower section */}
        <motion.line
          x1="0"
          y1="500"
          x2="1000"
          y2="500"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: 'easeOut' }}
        />
        
        {/* Vertical line - left section */}
        <motion.line
          x1="400"
          y1="0"
          x2="400"
          y2="800"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
        />
        
        {/* Vertical line - right section */}
        <motion.line
          x1="600"
          y1="0"
          x2="600"
          y2="800"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
        />
        
        {/* Colored polygons matching Finclix design - creating faceted effect */}
        {/* Large dark forest green triangle - top right quadrant */}
        <motion.polygon
          points="600,0 1000,0 1000,300 600,300"
          fill="hsl(140, 50%, 25%)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
        />
        
        {/* Lime green inverted triangle - center area */}
        <motion.polygon
          points="400,200 600,200 500,350"
          fill="hsl(120, 70%, 50%)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.65, ease: 'easeOut' }}
        />
        
        {/* Light blue-grey triangle - eye/glasses area */}
        <motion.polygon
          points="450,250 550,250 500,320"
          fill="hsl(200, 20%, 70%)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.67, ease: 'easeOut' }}
        />
        
        {/* White triangle - top left corner */}
        <motion.polygon
          points="0,0 400,0 0,200"
          fill="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.62, ease: 'easeOut' }}
        />
        
        {/* White quadrilateral - upper left section */}
        <motion.polygon
          points="0,200 400,200 600,0 0,0"
          fill="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.63, ease: 'easeOut' }}
        />
        
        {/* White triangle - center top */}
        <motion.polygon
          points="400,0 600,0 500,150"
          fill="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.64, ease: 'easeOut' }}
        />
        
        {/* White quadrilateral - left middle section */}
        <motion.polygon
          points="0,200 400,200 400,300 0,300"
          fill="white"
          fillOpacity="0.9"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.7, delay: 0.66, ease: 'easeOut' }}
        />
        
        {/* White triangle - bottom left corner */}
        <motion.polygon
          points="0,500 0,800 300,800"
          fill="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
        />
        
        {/* White quadrilateral - right middle section (below dark green) */}
        <motion.polygon
          points="600,300 1000,300 1000,500 600,500"
          fill="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.68, ease: 'easeOut' }}
        />
        
        {/* White triangle - bottom right corner */}
        <motion.polygon
          points="600,500 1000,500 1000,600 400,800"
          fill="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.72, ease: 'easeOut' }}
        />
        
        {/* Note: Areas not filled with polygons remain transparent, revealing the image through the faceted pattern */}
      </svg>
    </div>
  )
}
