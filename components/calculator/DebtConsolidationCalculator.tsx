'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, TrendingDown, DollarSign, ArrowRight, Info } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Slider from '@/components/ui/Slider'
import { calculateLoanPayment, formatCurrency } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

interface Debt {
  id: string
  name: string
  balance: number
  interestRate: number
  monthlyPayment: number
}

export default function DebtConsolidationCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card', balance: 10000, interestRate: 24, monthlyPayment: 500 },
    { id: '2', name: 'Personal Loan', balance: 20000, interestRate: 8, monthlyPayment: 800 },
  ])
  
  const [consolidatedAmount, setConsolidatedAmount] = useState(30000)
  const [consolidatedRate, setConsolidatedRate] = useState(6.5)
  const [consolidatedTenure, setConsolidatedTenure] = useState(60)

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: '',
      balance: 0,
      interestRate: 0,
      monthlyPayment: 0,
    }
    setDebts([...debts, newDebt])
  }

  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id))
  }

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ))
  }

  // Calculate current total monthly payment
  const currentTotalMonthly = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)
  
  // Calculate current total balance
  const currentTotalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0)
  
  // Calculate estimated time to pay off current debts (simplified - assumes minimum payments)
  const calculateCurrentPayoffTime = () => {
    if (currentTotalBalance === 0 || debts.length === 0) return 0
    
    // Simplified calculation: estimate based on average interest and payments
    const avgRate = debts.reduce((sum, d) => sum + (d.interestRate * d.balance), 0) / currentTotalBalance
    
    if (avgRate === 0 || currentTotalMonthly === 0) return 0
    
    // Rough estimate: balance / (monthly payment - monthly interest)
    const monthlyInterest = (currentTotalBalance * avgRate / 100) / 12
    const principalPayment = currentTotalMonthly - monthlyInterest
    
    if (principalPayment <= 0) return 999 // Will never pay off
    
    return Math.ceil(currentTotalBalance / principalPayment)
  }
  
  const currentPayoffMonths = calculateCurrentPayoffTime()
  
  // Calculate current total interest (simplified estimate)
  const estimateCurrentTotalInterest = () => {
    if (currentPayoffMonths === 0 || currentPayoffMonths === 999) return 0
    return (currentTotalMonthly * currentPayoffMonths) - currentTotalBalance
  }
  
  const currentTotalInterest = estimateCurrentTotalInterest()
  
  // Calculate consolidated loan
  const consolidatedLoan = calculateLoanPayment(consolidatedAmount, consolidatedRate, consolidatedTenure)
  
  // Calculate savings
  const monthlySavings = currentTotalMonthly - consolidatedLoan.monthlyPayment
  const totalSavings = (currentTotalMonthly * currentPayoffMonths) - consolidatedLoan.totalAmount
  const interestSavings = currentTotalInterest - consolidatedLoan.totalInterest
  
  // Auto-update consolidated amount when debts change
  useEffect(() => {
    const total = debts.reduce((sum, debt) => sum + debt.balance, 0)
    if (total > 0) {
      setConsolidatedAmount(total)
    }
  }, [debts])

  return (
    <div className="space-y-6">
      {/* Current Debts Section */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Your Current Debts</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addDebt}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Debt
          </Button>
        </div>

        <div className="space-y-4">
          {debts.map((debt, index) => (
            <div key={debt.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Input
                    label={`Debt ${index + 1} Name`}
                    type="text"
                    placeholder="e.g., Credit Card, Personal Loan"
                    value={debt.name}
                    onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                    className="mb-3"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeDebt(debt.id)}
                  className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outstanding Balance
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={debt.balance || ''}
                    onChange={(e) => updateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (% p.a.)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    step="0.1"
                    value={debt.interestRate || ''}
                    onChange={(e) => updateDebt(debt.id, 'interestRate', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Payment
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={debt.monthlyPayment || ''}
                    onChange={(e) => updateDebt(debt.id, 'monthlyPayment', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {debts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Click &quot;Add Debt&quot; to get started</p>
          </div>
        )}
      </Card>

      {/* Current Situation Summary */}
      {debts.length > 0 && currentTotalBalance > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-teal/5 border-primary/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Current Debt Situation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentTotalBalance)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Monthly Payment</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentTotalMonthly)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Estimated Payoff Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentPayoffMonths === 999 ? 'Never' : `${currentPayoffMonths} months`}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Consolidated Loan Options */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <TrendingDown className="w-6 h-6 text-teal" />
          <h2 className="text-2xl font-bold text-gray-900">Consolidated Loan Options</h2>
        </div>

        <div className="space-y-6">
          <Slider
            label="Consolidated Loan Amount"
            value={consolidatedAmount}
            min={1000}
            max={500000}
            step={1000}
            formatValue={(v) => formatCurrency(v)}
            onChange={(e) => setConsolidatedAmount(parseInt(e.target.value))}
          />

          <Slider
            label="Consolidated Interest Rate (EIR % p.a.)"
            value={consolidatedRate}
            min={2}
            max={15}
            step={0.1}
            formatValue={(v) => `${v.toFixed(1)}%`}
            onChange={(e) => setConsolidatedRate(parseFloat(e.target.value))}
          />

          <Slider
            label="Repayment Tenure (Months)"
            value={consolidatedTenure}
            min={12}
            max={84}
            step={6}
            formatValue={(v) => `${v} months`}
            onChange={(e) => setConsolidatedTenure(parseInt(e.target.value))}
          />
        </div>
      </Card>

      {/* Comparison Results */}
      {debts.length > 0 && currentTotalBalance > 0 && (
        <Card className="bg-gradient-to-br from-teal/5 to-primary/5 border-teal/20">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ArrowRight className="w-6 h-6 text-teal" />
            Comparison Results
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Current Situation */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Situation</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(currentTotalMonthly)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(currentTotalInterest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(currentTotalBalance + currentTotalInterest)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payoff Time:</span>
                  <span className="font-semibold text-gray-900">
                    {currentPayoffMonths === 999 ? 'Never' : `${currentPayoffMonths} months`}
                  </span>
                </div>
              </div>
            </div>

            {/* Consolidated Loan */}
            <div className="bg-white rounded-lg p-6 border-2 border-teal">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Consolidated Loan</h4>
                <Badge variant="success">Recommended</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment:</span>
                  <span className="font-semibold text-teal">{formatCurrency(consolidatedLoan.monthlyPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-semibold text-teal">{formatCurrency(consolidatedLoan.totalInterest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-teal">{formatCurrency(consolidatedLoan.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repayment Period:</span>
                  <span className="font-semibold text-teal">{consolidatedTenure} months</span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Summary */}
          <div className="bg-gradient-to-r from-teal to-primary text-white rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4">Potential Savings</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm opacity-90 mb-1">Monthly Savings</p>
                <p className="text-2xl font-bold">
                  {monthlySavings > 0 ? formatCurrency(monthlySavings) : formatCurrency(0)}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">Total Interest Savings</p>
                <p className="text-2xl font-bold">
                  {interestSavings > 0 ? formatCurrency(interestSavings) : formatCurrency(0)}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">Overall Savings</p>
                <p className="text-2xl font-bold">
                  {totalSavings > 0 ? formatCurrency(totalSavings) : formatCurrency(0)}
                </p>
              </div>
            </div>
            {monthlySavings <= 0 && (
              <p className="text-sm mt-4 opacity-90">
                Note: The consolidated loan may not provide savings with the current terms. Consider adjusting the interest rate or tenure.
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
