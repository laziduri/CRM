'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { DollarSign, TrendingUp, Calculator, Calendar } from 'lucide-react'
import Card from '@/components/ui/Card'
import Slider from '@/components/ui/Slider'
import Input from '@/components/ui/Input'
import { calculateLoanPayment, formatCurrency } from '@/lib/utils'

// Using website's color scheme: navy blue (#1E3A5F) and teal (#0F766E, #14B8A6)
const COLORS = ['#1E3A5F', '#0F766E', '#14B8A6']
const CHART_COLORS = {
  principal: '#1E3A5F', // Primary navy
  interest: '#14B8A6', // Teal light
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(50000)
  const [interestRate, setInterestRate] = useState(4.5)
  const [tenure, setTenure] = useState(36)

  const calculation = calculateLoanPayment(loanAmount, interestRate, tenure)

  const chartData = calculation.paymentSchedule.slice(0, 12).map((payment, index) => ({
    month: `Month ${index + 1}`,
    principal: Math.round(payment.principal),
    interest: Math.round(payment.interest),
  }))

  const pieData = [
    { name: 'Principal', value: Math.round(loanAmount) },
    { name: 'Interest', value: Math.round(calculation.totalInterest) },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-7 h-7 text-primary" />
          <h2 className="text-2xl font-bold text-primary">Loan Calculator</h2>
        </div>
        <div className="space-y-6">
          <Slider
            label="Loan Amount"
            value={loanAmount}
            min={1000}
            max={500000}
            step={1000}
            formatValue={(v) => formatCurrency(v)}
            onChange={(e) => {
              setLoanAmount(parseInt(e.target.value))
            }}
          />

          <Slider
            label="Interest Rate (p.a.)"
            value={interestRate}
            min={1}
            max={15}
            step={0.1}
            formatValue={(v) => `${v.toFixed(2)}%`}
            onChange={(e) => {
              setInterestRate(parseFloat(e.target.value))
            }}
          />

          <Slider
            label="Loan Tenure (months)"
            value={tenure}
            min={12}
            max={84}
            step={6}
            formatValue={(v) => `${v} months`}
            onChange={(e) => {
              setTenure(parseInt(e.target.value))
            }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium text-accent-gray2 uppercase tracking-wide">Monthly Payment</p>
            </div>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(calculation.monthlyPayment)}
            </p>
            <p className="text-xs text-accent-gray mt-2">Per month for {tenure} months</p>
          </div>
        </Card>
        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-teal/5 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-teal" />
              <p className="text-sm font-medium text-accent-gray2 uppercase tracking-wide">Total Interest</p>
            </div>
            <p className="text-3xl font-bold text-teal">
              {formatCurrency(calculation.totalInterest)}
            </p>
            <p className="text-xs text-accent-gray mt-2">{((calculation.totalInterest / loanAmount) * 100).toFixed(2)}% of principal</p>
          </div>
        </Card>
        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium text-accent-gray2 uppercase tracking-wide">Total Amount</p>
            </div>
            <p className="text-3xl font-bold text-primary-dark">
              {formatCurrency(calculation.totalAmount)}
            </p>
            <p className="text-xs text-accent-gray mt-2">Principal + Interest</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-bold text-primary mb-4">Payment Breakdown (First Year)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#64748B', fontSize: 12 }}
                stroke="#E5E5E5"
              />
              <YAxis 
                tick={{ fill: '#64748B', fontSize: 12 }}
                stroke="#E5E5E5"
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E5E5', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="square"
              />
              <Bar 
                dataKey="principal" 
                stackId="a" 
                fill={CHART_COLORS.principal}
                name="Principal"
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="interest" 
                stackId="a" 
                fill={CHART_COLORS.interest}
                name="Interest"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-primary mb-4">Total Payment Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E5E5', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-6">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-accent-gray2">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-primary">Payment Schedule (First 12 Months)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-primary/20 bg-secondary-gray">
                <th className="text-left py-3 px-4 font-semibold text-primary">Month</th>
                <th className="text-right py-3 px-4 font-semibold text-primary">Principal</th>
                <th className="text-right py-3 px-4 font-semibold text-primary">Interest</th>
                <th className="text-right py-3 px-4 font-semibold text-primary">Balance</th>
              </tr>
            </thead>
            <tbody>
              {calculation.paymentSchedule.slice(0, 12).map((payment, index) => (
                <tr 
                  key={payment.month} 
                  className="border-b border-secondary-gray3/50 hover:bg-accent-blue/30 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-accent-gray2">{payment.month}</td>
                  <td className="text-right py-3 px-4 text-primary font-medium">{formatCurrency(payment.principal)}</td>
                  <td className="text-right py-3 px-4 text-teal font-medium">{formatCurrency(payment.interest)}</td>
                  <td className="text-right py-3 px-4 text-accent-gray2">{formatCurrency(payment.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
