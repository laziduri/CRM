export interface Loan {
  id: string
  lender: string
  loanType: 'personal' | 'business' | 'home' | 'car'
  interestRate: number
  minAmount: number
  maxAmount: number
  minTenure: number
  maxTenure: number
  features: string[]
  eligibility: string[]
  fees?: {
    processingFee?: number
    lateFee?: number
    earlyRepaymentFee?: number
  }
  logo?: string
  description?: string
}

export interface Testimonial {
  id: string
  name: string
  rating: number
  comment: string
  loanType: string
  avatar?: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  image?: string
  pillar?: 'Personal Loan Intelligence' | 'Business Loan Strategy' | 'Bank & Credit Behaviour' | 'SME Finance & Growth'
  keyTakeaways?: string[]
  internalLinks?: string[]
}

export interface Partner {
  id: string
  name: string
  logo: string
  url?: string
}

export interface Job {
  id: string
  title: string
  slug: string
  department: 'Business Development' | 'Client Solutions' | 'Operations' | 'Marketing' | 'People & Admin' | 'Internships'
  employmentType: 'Full-Time' | 'Internship'
  location: string
  status: 'Open' | 'Talent Pool'
  description: string
  postedDate?: string
}
