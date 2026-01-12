import { Loan, Testimonial, Partner, BlogPost } from '@/types'

export const mockLoans: Loan[] = [
  {
    id: '1',
    lender: 'DBS Bank',
    loanType: 'personal',
    interestRate: 3.88,
    minAmount: 1000,
    maxAmount: 200000,
    minTenure: 12,
    maxTenure: 60,
    features: ['No processing fee', 'Fast approval', 'Flexible repayment'],
    eligibility: ['Singapore citizen/PR', 'Age 21-65', 'Minimum income $20,000'],
    fees: {
      processingFee: 0,
      lateFee: 50,
    },
    description: 'Competitive rates with flexible repayment options',
  },
  {
    id: '2',
    lender: 'OCBC Bank',
    loanType: 'personal',
    interestRate: 4.20,
    minAmount: 5000,
    maxAmount: 150000,
    minTenure: 12,
    maxTenure: 60,
    features: ['Low interest rate', 'Quick approval', 'Online application'],
    eligibility: ['Singapore citizen/PR', 'Age 21-70', 'Minimum income $30,000'],
    fees: {
      processingFee: 0,
      lateFee: 50,
    },
    description: 'Low interest rates for qualified applicants',
  },
  {
    id: '3',
    lender: 'UOB Bank',
    loanType: 'personal',
    interestRate: 4.50,
    minAmount: 1000,
    maxAmount: 250000,
    minTenure: 12,
    maxTenure: 84,
    features: ['High loan amount', 'Long tenure', 'Competitive rates'],
    eligibility: ['Singapore citizen/PR', 'Age 21-65', 'Minimum income $24,000'],
    fees: {
      processingFee: 0,
      lateFee: 75,
    },
    description: 'Higher loan amounts with extended repayment period',
  },
  {
    id: '4',
    lender: 'HSBC Bank',
    loanType: 'business',
    interestRate: 5.20,
    minAmount: 50000,
    maxAmount: 500000,
    minTenure: 12,
    maxTenure: 60,
    features: ['Business loans', 'Large amounts', 'Flexible terms'],
    eligibility: ['Registered business', 'Minimum 2 years operation', 'Annual revenue $100,000+'],
    fees: {
      processingFee: 500,
      lateFee: 100,
    },
    description: 'Tailored solutions for business needs',
  },
  {
    id: '5',
    lender: 'Standard Chartered',
    loanType: 'personal',
    interestRate: 3.99,
    minAmount: 5000,
    maxAmount: 200000,
    minTenure: 12,
    maxTenure: 60,
    features: ['Low rates', 'No early repayment fee', 'Online application'],
    eligibility: ['Singapore citizen/PR', 'Age 21-65', 'Minimum income $20,000'],
    fees: {
      processingFee: 0,
      earlyRepaymentFee: 0,
    },
    description: 'Flexible personal loans with no early repayment penalty',
  },
]

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Lim',
    rating: 5,
    comment: 'Found the perfect loan in minutes! The comparison tool made it so easy to see all options side by side.',
    loanType: 'Personal Loan',
  },
  {
    id: '2',
    name: 'Michael Tan',
    rating: 5,
    comment: 'Great experience. The calculator helped me understand exactly what I would be paying each month.',
    loanType: 'Business Loan',
  },
  {
    id: '3',
    name: 'Jennifer Wong',
    rating: 5,
    comment: 'Saved me so much time! Instead of visiting multiple banks, I compared everything online and applied directly.',
    loanType: 'Personal Loan',
  },
  {
    id: '4',
    name: 'David Chen',
    rating: 5,
    comment: 'Transparent and easy to use. No hidden fees, and the application process was straightforward.',
    loanType: 'Home Loan',
  },
]

export const mockPartners: Partner[] = [
  { id: '1', name: 'Partner 1', logo: '/images/website/1.png' },
  { id: '2', name: 'Partner 2', logo: '/images/website/2.png' },
  { id: '3', name: 'Partner 3', logo: '/images/website/3.png' },
  { id: '4', name: 'Partner 4', logo: '/images/website/4.png' },
  { id: '5', name: 'Partner 5', logo: '/images/website/5.png' },
  { id: '6', name: 'Partner 6', logo: '/images/website/6.png' },
  { id: '7', name: 'Partner 7', logo: '/images/website/7.png' },
  { id: '8', name: 'Partner 8', logo: '/images/website/8.png' },
]

// Import resourcesArticles lazily to avoid breaking module evaluation
// This will be imported directly in blog pages that need it
export const mockBlogPosts: BlogPost[] = []
