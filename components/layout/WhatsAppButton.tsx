'use client'

import { MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button after page loads
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Replace with your WhatsApp number (format: country code + number without + or spaces)
  // Example: 6591234567 for Singapore (+65 9123 4567)
  const whatsappNumber = '6591234567' // Update this with your actual WhatsApp number
  const message = 'Hello! I would like to learn more about your loan services.'
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 md:w-16 md:h-16
        bg-[#25D366] hover:bg-[#20BA5A]
        rounded-full
        flex items-center justify-center
        shadow-lg hover:shadow-2xl
        transition-all duration-300
        transform hover:scale-110
        group
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white fill-white" />
      
      {/* Pulse animation ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75 group-hover:opacity-0"></span>
    </a>
  )
}
