'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Job } from '@/types'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  BookOpen,
  Target,
  Users,
  TrendingUp,
  FileText,
  Calendar,
  Building2,
  Award,
  Heart,
  Plane
} from 'lucide-react'

interface JobDetailContentProps {
  job: Job
}

export default function JobDetailContent({ job }: JobDetailContentProps) {
  // Generate job details based on department and role
  const getJobDetails = () => {
    const baseDetails = {
      about: `As a ${job.title} at Brilliance Advisory, you will be at the forefront of our ${job.department.toLowerCase()} efforts. This role offers an excellent opportunity to build a rewarding career in Singapore's financial advisory sector while making a meaningful impact on clients' financial futures.`,
      responsibilities: [
        `Support ${job.department.toLowerCase()} initiatives and contribute to team goals`,
        `Work collaboratively with colleagues across departments`,
        `Maintain high standards of professionalism and client service`,
        `Participate in training and professional development opportunities`,
        `Contribute to process improvements and operational excellence`,
      ],
      requirements: [
        'Minimum GCE \'O\' Level or equivalent qualification',
        'Strong communication and interpersonal skills',
        'Client-focused mindset with genuine interest in helping others',
        'Self-motivated and results-oriented',
        'Ability to work independently and as part of a team',
        'Professional appearance and demeanour',
        'Willingness to learn and adapt',
      ],
      learn: [
        'Financial advisory expertise and industry knowledge',
        'Client relationship management skills',
        'Strategic thinking and problem-solving',
        'Professional development and career growth',
      ],
    }

    // Customize based on department
    if (job.department === 'Business Development') {
      // Special handling for Business Development Consultant
      if (job.slug === 'business-development-consultant') {
        return {
          about: 'We are seeking a dynamic and motivated Business Development Consultant to join our team. In this role, you will have the opportunity to engage with business owners from diverse industries, understand their unique challenges, and offer transformative solutions to enhance their operations. This is a highly rewarding role with unlimited earning potential and excellent career advancement opportunities.',
          responsibilities: [
            'Engage with business owners to understand their challenges and offer tailored solutions',
            'Conduct sales activities including cold calling, door knocking, and meeting KPI targets',
            'Provide advice on grants, business financing, and mergers & acquisitions',
            'Build and maintain relationships with clients, becoming their trusted advisor',
            'Participate in training programs and ongoing mentoring',
          ],
          requirements: [
            'Minimum GCE \'O\' Level or equivalent qualification',
            'Strong communication and interpersonal skills',
            'Client-focused mindset with genuine interest in helping others',
            'Self-motivated and results-oriented',
            'Ability to work independently and as part of a team',
            'Professional appearance and demeanour',
            'Willingness to learn and adapt',
            'Experience in sales or business development is preferred but not required',
          ],
          learn: [
            'Business development and sales techniques',
            'Grants, business financing, and M&A advisory',
            'Client relationship management and trust building',
            'Professional development and career growth',
          ],
          benefits: [
            {
              title: 'Uncapped Earnings',
              description: 'Fully commission-based role with high commissions and unlimited earning potential. Your success directly translates to significant financial rewards without any ceiling on your earnings.',
              icon: DollarSign,
            },
            {
              title: 'Flexible Schedule',
              description: 'Enjoy the flexibility to manage your own schedule. Plan your workday to suit your personal and professional needs, allowing for a better work-life balance.',
              icon: Calendar,
            },
            {
              title: 'Career Growth',
              description: 'Opportunities for career advancement within Brilliance Advisory.',
              icon: TrendingUp,
            },
            {
              title: 'Overseas Trips',
              description: 'Opportunities for overseas trips as part of our incentive programs.',
              icon: MapPin,
            },
            {
              title: 'Networking Opportunities',
              description: 'Attend industry events and conferences to expand your professional network.',
              icon: Users,
            },
            {
              title: 'Fun Working Environment',
              description: 'Join a team that celebrates successes, supports each other through challenges, and participates in team-building activities and social events.',
              icon: Heart,
            },
            {
              title: 'Comprehensive Training and Mentoring',
              description: 'Receive extensive training and continuous guidance. From the moment you join, you will be supported with regular training sessions, and one-on-one mentoring to help you develop and hone your skills.',
              icon: BookOpen,
            },
          ],
        }
      }
      
      // Other Business Development roles
      return {
        ...baseDetails,
        about: `As a ${job.title} at Brilliance Advisory, you will drive business growth and build lasting client relationships in Singapore's financial advisory sector. You'll work directly with individuals and businesses seeking financing solutions, conducting proper assessments, providing strategic advice, and guiding them through the loan application process.`,
        responsibilities: [
          'Proactively identify and engage potential clients through various channels',
          'Build and maintain strong, trust-based relationships with clients',
          'Conduct comprehensive financial assessments to understand client needs',
          'Provide strategic advice on suitable financing options',
          'Guide clients through the loan application process',
          'Liaise with financial institutions on behalf of clients',
          'Contribute to business growth through effective client engagement',
        ],
        learn: [
          'Financial advisory expertise and loan products',
          'Client relationship management and business development',
          'Strategic assessment and case structuring',
          'Bank liaison and negotiation skills',
        ],
      }
    }

    if (job.department === 'Client Solutions') {
      return {
        ...baseDetails,
        about: `As a ${job.title} at Brilliance Advisory, you will design and implement tailored financing solutions for clients. You'll work closely with advisors to assess client needs and develop strategic plans that align with their financial goals.`,
        responsibilities: [
          'Assess client financial situations and requirements',
          'Design tailored financing solutions',
          'Work with advisors to develop strategic plans',
          'Support clients throughout their financing journey',
          'Ensure optimal case structuring and presentation',
          'Maintain detailed client records and documentation',
        ],
        learn: [
          'Financial product knowledge and solutions design',
          'Client assessment and strategic planning',
          'Case structuring and optimization',
          'Client relationship management',
        ],
      }
    }

    if (job.department === 'Operations') {
      return {
        ...baseDetails,
        about: `As a ${job.title} at Brilliance Advisory, you will ensure smooth operations across all departments. You'll optimize processes, support team efficiency, and maintain quality standards.`,
        responsibilities: [
          'Oversee day-to-day operational activities',
          'Coordinate workflows across departments',
          'Optimize processes for efficiency',
          'Ensure quality standards are maintained',
          'Support team members with operational needs',
          'Handle administrative and coordination tasks',
        ],
        learn: [
          'Operations management and process optimization',
          'Quality assurance and standards',
          'Cross-functional collaboration',
          'Administrative excellence',
        ],
      }
    }

    if (job.department === 'Marketing') {
      return {
        ...baseDetails,
        about: `As a ${job.title} at Brilliance Advisory, you will develop and execute marketing strategies to build brand awareness and generate leads. You'll manage digital marketing campaigns and create engaging content.`,
        responsibilities: [
          'Develop and execute marketing strategies',
          'Manage digital marketing channels',
          'Create engaging content for various platforms',
          'Analyze campaign performance and optimize',
          'Build brand awareness and generate leads',
          'Support content creation and brand messaging',
        ],
        learn: [
          'Digital marketing and content strategy',
          'Brand building and awareness',
          'Campaign management and analytics',
          'Content creation and storytelling',
        ],
      }
    }

    if (job.department === 'People & Admin') {
      return {
        ...baseDetails,
        about: `As a ${job.title} at Brilliance Advisory, you will support human resources functions and administrative operations. You'll help build a strong team culture and ensure smooth administrative processes.`,
        responsibilities: [
          'Support recruitment and employee relations',
          'Handle administrative operations',
          'Support team development initiatives',
          'Manage office operations and coordination',
          'Ensure compliance with policies and procedures',
          'Support organizational growth and culture',
        ],
        learn: [
          'Human resources and people management',
          'Administrative operations',
          'Organizational development',
          'Team culture and engagement',
        ],
      }
    }

    if (job.department === 'Internships') {
      return {
        ...baseDetails,
        about: `As a ${job.title} at Brilliance Advisory, you will gain hands-on experience in the financial advisory industry. This internship offers valuable exposure to real-world business operations and client service.`,
        responsibilities: [
          'Support team members with daily tasks',
          'Assist with research and analysis',
          'Participate in client meetings and observations',
          'Contribute to projects and initiatives',
          'Learn industry best practices',
          'Support administrative and operational tasks',
        ],
        learn: [
          'Financial advisory industry knowledge',
          'Professional work environment experience',
          'Client service and relationship building',
          'Business operations and processes',
        ],
      }
    }

    return baseDetails
  }

  const jobDetails = getJobDetails()

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      
      {/* Header with Back Button */}
      <section className="relative pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/careers"
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </Link>
        </div>
      </section>

      {/* Job Header */}
      <section className="relative pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
              job.status === 'Open' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {job.status === 'Open' ? 'Currently Hiring' : 'Talent Pool'}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{job.employmentType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <span>{job.department}</span>
              </div>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-teal/5 border-primary/20 mb-8">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="flex-1">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    {job.department}
                  </span>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    {job.employmentType}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link href={`/careers/apply?position=${job.slug}`}>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Apply Now
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* About the Role */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Role</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>{jobDetails.about}</p>
                  {job.status === 'Talent Pool' && (
                    <p className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-900">
                      <strong>Note:</strong> This position is currently in our Talent Pool. While we may not have an immediate opening, we welcome applications from qualified candidates. We&apos;ll keep your application on file and reach out when a suitable opportunity arises.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Responsibilities */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Responsibilities</h2>
                <div className="space-y-4">
                  {jobDetails.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-gray-700 leading-relaxed">{responsibility}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Requirements */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                <ul className="space-y-3">
                  {jobDetails.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What You&apos;ll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobDetails.learn.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <p className="text-gray-700 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Employment Details */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Employment Details</h2>
                <div className="space-y-6">
                  {job.slug === 'business-development-consultant' ? (
                    <>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-primary" />
                          Working Schedule
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          Enjoy the flexibility to manage your own schedule. Plan your workday to suit your personal and professional needs, allowing for a better work-life balance.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-primary" />
                          Compensation
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          Fully commission-based role with high commissions and unlimited earning potential. Your success directly translates to significant financial rewards without any ceiling on your earnings.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Working Hours
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Standard business hours with flexibility. We promote work-life balance and reasonable working hours to ensure your well-being and sustained performance.
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Location
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Based in Singapore. Office-based with opportunities for client meetings and field work as required.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Training & Development
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Comprehensive initial training program covering relevant skills and industry knowledge. Ongoing mentorship, regular performance reviews, and continuous learning opportunities to support your professional growth.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Team & Culture
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Join a supportive, collaborative team committed to excellence and client-first service. We value open communication, mutual respect, and shared commitment to success.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Benefits Section - Only for Business Development Consultant */}
      {job.slug === 'business-development-consultant' && 'benefits' in jobDetails && jobDetails.benefits && (
        <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <Card>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobDetails.benefits.map((benefit, index) => {
                      const Icon = benefit.icon
                      return (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                            <p className="text-gray-700 leading-relaxed text-sm">{benefit.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Benefits Section - Only for Business Development Consultant */}
      {job.slug === 'business-development-consultant' && 'benefits' in jobDetails && jobDetails.benefits && (
        <section className="relative py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobDetails.benefits.map((benefit, index) => {
                      const Icon = benefit.icon
                      return (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                            <p className="text-gray-700 leading-relaxed text-sm">{benefit.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Apply Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/5 to-teal/5 border-primary/20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Apply?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              {job.status === 'Talent Pool' 
                ? 'We welcome your application for our Talent Pool. We\'ll keep your details on file and reach out when a suitable opportunity arises.'
                : 'If you\'re motivated, client-focused, and ready to grow your career in financial advisory, we\'d love to hear from you. Take the next step and apply today.'
              }
            </p>
            <Link href={`/careers/apply?position=${job.slug}`}>
              <Button variant="primary" size="lg">
                Apply for This Position
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </Link>
            <p className="text-sm text-gray-600 mt-6">
              Or <Link href="/contact" className="text-primary hover:underline font-medium">contact us</Link> if you have any questions about this role.
            </p>
          </Card>
        </div>
      </section>
    </div>
  )
}
