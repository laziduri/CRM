'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  CheckCircle2, 
  Shield, 
  Target, 
  Users, 
  FileText,
  Building2,
  ArrowRight,
  Award,
  Lock,
  Heart,
  Lightbulb,
  UserCheck,
  BarChart3,
  Eye,
  UserPlus
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-gradient-text">
            About Brilliance Advisory
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Singapore's trusted financial consultancy specialising in human-led personal and business loan advisory. We provide personalised guidance, not automated matching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Speak to an Advisor
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </Link>
            <Link href="/apply">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Get a Free Assessment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-primary/5 to-teal/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h2>
                  <p className="text-gray-700 leading-relaxed">
                    To be Singapore's most trusted financial advisory firm, recognised for our human-led approach that delivers personalised financing solutions and genuine client success.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-teal/5 to-primary/5 border-teal/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
                  <p className="text-gray-700 leading-relaxed">
                    To provide expert, personalised loan advisory services that help individuals and businesses secure the right financing through proper assessment, strategic planning, and dedicated support—putting our clients' best interests first.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Purpose & Values Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Purpose & Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our clients rely on our expertise to help secure their financial future. We must never lose our focus and determination to be the best advisors and most trusted partners on their behalf.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card hover className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence in Service</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We pursue advisory excellence through the dedication, expertise, and integrity of our team. We seek to not only find financing solutions, but to deliver exceptional outcomes over the long term.
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Strategic Thinking</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We value creativity and strategic insight in everything we do. We find the best opportunities through thorough assessment, careful planning, and rigorous evaluation of all options.
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Client-First Focus</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our clients' success is our success. We prioritise their best interests above all else, providing honest advice, transparent communication, and dedicated support throughout their journey.
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Integrity & Trust</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We work every day to earn the trust of our clients by being fair, ethical, and responsible advisors. Our business exists to serve our clients with transparency and professionalism.
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Partnership Approach</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We cultivate a collaborative relationship with each client, maintaining humility and a growth mindset. We empower our clients with knowledge and support them to make informed decisions.
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Confidentiality</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Client information is handled with absolute confidentiality and professional care. We maintain strict data protection standards and respect the privacy of every engagement.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Brilliance Advisory Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Brilliance Advisory?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We don't just recommend all banks and apply to every loan. We do proper assessments, provide real advice, and create strategic plans tailored to your unique situation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Proper Assessment, Not Mass Applications</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Unlike online platforms that submit your application to multiple banks simultaneously, we conduct a thorough assessment of your financial profile, goals, and circumstances. We then strategically select the most suitable lenders—not all lenders—based on what's truly best for you.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-2 border-teal/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Real Advice & Strategic Planning</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Online applications can't give you real advice. They can't assess your complete financial picture or help you plan strategically. Our advisors provide genuine guidance, helping you understand your options, structure your application optimally, and plan for long-term financial success.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-2 border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Client-First Philosophy</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Every decision we make prioritises your best interests. We're not incentivised to push you toward any particular bank or loan product. Instead, we focus on finding the solution that genuinely fits your needs, even if it means recommending fewer options that are better suited to you.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-2 border-teal/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Human-Led Expertise</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our experienced advisors work directly with you, understanding your unique situation through personalised consultations. We handle bank communications, negotiate terms, and guide you through every step—providing the human touch that automated systems simply cannot replicate.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Human Touch - Comparison Chart Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why the Human Touch Matters</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See the difference between automated online applications and human-led advisory services.
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary to-teal text-white">
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold">Online Applications</th>
                    <th className="px-6 py-4 text-center font-semibold bg-teal/20">Brilliance Advisory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Assessment Approach</td>
                    <td className="px-6 py-4 text-center text-gray-600">Basic form submission</td>
                    <td className="px-6 py-4 text-center text-primary font-semibold">Comprehensive financial assessment</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">Bank Selection</td>
                    <td className="px-6 py-4 text-center text-gray-600">Applies to all/multiple banks</td>
                    <td className="px-6 py-4 text-center text-primary font-semibold">Strategic selection of suitable lenders</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Advice & Guidance</td>
                    <td className="px-6 py-4 text-center text-gray-600">No personalised advice</td>
                    <td className="px-6 py-4 text-center text-primary font-semibold">Expert advice & strategic planning</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">Application Structuring</td>
                    <td className="px-6 py-4 text-center text-gray-600">Generic application format</td>
                    <td className="px-6 py-4 text-center text-primary font-semibold">Tailored case structuring</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Bank Negotiation</td>
                    <td className="px-6 py-4 text-center text-gray-600">No negotiation support</td>
                    <td className="px-6 py-4 text-center text-primary font-semibold">Dedicated bank liaison & negotiation</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">Ongoing Support</td>
                    <td className="px-6 py-4 text-center text-gray-600">Limited or no support</td>
                    <td className="px-6 py-4 text-center text-primary font-semibold">Continuous guidance until disbursement</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Client Focus</td>
                    <td className="px-6 py-4 text-center text-gray-600">Volume-based model</td>
                    <td className="px-6 py-4 text-center text-primary font-semibold">Client-first, quality-focused</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">Understanding Your Needs</td>
                    <td className="px-6 py-4 text-center text-gray-600">Algorithm-based matching</td>
                    <td className="px-6 py-4 text-center text-primary font-semibold">Human understanding & relationship</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-6">
              The human touch makes all the difference when it comes to securing the right financing solution.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Experience the Difference
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Approach</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We differentiate ourselves through comprehensive assessment, strategic structuring, and dedicated bank liaison—from initial consultation to disbursement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We conduct a comprehensive evaluation of your financial position, requirements, and objectives.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Structuring</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Each case is carefully structured to present your profile optimally to financial institutions.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank Selection</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We identify and approach the most suitable lenders based on your specific circumstances—not all banks.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Negotiation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our team negotiates terms and liaises with banks on your behalf until finalisation.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-sm">5</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Closing</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We facilitate the disbursement process, ensuring smooth completion of your financing.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary to-teal text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience the Human Touch?</h2>
            <p className="text-lg mb-8 opacity-90">
              Schedule a consultation with one of our advisors for a proper assessment and personalised guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Schedule Consultation
                </Button>
              </Link>
              <Link href="/apply">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Start Assessment
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Compliance Disclaimer */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600 leading-relaxed">
              <p className="font-medium text-gray-700 mb-1">Important Notice</p>
              <p>
                Information provided is general in nature and does not constitute financial advice. Final loan approvals, interest rates, and terms are subject to individual bank assessment and credit evaluation. Brilliance Advisory Pte. Ltd. acts as a consultancy and does not guarantee loan approvals or specific terms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
