import LoanCalculator from '@/components/calculator/LoanCalculator'
import { FileText } from 'lucide-react'

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 animate-gradient-text">Loan Calculator</h1>
          <p className="text-lg text-gray-600">
            Calculate your monthly payments, total interest, and see a detailed payment schedule
          </p>
        </div>
        <LoanCalculator />
        
        {/* Disclaimer Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Important Notice</h3>
                <div className="text-xs text-gray-600 leading-relaxed space-y-2">
                  <p>
                    The illustration and computation above is intended for general use only. You may refer to this as a guide for indicative purposes only and is not an offer of credit facilities. Credit facilities are granted at the discretion of participating banks and licensed financial institutions.
                  </p>
                  <p>
                    <strong>Important:</strong> Brilliance Advisory Pte. Ltd. is not a bank, licensed financial advisory institution, or lender. We do not provide regulated financial advice. All loan approvals, terms, rates, and conditions are subject to third-party lender assessment and policies.
                  </p>
                  <p>
                    Prevailing regulatory requirements apply, and any formulae used for the illustration may change at any time without notice. Brilliance Advisory Pte. Ltd. accepts no liability or responsibility for any use of or reliance on any conclusions arising from or in relation to the illustration, including any errors or omissions thereof.
                  </p>
                  <p>
                    Actual interest rates, loan amounts, tenures, and terms offered by lenders may differ from the calculator results and are subject to individual credit assessment, eligibility criteria, and lender policies. The calculator provides estimates only and should not be considered as a guarantee of loan approval or specific terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
