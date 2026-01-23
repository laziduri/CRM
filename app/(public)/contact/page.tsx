import Link from 'next/link'
import Image from 'next/image'
import ContactForm from '@/components/forms/ContactForm'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CalmBackground } from '@/components/background/CalmBackground'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { Mail, Phone, MapPin, Clock, ArrowRight, Users, TrendingUp, Zap, UserCheck } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Hero Section with Background Image */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden w-full">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/contactpagehader.png"
            alt="Contact us - Professional consultation"
            fill
            priority
            className="object-cover object-center"
            quality={90}
            sizes="100vw"
          />
        </div>
        
        {/* Overlay for Text Readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-navy/75 via-navy/60 to-navy/45" />
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <AnimatedGradientText 
              className="text-4xl md:text-5xl lg:text-6xl"
              colorFrom="hsl(0, 0%, 100%)"
              colorTo="hsl(180, 45%, 70%)"
            >
              Get in Touch
            </AnimatedGradientText>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Have a question? We&apos;re here to help. Get in touch with our team or visit our office.
          </p>
        </div>
      </section>

      <div className="relative bg-white py-12">
        <CalmBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Information & Map */}
          <div className="space-y-8 mb-12">
            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card hover className="p-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-navy to-teal p-3 rounded-full mr-4 flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">Email Us</h3>
                    <p className="text-gray-700 mb-2">admin@brillianceadvisory.sg</p>
                    <p className="text-sm text-gray-600">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>
              </Card>

              <Card hover className="p-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-navy to-teal p-3 rounded-full mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">Call Us</h3>
                    <p className="text-gray-700 mb-2">+6580385584</p>
                    <p className="text-sm text-gray-600">Mon - Fri, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </Card>

              <Card hover className="p-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-navy to-teal p-3 rounded-full mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">Visit Us</h3>
                    <p className="text-gray-700 mb-2">400 Orchard Rd, Singapore 238875</p>
                    <p className="text-sm text-gray-600">By appointment only</p>
                  </div>
                </div>
              </Card>

              <Card hover className="p-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-navy to-teal p-3 rounded-full mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy mb-2">Business Hours</h3>
                    <p className="text-gray-700 mb-2">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-700">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Map */}
            <Card className="p-0 overflow-hidden shadow-lg border-gray-200">
              <div className="w-full h-[400px] relative bg-gray-100 rounded-t-xl overflow-hidden">
                <iframe
                  src="https://maps.google.com/maps?q=400+Orchard+Rd,+Singapore+238875&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Brilliance Advisory Location - 400 Orchard Rd, Singapore 238875"
                  className="w-full h-full"
                />
              </div>
                <div className="p-6 bg-white border-t border-gray-200">
                <h3 className="font-semibold text-navy mb-2">Our Location</h3>
                <p className="text-gray-700 text-sm">400 Orchard Rd, Singapore 238875</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=400+Orchard+Rd+Singapore+238875"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal hover:text-teal-dark text-sm mt-2 inline-block transition-colors"
                >
                  View on Google Maps →
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Form - Full Width Section */}
      <section className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="contact-form">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="relative mt-20 mb-0 overflow-hidden bg-gradient-to-br from-primary/5 via-white to-teal/5 min-h-[600px]">
          {/* Background Image Layer - Only render if image exists */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/business-handshake-close-up.jpg"
              alt="Business handshake partnership"
              fill
              className="object-cover object-center"
              quality={90}
              sizes="100vw"
              unoptimized
            />
          </div>
          
          {/* Overlay for Text Readability */}
          <div className="absolute inset-0 z-[1] bg-black/50" />
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Partner With Us
                </h2>
                <p className="text-lg text-white mb-6 leading-relaxed">
                  We&apos;re always looking to collaborate with financial institutions, service providers, and businesses that share our commitment to excellence and client-first service. Let&apos;s explore how we can work together.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Financial Institutions</h3>
                      <p className="text-white/90 text-sm">Partner with us to expand your reach and connect with qualified clients.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Service Providers</h3>
                      <p className="text-white/90 text-sm">Collaborate on complementary services that benefit our mutual clients.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Business Partners</h3>
                      <p className="text-white/90 text-sm">Join our network and create value together for businesses and individuals.</p>
                    </div>
                  </div>
                </div>
                <Link href="#contact-form">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Discuss Partnership
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </Button>
                </Link>
              </div>
              <div className="lg:pl-8">
                <div className="bg-white rounded-xl p-8 border-2 border-gray-200 shadow-lg">
                  <h3 className="text-xl font-bold text-navy mb-4">Why Partner With Us?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-navy rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">Established network of clients seeking financing solutions</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-navy rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">Transparent and ethical business practices</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-navy rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">Dedicated partnership management and support</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  )
}
