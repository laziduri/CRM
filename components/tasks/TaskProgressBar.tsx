'use client'

interface TaskProgressBarProps {
  completed: number
  total: number
}

export default function TaskProgressBar({ completed, total }: TaskProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  const getColor = () => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getMessage = () => {
    if (percentage >= 80) return "Great progress! You're on fire!"
    if (percentage >= 50) return "Keep going! You're halfway there."
    if (percentage > 0) return "Getting started! Every task counts."
    return "Ready to tackle your tasks?"
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-gray-700">Daily Progress</p>
          <p className="text-xs text-gray-500 mt-0.5">{getMessage()}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{completed}/{total}</p>
          <p className="text-xs text-gray-500">{percentage}%</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
