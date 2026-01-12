'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, X } from 'lucide-react'
import LoanCard from '@/components/sections/LoanCard'
import LoanComparison from '@/components/comparison/LoanComparison'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Slider from '@/components/ui/Slider'
import { mockLoans } from '@/lib/data'
import { Loan } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function LoansPage() {
  const [loans] = useState<Loan[]>(mockLoans)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLoanType, setSelectedLoanType] = useState<string>('all')
  const [interestRateRange, setInterestRateRange] = useState([0, 10])
  const [loanAmountRange, setLoanAmountRange] = useState([0, 500000])
  const [showFilters, setShowFilters] = useState(false)
  const [compareLoans, setCompareLoans] = useState<Set<string>>(new Set())
  const [showComparison, setShowComparison] = useState(false)
  const [sortBy, setSortBy] = useState<'rate' | 'amount' | 'tenure'>('rate')

  const filteredLoans = useMemo(() => {
    let filtered = [...loans]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (loan) =>
          loan.lender.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loan.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Loan type filter
    if (selectedLoanType !== 'all') {
      filtered = filtered.filter((loan) => loan.loanType === selectedLoanType)
    }

    // Interest rate filter
    filtered = filtered.filter(
      (loan) =>
        loan.interestRate >= interestRateRange[0] &&
        loan.interestRate <= interestRateRange[1]
    )

    // Loan amount filter
    filtered = filtered.filter(
      (loan) =>
        loan.maxAmount >= loanAmountRange[0] &&
        loan.minAmount <= loanAmountRange[1]
    )

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rate':
          return a.interestRate - b.interestRate
        case 'amount':
          return b.maxAmount - a.maxAmount
        case 'tenure':
          return b.maxTenure - a.maxTenure
        default:
          return 0
      }
    })

    return filtered
  }, [loans, searchQuery, selectedLoanType, interestRateRange, loanAmountRange, sortBy])

  const handleCompareChange = (loanId: string, checked: boolean) => {
    const newCompare = new Set(compareLoans)
    if (checked) {
      newCompare.add(loanId)
    } else {
      newCompare.delete(loanId)
    }
    setCompareLoans(newCompare)
  }

  const loansToCompare = useMemo(() => {
    return loans.filter((loan) => compareLoans.has(loan.id))
  }, [loans, compareLoans])

  return (
    <div className="min-h-screen bg-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 animate-gradient-text">Compare Loans</h1>
          <p className="text-lg text-gray-600">
            Find and compare the best loan options for your needs
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by lender or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rate' | 'amount' | 'tenure')}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="rate">Sort by Rate</option>
                <option value="amount">Sort by Amount</option>
                <option value="tenure">Sort by Tenure</option>
              </select>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
              </Button>
              {compareLoans.size > 0 && (
                <Button
                  variant="primary"
                  onClick={() => setShowComparison(true)}
                  className="flex items-center gap-2"
                >
                  Compare ({compareLoans.size})
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Type
                  </label>
                  <select
                    value={selectedLoanType}
                    onChange={(e) => setSelectedLoanType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Types</option>
                    <option value="personal">Personal</option>
                    <option value="business">Business</option>
                    <option value="home">Home</option>
                    <option value="car">Car</option>
                  </select>
                </div>
                <div>
                  <Slider
                    label="Interest Rate"
                    value={interestRateRange[1]}
                    min={0}
                    max={10}
                    step={0.1}
                    formatValue={(v) => `${v.toFixed(1)}%`}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value)
                      setInterestRateRange([interestRateRange[0], newValue])
                    }}
                  />
                </div>
                <div>
                  <Slider
                    label="Max Loan Amount"
                    value={loanAmountRange[1]}
                    min={0}
                    max={500000}
                    step={10000}
                    formatValue={(v) => formatCurrency(v)}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      setLoanAmountRange([loanAmountRange[0], newValue])
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedLoanType('all')
                      setInterestRateRange([0, 10])
                      setLoanAmountRange([0, 500000])
                    }}
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredLoans.length} loan{filteredLoans.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              onCompareChange={handleCompareChange}
              isComparing={compareLoans.has(loan.id)}
            />
          ))}
        </div>

        {filteredLoans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No loans found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedLoanType('all')
                setInterestRateRange([0, 10])
                setLoanAmountRange([0, 500000])
              }}
              className="mt-4"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      <LoanComparison
        loans={loansToCompare}
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </div>
  )
}
