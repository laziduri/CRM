import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
  paymentSchedule: Array<{
    month: number
    principal: number
    interest: number
    balance: number
  }>
} {
  if (annualRate === 0) {
    const monthlyPayment = principal / months
    const paymentSchedule = []
    let balance = principal
    for (let month = 1; month <= months; month++) {
      const principalPayment = monthlyPayment
      balance -= principalPayment
      paymentSchedule.push({
        month,
        principal: principalPayment,
        interest: 0,
        balance: Math.max(0, balance),
      })
    }
    return {
      monthlyPayment,
      totalInterest: 0,
      totalAmount: principal,
      paymentSchedule,
    }
  }
  
  const monthlyRate = annualRate / 100 / 12
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  
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
  
  const totalAmount = monthlyPayment * months
  const totalInterest = totalAmount - principal
  
  return {
    monthlyPayment,
    totalInterest,
    totalAmount,
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

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}

export function shouldAutoArchiveTask(
  task: {
    status?: string
    completedAt?: Date
    deadline?: Date
    created?: Date
  },
  daysOld: number = 90
): boolean {
  if (task.status === 'completed' && task.completedAt) {
    const daysSinceCompleted = Math.floor(
      (Date.now() - task.completedAt.getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysSinceCompleted >= daysOld
  }
  
  if (task.created) {
    const daysSinceCreated = Math.floor(
      (Date.now() - task.created.getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysSinceCreated >= daysOld
  }
  
  return false
}

export function findSimilarTasks(
  newTask: {
    title?: string
    clientId?: string
    clientName?: string
    taskType?: string
  },
  existingTasks: Array<{
    id: string
    title?: string
    clientId?: string
    clientName?: string
    taskType?: string
    status?: string
    created?: Date
  }>
): Array<{
  id: string
  title?: string
  clientId?: string
  clientName?: string
  taskType?: string
  status?: string
  created?: Date
}> {
  if (!newTask.title) return []
  
  const titleLower = newTask.title.toLowerCase().trim()
  
  return existingTasks.filter(task => {
    if (!task.title) return false
    
    const taskTitleLower = task.title.toLowerCase().trim()
    
    // Exact match
    if (taskTitleLower === titleLower) return true
    
    // Same client and similar title (contains same words)
    if (newTask.clientId && task.clientId === newTask.clientId) {
      const newWords = titleLower.split(/\s+/)
      const taskWords = taskTitleLower.split(/\s+/)
      const commonWords = newWords.filter(word => 
        word.length > 3 && taskWords.includes(word)
      )
      if (commonWords.length >= 2) return true
    }
    
    // Same task type and very similar title
    if (newTask.taskType && task.taskType === newTask.taskType) {
      const similarity = calculateSimilarity(titleLower, taskTitleLower)
      if (similarity > 0.7) return true
    }
    
    return false
  })
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}
