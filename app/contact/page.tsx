import Link from 'next/link'
import ContactForm from '@/components/forms/ContactForm'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Mail, Phone, MapPin, Clock, ArrowRight, FileText, Users, TrendingUp, Zap, UserCheck } from 'lucide-react'

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
          <div id="contact-form">
            <ContactForm />
          </div>
        </div>

        {/* Partnership Section */}
        <section className="mt-20 mb-16">
          <Card className="bg-gradient-to-br from-primary/5 via-white to-teal/5 border-2 border-primary/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
            
            <div className="relative z-10 p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
                    <UserCheck className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">Strategic Partnerships</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
                    Partner With Us
                  </h2>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    We&apos;re always looking to collaborate with financial institutions, service providers, and businesses that share our commitment to excellence and client-first service. Let&apos;s explore how we can work together.
                  </p>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Financial Institutions</h3>
                        <p className="text-gray-600 text-sm">Partner with us to expand your reach and connect with qualified clients.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Service Providers</h3>
                        <p className="text-gray-600 text-sm">Collaborate on complementary services that benefit our mutual clients.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Zap className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Business Partners</h3>
                        <p className="text-gray-600 text-sm">Join our network and create value together for businesses and individuals.</p>
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
                  <div className="bg-white rounded-xl p-8 border-2 border-gray-100 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Why Partner With Us?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">Established network of clients seeking financing solutions</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">Transparent and ethical business practices</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">Dedicated partnership management and support</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Apply Loan Section */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-primary to-teal text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
            
            <div className="relative z-10 p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full border border-white/30 mb-6 backdrop-blur-sm">
                    <FileText className="w-5 h-5 text-white" />
                    <span className="text-sm font-semibold text-white">Get Started</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                    Ready to Apply for a Loan?
                  </h2>
                  <p className="text-lg text-white/90 mb-6 leading-relaxed">
                    Start your loan application process today. Our team will guide you through every step, from initial assessment to final approval.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/apply">
                      <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto">
                        Apply Now
                        <ArrowRight className="w-5 h-5 ml-2 inline" />
                      </Button>
                    </Link>
                    <Link href="/loans/personal">
                      <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 w-full sm:w-auto">
                        Browse Loans
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="lg:pl-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-4">What to Expect</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-white/90">Comprehensive assessment of your financial profile</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-white/90">Strategic recommendations tailored to your needs</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-white/90">Expert guidance through the application process</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-white/90">Ongoing support until loan disbursement</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
