'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import { FileText, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:text-primary-dark mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-gradient-text">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-SG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <Card className="prose prose-lg max-w-none">
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed">
                These Terms and Conditions ("Terms") govern your use of the advisory services provided by Brilliance Advisory Pte. Ltd. ("Brilliance Advisory", "we", "us", or "our"). By engaging our services, you ("Client", "you", or "your") acknowledge that you have read, understood, and agree to be bound by these Terms.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Definitions and Interpretation</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  <strong>"Advisory Services"</strong> means the financial consultancy and loan advisory services provided by Brilliance Advisory, including but not limited to assessment, consultation, and guidance relating to personal and business loan products.
                </p>
                <p>
                  <strong>"Client"</strong> means any individual or entity that engages Brilliance Advisory for Advisory Services.
                </p>
                <p>
                  <strong>"Lender"</strong> means any financial institution, bank, licensed moneylender, or other third-party entity that provides loan products or financing solutions.
                </p>
                <p>
                  <strong>"Loan Application"</strong> means any application submitted by the Client to a Lender for a loan product, whether submitted directly by the Client or facilitated through Brilliance Advisory.
                </p>
                <p>
                  In these Terms, unless the context otherwise requires, words in the singular include the plural and vice versa, and references to "including" are to be construed as "including without limitation".
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Scope of Services</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Brilliance Advisory provides financial consultancy and advisory services relating to personal and business loan products available in Singapore. Our services may include, but are not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Assessment of your financial profile, requirements, and circumstances</li>
                  <li>Provision of information and guidance regarding loan products and financing options</li>
                  <li>Strategic planning and structuring of loan applications</li>
                  <li>Liaison with Lenders on your behalf, subject to your explicit consent</li>
                  <li>Assistance with documentation and application processes</li>
                </ul>
                <p className="font-semibold text-gray-900 mt-4">
                  IMPORTANT: Brilliance Advisory is not a bank, financial institution, or lender. We do not provide loans, extend credit, or disburse funds. We act solely as a consultancy and advisory service provider.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Advisory-Only Relationship</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  The relationship between Brilliance Advisory and the Client is strictly advisory in nature. Brilliance Advisory provides information, guidance, and recommendations based on our assessment of your circumstances. All decisions regarding loan applications, lender selection, loan acceptance, and financial commitments are made solely by the Client.
                </p>
                <p>
                  Brilliance Advisory does not act as your agent, representative, or fiduciary in any capacity beyond the provision of advisory services. We do not have the authority to bind you to any loan agreement or financial commitment.
                </p>
                <p>
                  You acknowledge and agree that you are solely responsible for evaluating the suitability of any loan product, understanding all terms and conditions, and making independent decisions regarding your financial affairs.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. No Guarantee of Loan Approval</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Brilliance Advisory does not guarantee, warrant, or promise that any Loan Application will be approved, that any specific loan amount will be approved, or that any particular interest rate, terms, or conditions will be offered by any Lender.
                </p>
                <p>
                  Loan approvals, interest rates, loan amounts, tenure, fees, and all other terms and conditions are determined solely by the Lender based on their independent assessment of your creditworthiness, financial profile, and other factors. Each Lender has its own eligibility criteria, assessment processes, and approval policies, which are beyond our control.
                </p>
                <p>
                  We make reasonable efforts to provide accurate information and guidance based on available data and our experience, but we cannot and do not guarantee outcomes, timelines, or results. All loan approvals are subject to the Lender's final assessment and credit evaluation.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Client Responsibilities</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, complete, and up-to-date information regarding your financial situation, income, expenses, existing debts, and any other information requested by Brilliance Advisory or Lenders</li>
                  <li>Review all loan terms, conditions, and documentation carefully before making any commitment</li>
                  <li>Seek independent legal, financial, or professional advice if you have any doubts or concerns regarding any loan product or financial decision</li>
                  <li>Make your own independent assessment of the suitability of any loan product for your circumstances</li>
                  <li>Comply with all applicable laws, regulations, and requirements in relation to loan applications and financial transactions</li>
                  <li>Notify Brilliance Advisory promptly of any material changes to your financial circumstances or requirements</li>
                  <li>Take full responsibility for all decisions made and actions taken based on information or advice provided by Brilliance Advisory</li>
                </ul>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Accuracy of Information Provided</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  While Brilliance Advisory makes reasonable efforts to ensure the accuracy of information provided to Clients, including information about loan products, interest rates, terms, and Lender requirements, we do not warrant or guarantee the accuracy, completeness, or currency of such information.
                </p>
                <p>
                  Information provided is based on data available at the time of provision and may be subject to change without notice. Lenders may modify their products, terms, interest rates, and eligibility criteria at any time. It is your responsibility to verify all information directly with the Lender before making any commitment.
                </p>
                <p>
                  Brilliance Advisory shall not be liable for any errors, omissions, or inaccuracies in information provided, or for any decisions made or actions taken based on such information.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Fees and Payments</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Brilliance Advisory's advisory and consultation services are provided to Clients free of charge. We operate on a commission-based model where financial institutions may pay us a service fee only when you successfully secure a loan through our recommendation, subject to your explicit consent and the terms of our agreement with such institutions.
                </p>
                <p>
                  You acknowledge that this commission arrangement does not influence our advisory recommendations, and we maintain our commitment to prioritising your best interests in our service delivery.
                </p>
                <p>
                  You are responsible for all fees, charges, and costs payable to Lenders in connection with any loan product, including but not limited to processing fees, administrative fees, interest, late payment fees, and early repayment fees. These fees are determined solely by the Lender and are separate from any fees payable to Brilliance Advisory.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  To the fullest extent permitted by law, Brilliance Advisory, its directors, officers, employees, agents, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, or business opportunities, arising out of or in connection with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The use of or inability to use our Advisory Services</li>
                  <li>Any decision made or action taken based on information or advice provided by Brilliance Advisory</li>
                  <li>Any rejection, delay, or failure of any Loan Application</li>
                  <li>Any terms, conditions, interest rates, or fees offered or charged by any Lender</li>
                  <li>Any act or omission of any Lender or third party</li>
                  <li>Any errors, omissions, or inaccuracies in information provided</li>
                </ul>
                <p>
                  Our total liability to you, whether in contract, tort (including negligence), or otherwise, shall not exceed the total amount of fees, if any, paid by you to Brilliance Advisory in the twelve (12) months preceding the event giving rise to the claim.
                </p>
                <p>
                  Nothing in these Terms shall exclude or limit our liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot be excluded or limited under applicable law.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Lenders and Websites</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Our Advisory Services may involve interaction with third-party Lenders, and we may provide links or references to third-party websites or resources. Brilliance Advisory does not endorse, control, or assume responsibility for the content, products, services, policies, or practices of any third-party Lender or website.
                </p>
                <p>
                  Your interactions with Lenders and your use of third-party websites are solely at your own risk. You acknowledge that any loan agreement or financial transaction entered into with a Lender is a separate contractual relationship between you and the Lender, and Brilliance Advisory is not a party to such agreements.
                </p>
                <p>
                  We are not responsible for any disputes, claims, or issues that may arise between you and any Lender. You agree to resolve any such matters directly with the relevant Lender.
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Confidentiality</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Brilliance Advisory maintains strict confidentiality standards regarding Client information. We will not disclose your personal or financial information to third parties except:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With your explicit written consent</li>
                  <li>To Lenders that you have chosen to apply with, and only to the extent necessary for the loan application process</li>
                  <li>As required by law, regulation, or court order</li>
                  <li>To our professional advisors, subject to confidentiality obligations</li>
                </ul>
                <p>
                  We implement reasonable security measures to protect your information, but you acknowledge that no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
                </p>
                <p>
                  You agree that Brilliance Advisory may use anonymised, aggregated data for analytical, statistical, or business improvement purposes, provided that such data cannot be used to identify you individually.
                </p>
              </div>
            </div>

            {/* Section 11 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination of Services</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Either party may terminate the advisory relationship at any time, with or without cause, by providing written notice to the other party.
                </p>
                <p>
                  Upon termination, Brilliance Advisory will cease providing Advisory Services, but termination shall not affect:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Any rights or obligations that have accrued prior to termination</li>
                  <li>The continued validity of these Terms in relation to services already provided</li>
                  <li>Any ongoing loan applications or processes that have been initiated</li>
                </ul>
                <p>
                  Brilliance Advisory reserves the right to suspend or terminate services immediately if you breach these Terms, provide false or misleading information, or engage in any fraudulent or illegal activity.
                </p>
              </div>
            </div>

            {/* Section 12 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Amendments to Terms</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  Brilliance Advisory reserves the right to modify, amend, or update these Terms at any time. Material changes will be notified to Clients through reasonable means, which may include email notification or posting on our website.
                </p>
                <p>
                  Your continued use of our Advisory Services after such modifications constitutes your acceptance of the amended Terms. If you do not agree to the amended Terms, you must discontinue use of our services and notify us in writing.
                </p>
                <p>
                  It is your responsibility to review these Terms periodically to stay informed of any changes.
                </p>
              </div>
            </div>

            {/* Section 13 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law and Jurisdiction</h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the Republic of Singapore, without regard to its conflict of law principles.
                </p>
                <p>
                  Any dispute, controversy, or claim arising out of or relating to these Terms, or the breach, termination, or invalidity thereof, shall be subject to the exclusive jurisdiction of the courts of Singapore.
                </p>
                <p>
                  You agree to submit to the jurisdiction of the Singapore courts and waive any objection to the venue of any proceedings in such courts.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Brilliance Advisory Pte. Ltd.</strong><br />
                Email: <a href="mailto:info@brillianceadvisory.sg" className="text-primary hover:underline">info@brillianceadvisory.sg</a><br />
                Website: <a href="/contact" className="text-primary hover:underline">Contact Us</a>
              </p>
            </div>

            {/* Acknowledgment */}
            <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-gray-700 leading-relaxed font-medium">
                By using our Advisory Services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree to these Terms, you must not use our services.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
