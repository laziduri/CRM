'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AmbientBackground } from '@/components/background/AmbientBackground'
import { GlowBackground } from '@/components/background/GlowBackground'
import { CalculatingBackground } from '@/components/background/CalculatingBackground'
import { motion } from 'motion/react'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { calculateLoanPayment, formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default function CalculatorPreview() {
  const [loanAmount, setLoanAmount] = useState(50000)
  const [interestRate, setInterestRate] = useState(4.5)
  const [tenure, setTenure] = useState(36)

  const calculation = calculateLoanPayment(loanAmount, interestRate, tenure)

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-visible w-full">
      {/* Ambient background with moderate motion */}
      <AmbientBackground intensity="moderate" />
      <GlowBackground intensity="subtle" />
      {/* Animated calculating background */}
      <CalculatingBackground intensity="moderate" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal Layout: Text on Left, Calculator on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side: Header and Subheader */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold mb-3">
              <AnimatedGradientText className="text-3xl md:text-3xl lg:text-4xl">
                Calculate Your Loan
              </AnimatedGradientText>
            </h2>
            <p className="text-base md:text-lg text-gray-700 text-body mb-4">
              Get an instant estimate of your monthly payments
            </p>
            {/* CTA Button moved to subheader */}
            <div>
              <Link href="/calculator">
                <Button variant="primary" size="md" className="w-full sm:w-auto">
                  Try Our Calculator
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Compact Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-4 md:p-5 relative overflow-hidden bg-gradient-to-br from-navy via-navy-light to-teal">
              <div className="relative z-10">
                {/* Compact Sliders with white text */}
                <div className="space-y-4 mb-4 [&_label]:text-white [&_span]:text-white [&_.text-accent-gray2]:text-white [&_.text-primary]:text-white [&_.text-accent-gray]:text-white/70">
                  <div className="w-full">
                    <div className="flex justify-between items-baseline mb-3">
                      <label className="text-sm font-medium text-white">Loan Amount</label>
                      <span className="text-sm font-semibold text-white">{formatCurrency(loanAmount)}</span>
                    </div>
                    <input
                      type="range"
                      value={loanAmount}
                      min={1000}
                      max={500000}
                      step={1000}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                      style={{
                        background: `linear-gradient(to right, white 0%, white ${((loanAmount - 1000) / (500000 - 1000)) * 100}%, rgba(255,255,255,0.2) ${((loanAmount - 1000) / (500000 - 1000)) * 100}%, rgba(255,255,255,0.2) 100%)`,
                      }}
                      onChange={(e) => {
                        setLoanAmount(parseInt(e.target.value))
                      }}
                    />
                    <div className="flex justify-between items-baseline text-xs text-white/70 mt-3">
                      <span>{formatCurrency(1000)}</span>
                      <span>{formatCurrency(500000)}</span>
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="flex justify-between items-baseline mb-3">
                      <label className="text-sm font-medium text-white">Interest Rate (EIR p.a.)</label>
                      <span className="text-sm font-semibold text-white">{interestRate.toFixed(2)}%</span>
                    </div>
                    <input
                      type="range"
                      value={interestRate}
                      min={1}
                      max={15}
                      step={0.1}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                      style={{
                        background: `linear-gradient(to right, white 0%, white ${((interestRate - 1) / (15 - 1)) * 100}%, rgba(255,255,255,0.2) ${((interestRate - 1) / (15 - 1)) * 100}%, rgba(255,255,255,0.2) 100%)`,
                      }}
                      onChange={(e) => {
                        setInterestRate(parseFloat(e.target.value))
                      }}
                    />
                    <div className="flex justify-between items-baseline text-xs text-white/70 mt-3">
                      <span>1%</span>
                      <span>15%</span>
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="flex justify-between items-baseline mb-3">
                      <label className="text-sm font-medium text-white">Loan Tenure</label>
                      <span className="text-sm font-semibold text-white">{tenure} months</span>
                    </div>
                    <input
                      type="range"
                      value={tenure}
                      min={12}
                      max={84}
                      step={6}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                      style={{
                        background: `linear-gradient(to right, white 0%, white ${((tenure - 12) / (84 - 12)) * 100}%, rgba(255,255,255,0.2) ${((tenure - 12) / (84 - 12)) * 100}%, rgba(255,255,255,0.2) 100%)`,
                      }}
                      onChange={(e) => {
                        setTenure(parseInt(e.target.value))
                      }}
                    />
                    <div className="flex justify-between items-baseline text-xs text-white/70 mt-3">
                      <span>12 months</span>
                      <span>84 months</span>
                    </div>
                  </div>
                </div>

                {/* Compact Results Display with white text */}
                <div className="bg-white/10 rounded-lg p-4 mb-4 border-2 border-white/20">
                  <div className="text-center">
                    <p className="text-xs font-medium text-white/90 mb-1 uppercase tracking-wide">
                      Monthly Payment
                    </p>
                    <motion.p
                      key={calculation.monthlyPayment}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl md:text-3xl font-bold text-white mb-1"
                    >
                      {formatCurrency(calculation.monthlyPayment)}
                    </motion.p>
                    <p className="text-xs text-white/80">
                      Total Interest: {formatCurrency(calculation.totalInterest)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
