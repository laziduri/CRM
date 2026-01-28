'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Accordion, { AccordionItem } from '@/components/ui/Accordion'
import { jobs } from '@/lib/jobs'
import { Job } from '@/types'
import {
  ArrowRight,
  Briefcase,
  TrendingUp,
  Users,
  Award,
  Heart,
  Shield,
  Lightbulb,
  MapPin,
  Clock,
  Search,
  Filter,
  X,
  Building2,
  CircleDot,
  Star,
  Sprout,
  UserPlus,
  Plus,
  Minus,
  Dumbbell,
  Coffee,
  Calendar,
  DollarSign,
  GraduationCap,
  Home,
  Smile
} from 'lucide-react'

// Values Accordion Component
function ValuesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const values = [
    {
      icon: CircleDot,
      title: 'Outperform Expectations',
      description: 'We pursue advisory excellence through the dedication, expertise, and integrity of our team. We seek to not only find financing solutions, but to deliver exceptional outcomes over the long term. Our commitment to going above and beyond ensures that every client receives personalized attention and results that exceed their expectations.',
    },
    {
      icon: Lightbulb,
      title: 'Challenge Convention',
      description: 'We value creativity and strategic insight in everything we do. We find the best opportunities through thorough assessment, careful planning, and rigorous evaluation of all options. By thinking differently and challenging traditional approaches, we uncover innovative solutions that others might miss.',
    },
    {
      icon: Star,
      title: 'Champion Opportunity',
      description: 'We seek diverse perspectives and foster a sense of belonging in our culture. Each of us has benefitted from someone taking a chance on us. We are committed to expanding opportunities for our clients, helping them access the financing solutions they need to achieve their goals and build their future.',
    },
    {
      icon: Sprout,
      title: 'Lead Responsibly',
      description: 'We work every day to earn the trust of our clients by being fair, ethical, and responsible advisors. Our business exists to serve our clients with transparency and professionalism. We take our responsibility seriously, ensuring that every recommendation is in our clients\' best interests.',
    },
    {
      icon: UserPlus,
      title: 'Drive Collaboration',
      description: 'We cultivate a collaborative relationship with each client, maintaining humility and a growth mindset. We empower our clients with knowledge and support them to make informed decisions. At all levels, we work together as partners, ensuring that our clients feel supported throughout their entire journey.',
    },
  ]

  return (
    <div>
      {values.map((value, index) => {
        const IconComponent = value.icon
        const isOpen = openIndex === index

        if (!IconComponent) {
          return null
        }

        return (
          <div
            key={index}
            className={`border-b border-gray-200 last:border-b-0 transition-all duration-300 ${
              isOpen ? 'bg-gray-50/50' : ''
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50/30 transition-colors group"
            >
              <div className="flex items-center gap-4 flex-1 text-left">
                <div className="flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-gray-900 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {value.title}
                </h3>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="w-7 h-7 rounded-full border-2 border-gray-900 flex items-center justify-center group-hover:border-primary transition-colors">
                  {isOpen ? (
                    <Minus className="w-3.5 h-3.5 text-gray-900 group-hover:text-primary transition-colors" strokeWidth={2.5} />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-gray-900 group-hover:text-primary transition-colors" strokeWidth={2.5} />
                  )}
                </div>
              </div>
            </button>
            {isOpen && (
              <div className="px-4 pb-6 pt-3 animate-fade-in">
                <div className="ml-10">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All')
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [showAllJobs, setShowAllJobs] = useState(false)

  // Get unique departments
  const departments = useMemo(() => {
    const depts = Array.from(new Set(jobs.map(job => job.department)))
    return ['All', ...depts]
  }, [])

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase())

      // Department filter
      const matchesDepartment = selectedDepartment === 'All' || job.department === selectedDepartment

      // Employment type filter
      const matchesEmploymentType = selectedEmploymentType === 'All' || job.employmentType === selectedEmploymentType

      // Status filter
      const matchesStatus = selectedStatus === 'All' || job.status === selectedStatus

      return matchesSearch && matchesDepartment && matchesEmploymentType && matchesStatus
    })
  }, [searchQuery, selectedDepartment, selectedEmploymentType, selectedStatus])

  // Reset showAllJobs when filters change
  useEffect(() => {
    setShowAllJobs(false)
  }, [searchQuery, selectedDepartment, selectedEmploymentType, selectedStatus])

  const hasActiveFilters = selectedDepartment !== 'All' || selectedEmploymentType !== 'All' || selectedStatus !== 'All' || searchQuery !== ''

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedDepartment('All')
    setSelectedEmploymentType('All')
    setSelectedStatus('All')
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      
      {/* Hero Section - Job Portal Style */}
      <section id="open-positions" className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        
        {/* Enhanced gradient overlays with animation */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-light/8 rounded-full blur-3xl opacity-40 animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-3xl opacity-40 animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-primary/5 to-teal/5 rounded-full blur-3xl opacity-30"></div>
        
        {/* Decorative geometric elements */}
        <div className="absolute top-20 right-20 w-32 h-32 border-2 border-primary/10 rounded-full hidden lg:block"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-teal/10 rounded-full hidden lg:block"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Centered Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Career Opportunities</span>
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-primary">
              Open Positions
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We&apos;re looking for talented individuals who share our commitment to excellence and client-first service.
            </p>
          </div>

          {/* Search Bar - Enhanced */}
          <Card className="mb-6 shadow-lg border-2 border-gray-200 hover:border-primary/30 transition-all duration-300">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by role title or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-4 text-lg border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-all"
              />
            </div>
          </Card>

          {/* Filters - Enhanced */}
          <Card className="mb-6 shadow-lg border-2 border-gray-200 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Department Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white hover:border-gray-300 transition-all font-medium"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  {/* Employment Type Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Employment Type</label>
                    <select
                      value={selectedEmploymentType}
                      onChange={(e) => setSelectedEmploymentType(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white hover:border-gray-300 transition-all font-medium"
                    >
                      <option value="All">All</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white hover:border-gray-300 transition-all font-medium"
                    >
                      <option value="All">All</option>
                      <option value="Open">Open</option>
                      <option value="Talent Pool">Talent Pool</option>
                    </select>
                  </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </button>
              </div>
            )}
          </Card>

          {/* Results Counter - Enhanced */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
              <Briefcase className="w-4 h-4 text-primary" />
              <p className="text-gray-700 font-medium">
                Showing <span className="font-bold text-primary">{filteredJobs.length}</span> of <span className="font-bold text-primary">{jobs.length}</span> roles
              </p>
            </div>
          </div>

          {/* Job Listings */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {(showAllJobs ? filteredJobs : filteredJobs.slice(0, 3)).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              
              {/* Show More Button */}
              {!showAllJobs && filteredJobs.length > 3 && (
                <div className="pt-6 text-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowAllJobs(true)}
                    className="px-8"
                  >
                    Show More
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No roles found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find any roles matching your search criteria. Try adjusting your filters.
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Our Values Section - Below Job Listings */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        
        {/* Soft gradient overlays */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-light/5 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              These core values guide everything we do and shape how we work together as a team.
            </p>
          </div>

          {/* Values Accordion */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200/50 overflow-hidden">
            <ValuesAccordion />
          </div>
        </div>
      </section>

      {/* Life at Brilliance Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        
        {/* Soft gradient overlays */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-light/5 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-gradient-text">Life at Brilliance</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We invest in our people because they are the foundation of our success. Here&apos;s what makes working at Brilliance Advisory special.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Growth</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We believe in continuous learning and development. You&apos;ll receive comprehensive training in financial advisory, business development, and client relationship management. Regular performance reviews and mentorship opportunities ensure you&apos;re always growing and advancing in your career.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-2 border-teal/20">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal/10 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-teal" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Supportive Culture</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our team is collaborative, respectful, and supportive. We work together to achieve common goals while respecting individual contributions. Open communication, mutual respect, and a shared commitment to excellence create an environment where everyone can thrive.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-2 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Performance & Rewards</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We recognise and reward excellence. Our performance-based compensation structure ensures that your hard work and results are properly acknowledged. Competitive base salary, attractive commission structure, and performance bonuses reward your contributions to our success.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-2 border-teal/20">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal/10 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-7 h-7 text-teal" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Well-being</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We care about your overall well-being. We promote work-life balance, provide a supportive work environment, and ensure reasonable working hours. Your health and happiness matter to us, and we create conditions that allow you to perform at your best while maintaining personal well-being.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits and Wellness Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
        
        {/* Soft gradient overlays */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-light/5 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Benefits and Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We&apos;re committed to providing comprehensive benefits and support that prioritise the wellbeing of our employees and their families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Health & Wellbeing */}
            <Card className="border-2 border-primary/20 hover:shadow-xl transition-all group">
              <div className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-teal/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Health & Wellbeing</h3>
                <p className="text-gray-700 leading-relaxed">
                  We believe great work starts with feeling good, both physically and mentally. Our benefits are designed to support your health, energy, and peace of mind, both in and outside of work.
                </p>
              </div>
            </Card>

            {/* Rewards & Growth */}
            <Card className="border-2 border-teal/20 hover:shadow-xl transition-all group">
              <div className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-teal/10 to-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-7 h-7 text-teal" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Rewards & Growth</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your effort should translate into real rewards. We offer clear earning potential and performance-based incentives that recognise results.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full"></span>
                    Transparent salary structure
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full"></span>
                    Performance-based commissions & bonuses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full"></span>
                    Opportunities to grow income as you grow your role
                  </li>
                </ul>
              </div>
            </Card>

            {/* Flexibility & Balance */}
            <Card className="border-2 border-primary/20 hover:shadow-xl transition-all group">
              <div className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-teal/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Home className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Flexibility & Balance</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We trust our people to manage their time responsibly. Flexibility isn&apos;t a perk here—it&apos;s how we work.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Flexible working arrangements
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Healthy work-life boundaries
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Support for personal commitments when it matters
                  </li>
                </ul>
              </div>
            </Card>

            {/* Career Development */}
            <Card className="border-2 border-teal/20 hover:shadow-xl transition-all group">
              <div className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-teal/10 to-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7 text-teal" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Career Development</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We don&apos;t just hire, we invest. If you&apos;re driven to improve, we provide the tools, guidance, and opportunities to help you level up.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full"></span>
                    On-the-job learning and mentorship
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full"></span>
                    Skill development through real client exposure
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full"></span>
                    Clear progression opportunities for high performers
                  </li>
                </ul>
              </div>
            </Card>

            {/* Team & Culture */}
            <Card className="border-2 border-primary/20 hover:shadow-xl transition-all group">
              <div className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-teal/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Smile className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Team & Culture</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You&apos;ll be surrounded by people who take their work seriously but not themselves. We value collaboration, respect, and showing up for one another.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Supportive and collaborative team culture
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Regular team activities and company gatherings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    A positive, low-ego working environment
                  </li>
                </ul>
              </div>
            </Card>

            {/* Everyday Perks */}
            <Card className="border-2 border-teal/20 hover:shadow-xl transition-all group">
              <div className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-teal/10 to-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Coffee className="w-7 h-7 text-teal" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Everyday Perks</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  It&apos;s the small things that make work enjoyable. We make sure effort is noticed and milestones are celebrated.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full"></span>
                    Team lunches and office refreshments
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full"></span>
                    Recognition for great work
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal rounded-full"></span>
                    Celebrations for birthdays and achievements
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

// Job Card Component
function JobCard({ job }: { job: Job }) {
  const statusColors = {
    'Open': 'bg-green-100 text-green-800 border-green-200',
    'Talent Pool': 'bg-blue-100 text-blue-800 border-blue-200',
  }

  return (
    <Link href={`/careers/${job.slug}`}>
      <Card hover className="border-2 border-gray-200 hover:border-primary/40 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">{job.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[job.status]}`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {job.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.employmentType}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed line-clamp-2">
                  {job.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button variant="primary" size="lg" className="w-full md:w-auto">
              View Details
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}
