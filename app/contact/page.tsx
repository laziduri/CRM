import ContactForm from '@/components/forms/ContactForm'
import Card from '@/components/ui/Card'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      
      {/* Soft gradient overlays */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-light/5 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-gradient-text">Get in Touch</h1>
          <p className="text-lg text-accent-gray2 max-w-2xl mx-auto">
            Have a question? We&apos;re here to help. Get in touch with our team or visit our office.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Contact Information & Map */}
          <div className="space-y-8">
            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 gap-6">
              <Card hover className="p-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-primary to-teal p-3 rounded-full mr-4 flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                    <p className="text-gray-600 mb-1">admin@brillianceadvisory.sg</p>
                    <p className="text-sm text-accent-gray2">We&apos;ll respond within 24 hours</p>
                  </div>
                </div>
              </Card>

              <Card hover className="p-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-primary to-teal p-3 rounded-full mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
                    <p className="text-gray-600 mb-1">+6580385584</p>
                    <p className="text-sm text-accent-gray2">Mon - Fri, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </Card>

              <Card hover className="p-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-primary to-teal p-3 rounded-full mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
                    <p className="text-gray-600 mb-1">400 Orchard Rd, Singapore 238875</p>
                    <p className="text-sm text-accent-gray2">By appointment only</p>
                  </div>
                </div>
              </Card>

              <Card hover className="p-6">
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-primary to-teal p-3 rounded-full mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
                    <p className="text-gray-600 mb-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Map */}
            <Card className="p-0 overflow-hidden shadow-lg">
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
              <div className="p-6 bg-white border-t border-secondary-gray3">
                <h3 className="font-semibold text-gray-900 mb-2">Our Location</h3>
                <p className="text-gray-600 text-sm">400 Orchard Rd, Singapore 238875</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=400+Orchard+Rd+Singapore+238875"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-teal text-sm mt-2 inline-block transition-colors"
                >
                  View on Google Maps →
                </a>
              </div>
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
