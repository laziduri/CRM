import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  months: number
): {
  monthlyPayment: number
  totalInterest: number
  totalAmount: number
  paymentSchedule: Array<{ month: number; principal: number; interest: number; balance: number }>
} {
  const monthlyRate = annualRate / 100 / 12
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  const totalAmount = monthlyPayment * months
  const totalInterest = totalAmount - principal

  const paymentSchedule = []
  let balance = principal

  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate
    const principalPayment = monthlyPayment - interest
    balance -= principalPayment

    paymentSchedule.push({
      month,
      principal: principalPayment,
      interest,
      balance: Math.max(0, balance),
    })
  }

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    paymentSchedule,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(rate: number): string {
  return `${rate.toFixed(2)}%`
}
