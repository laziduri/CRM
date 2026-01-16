import { Job } from '@/types'

export const jobs: Job[] = [
  // Business Development - Only one Open
  {
    id: '1',
    title: 'Business Development Consultant',
    slug: 'business-development-consultant',
    department: 'Business Development',
    employmentType: 'Full-Time',
    location: 'Singapore',
    status: 'Open',
    description: 'We are seeking a dynamic and motivated Business Development Consultant to join our team. In this role, you will have the opportunity to engage with business owners from diverse industries, understand their unique challenges, and offer transformative solutions to enhance their operations. This is a highly rewarding role with unlimited earning potential and excellent career advancement opportunities.',
    postedDate: '2024-01-15',
  },

  // Marketing
  {
    id: '10',
    title: 'Marketing Manager',
    slug: 'marketing-manager',
    department: 'Marketing',
    employmentType: 'Full-Time',
    location: 'Singapore',
    status: 'Talent Pool',
    description: 'Develop and execute marketing strategies to build brand awareness and generate leads. Manage digital marketing campaigns and content creation.',
    postedDate: '2024-01-13',
  },
  {
    id: '11',
    title: 'Digital Marketing Specialist',
    slug: 'digital-marketing-specialist',
    department: 'Marketing',
    employmentType: 'Full-Time',
    location: 'Singapore',
    status: 'Talent Pool',
    description: 'Manage digital marketing channels including social media, SEO, and paid advertising. Create engaging content and analyze campaign performance.',
    postedDate: '2024-01-09',
  },
  {
    id: '12',
    title: 'Content Marketing Associate',
    slug: 'content-marketing-associate',
    department: 'Marketing',
    employmentType: 'Full-Time',
    location: 'Singapore',
    status: 'Talent Pool',
    description: 'Create compelling content for blogs, social media, and marketing materials. Support content strategy and brand messaging initiatives.',
    postedDate: '2024-01-06',
  },

  // People & Admin
  {
    id: '13',
    title: 'Admin',
    slug: 'admin',
    department: 'People & Admin',
    employmentType: 'Full-Time',
    location: 'Singapore',
    status: 'Talent Pool',
    description: 'Manage human resources functions including recruitment, employee relations, and administrative operations. Support team development and organizational growth.',
    postedDate: '2024-01-14',
  },
  {
    id: '14',
    title: 'Administrative Assistant',
    slug: 'administrative-assistant',
    department: 'People & Admin',
    employmentType: 'Full-Time',
    location: 'Singapore',
    status: 'Talent Pool',
    description: 'Provide administrative support to various departments. Handle office management, scheduling, and coordination tasks.',
    postedDate: '2024-01-02',
  },

  // Internships
  {
    id: '15',
    title: 'Business Development Intern',
    slug: 'business-development-intern',
    department: 'Internships',
    employmentType: 'Internship',
    location: 'Singapore',
    status: 'Talent Pool',
    description: 'Gain hands-on experience in business development and client relations. Support the team with research, client outreach, and administrative tasks.',
    postedDate: '2024-01-01',
  },
  {
    id: '16',
    title: 'Marketing Intern',
    slug: 'marketing-intern',
    department: 'Internships',
    employmentType: 'Internship',
    location: 'Singapore',
    status: 'Talent Pool',
    description: 'Learn digital marketing and content creation in a real-world setting. Assist with social media management, content development, and campaign execution.',
    postedDate: '2024-01-01',
  },
]

export function getJobBySlug(slug: string): Job | undefined {
  return jobs.find(job => job.slug === slug)
}

export function getAllJobs(): Job[] {
  return jobs
}
