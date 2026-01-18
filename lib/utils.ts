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

// Calculate similarity between two strings (0-1)
function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()
  
  if (s1 === s2) return 1.0
  if (s1.length === 0 || s2.length === 0) return 0.0
  
  // Simple word-based similarity
  const words1 = s1.split(/\s+/)
  const words2 = s2.split(/\s+/)
  
  const allWords = new Set([...words1, ...words2])
  let matches = 0
  
  const allWordsArray = Array.from(allWords)
  for (const word of allWordsArray) {
    if (words1.includes(word) && words2.includes(word)) {
      matches++
    }
  }
  
  return matches / allWords.size
}

// Check if a task is similar to existing tasks
export function findSimilarTasks(
  newTask: { title: string; clientId?: string; clientName?: string; taskType?: string },
  existingTasks: Array<{ id: string; title: string; clientId?: string; clientName?: string; taskType?: string; status: string; created?: Date }>,
  similarityThreshold: number = 0.7
): Array<{ id: string; title: string; similarity: number; reason: string }> {
  const similar: Array<{ id: string; title: string; similarity: number; reason: string }> = []
  
  for (const existingTask of existingTasks) {
    // Skip archived or completed tasks older than 7 days
    if (existingTask.status === 'completed' || existingTask.status === 'cancelled') {
      if (existingTask.created) {
        const daysSinceCreation = (Date.now() - new Date(existingTask.created).getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceCreation > 7) continue
      }
    }
    
    let similarity = calculateStringSimilarity(newTask.title, existingTask.title)
    let reason = 'Similar title'
    
    // Increase similarity if same client
    if (newTask.clientId && existingTask.clientId && newTask.clientId === existingTask.clientId) {
      similarity = Math.min(1.0, similarity + 0.2)
      reason = 'Similar title and same client'
    }
    
    // Increase similarity if same task type
    if (newTask.taskType && existingTask.taskType && newTask.taskType === existingTask.taskType) {
      similarity = Math.min(1.0, similarity + 0.1)
      reason = reason.includes('client') ? reason + ' and same type' : 'Similar title and same type'
    }
    
    if (similarity >= similarityThreshold) {
      similar.push({
        id: existingTask.id,
        title: existingTask.title,
        similarity,
        reason,
      })
    }
  }
  
  // Sort by similarity (highest first)
  return similar.sort((a, b) => b.similarity - a.similarity)
}

// Check if a task should be auto-archived
export function shouldAutoArchiveTask(
  task: { status: string; completedAt?: Date; deadline?: Date; created?: Date },
  archiveAfterDays: number = 90
): boolean {
  const now = Date.now()
  
  // Archive completed or cancelled tasks older than archiveAfterDays
  if (task.status === 'completed' || task.status === 'cancelled') {
    const referenceDate = task.completedAt ? new Date(task.completedAt).getTime() : 
                         task.created ? new Date(task.created).getTime() : 0
    
    if (referenceDate > 0) {
      const daysSince = (now - referenceDate) / (1000 * 60 * 60 * 24)
      return daysSince >= archiveAfterDays
    }
  }
  
  // Archive old pending tasks without deadlines that haven't been updated
  if (task.status === 'pending' && !task.deadline && task.created) {
    const daysSinceCreation = (now - new Date(task.created).getTime()) / (1000 * 60 * 60 * 24)
    return daysSinceCreation >= archiveAfterDays
  }
  
  return false
}
