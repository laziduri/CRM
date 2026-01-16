import Link from 'next/link'
import { AlertTriangle, FileText } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Disclaimer</h1>
          </div>
          <p className="text-lg text-gray-600">
            Last Updated: {new Date().toLocaleDateString('en-SG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Section 1: Introduction */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              This website is operated by Brilliance Advisory Pte. Ltd. (&quot;Brilliance Advisory&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), a Singapore-based company providing application structuring and submission support for personal and business funding to third-party lenders.
            </p>
            <p>
              This website provides general information about funding application support services only. The information contained on this website is for general informational and educational purposes and is not intended to constitute professional advice of any kind.
            </p>
            <p>
              By accessing and using this website, you acknowledge that you have read, understood, and agree to be bound by this Disclaimer. If you do not agree with any part of this Disclaimer, you must not use this website.
            </p>
          </div>
        </Card>

        {/* Section 2: No Financial or Regulated Advice */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. No Financial or Regulated Advice</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Nothing on this website constitutes financial, legal, investment, or regulated financial advice. Brilliance Advisory is not authorised to provide regulated financial advice under the Financial Advisers Act (Cap. 110) of Singapore or any other applicable legislation.
            </p>
            <p>
              The information, content, materials, and services provided on this website are for general guidance purposes only and should not be relied upon as a substitute for professional financial, legal, or investment advice tailored to your specific circumstances.
            </p>
            <p>
              You should seek independent professional advice from qualified financial advisers, legal advisors, or other relevant professionals before making any financial decisions or entering into any financial commitments.
            </p>
          </div>
        </Card>

        {/* Section 3: Not a Lender or Financial Institution */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Not a Lender or Financial Institution</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Brilliance Advisory is not a bank, licensed financial institution, or lender. We do not issue loans, extend credit, disburse funds, or make lending decisions. We do not hold any banking licence, finance company licence, or moneylending licence under the laws of Singapore.
            </p>
            <p>
              Brilliance Advisory provides application structuring and submission support services only. We assist clients in preparing and submitting applications to third-party lenders, but we do not participate in the lending process, credit assessment, or funding decisions.
            </p>
            <p>
              All funding decisions, including approvals, rejections, terms, conditions, interest rates, and fees, are made solely by third-party lenders based on their independent assessment and policies.
            </p>
          </div>
        </Card>

        {/* Section 4: No Guarantee of Outcomes */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. No Guarantee of Outcomes</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Brilliance Advisory does not guarantee, warrant, or promise any specific outcomes, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Approval of any funding application</li>
              <li>Approval of any specific funding amount</li>
              <li>Any particular interest rate, terms, or conditions</li>
              <li>Any specific timeline for application processing or approval</li>
              <li>Any outcome or result from using our services</li>
            </ul>
            <p>
              All funding approvals, terms, rates, conditions, and timelines are determined solely by third-party lenders and are subject to third-party lender assessment. Each third-party lender has its own eligibility criteria, assessment processes, approval policies, and timelines, which are beyond our control.
            </p>
            <p>
              We make reasonable efforts to provide accurate general information and guidance based on available data and our experience, but we cannot and do not guarantee any outcomes, approvals, rates, timelines, or results.
            </p>
          </div>
        </Card>

        {/* Section 5: Accuracy of Information */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Accuracy of Information</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              While we make reasonable efforts to ensure that the information on this website is accurate, complete, and current, we do not warrant or guarantee the accuracy, completeness, currency, or reliability of any information, content, or materials on this website.
            </p>
            <p>
              Information on this website is provided on a general basis and may not be current, applicable, or suitable for all circumstances, individuals, or situations. Information may become outdated or may not reflect the most current terms, rates, conditions, or requirements of third-party lenders.
            </p>
            <p>
              Third-party lenders may modify their products, terms, interest rates, eligibility criteria, and requirements at any time without notice. It is your responsibility to verify all information directly with the relevant third-party lender before making any commitment or decision.
            </p>
            <p>
              We reserve the right to modify, update, or remove any information, content, or materials on this website at any time without notice.
            </p>
          </div>
        </Card>

        {/* Section 6: Limitation of Responsibility */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Responsibility</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              To the maximum extent permitted by law, Brilliance Advisory, its directors, officers, employees, agents, affiliates, and representatives shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, business opportunities, or other losses, arising out of or in connection with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your access to, use of, or reliance on any information, content, or materials on this website</li>
              <li>Any decision made or action taken based on information, content, or materials on this website</li>
              <li>Any errors, omissions, or inaccuracies in information, content, or materials on this website</li>
              <li>Any rejection, delay, or failure of any funding application</li>
              <li>Any terms, conditions, interest rates, or fees offered or charged by any third-party lender</li>
              <li>Any act or omission of any third-party lender or third party</li>
              <li>Any outcome, approval, rate, timeline, or result related to funding applications</li>
              <li>Any interruption, suspension, or termination of access to this website</li>
            </ul>
            <p>
              To the maximum extent permitted by law, our total liability to you, whether in contract, tort (including negligence), or otherwise, shall not exceed the total amount of fees, if any, paid by you to Brilliance Advisory in the twelve (12) months preceding the event giving rise to the claim, or Singapore Dollars One Hundred (S$100), whichever is lower.
            </p>
            <p>
              Nothing in this Disclaimer shall exclude or limit our liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot be excluded or limited under applicable law.
            </p>
          </div>
        </Card>

        {/* Section 7: Third-Party Lenders and External Links */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Lenders and External Links</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              This website may contain references to, or links to, third-party lenders, websites, or resources. Such references or links are provided for general informational purposes only and do not constitute an endorsement, recommendation, or approval by Brilliance Advisory of such third-party lenders, websites, or resources.
            </p>
            <p>
              Brilliance Advisory does not control, monitor, or assume responsibility for the content, products, services, policies, practices, terms, conditions, or actions of any third-party lender, website, or resource. We are not responsible for the accuracy, completeness, currency, or reliability of any information, content, or materials on third-party websites or resources.
            </p>
            <p>
              Your interactions with third-party lenders and your use of third-party websites or resources are solely at your own risk. You acknowledge that any funding agreement or financial transaction entered into with a third-party lender is a separate contractual relationship between you and the lender, and Brilliance Advisory is not a party to such agreements.
            </p>
            <p>
              We are not responsible for any disputes, claims, issues, or losses that may arise between you and any third-party lender or in connection with your use of third-party websites or resources. You agree to resolve any such matters directly with the relevant third-party lender or website operator.
            </p>
          </div>
        </Card>

        {/* Section 8: Use of Website */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Use of Website</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              You access and use this website at your own discretion and risk. You are solely responsible for evaluating the accuracy, completeness, currency, and suitability of any information, content, or materials on this website for your specific circumstances and purposes.
            </p>
            <p>
              You acknowledge that you rely on any information, content, or materials on this website at your own risk. Brilliance Advisory shall not be liable for any loss or damage arising from your reliance on such information, content, or materials.
            </p>
            <p>
              You agree to use this website in accordance with all applicable laws, regulations, and these terms. You agree not to use this website for any unlawful purpose or in any way that could damage, disable, overburden, or impair this website or interfere with any other party&apos;s use of this website.
            </p>
            <p>
              We reserve the right to suspend, restrict, or terminate your access to this website at any time, without notice, for any reason, including but not limited to breach of these terms or any applicable law or regulation.
            </p>
          </div>
        </Card>

        {/* Section 9: Changes to Disclaimer */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Disclaimer</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Brilliance Advisory reserves the right to modify, update, or amend this Disclaimer at any time without notice. Any changes to this Disclaimer will be effective immediately upon posting on this website.
            </p>
            <p>
              It is your responsibility to review this Disclaimer periodically to stay informed of any changes. Your continued access to or use of this website after any changes to this Disclaimer constitutes your acceptance of the modified Disclaimer.
            </p>
            <p>
              If you do not agree to any changes to this Disclaimer, you must discontinue your access to and use of this website immediately.
            </p>
          </div>
        </Card>

        {/* Section 10: Governing Law */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              This Disclaimer is governed by and construed in accordance with the laws of the Republic of Singapore, without regard to its conflict of law principles.
            </p>
            <p>
              Any dispute, controversy, or claim arising out of or relating to this Disclaimer, or your access to or use of this website, shall be subject to the exclusive jurisdiction of the courts of Singapore.
            </p>
            <p>
              You agree to submit to the jurisdiction of the Singapore courts and waive any objection to the venue of any proceedings in such courts.
            </p>
          </div>
        </Card>

        {/* Important Notice */}
        <Card className="mb-8 bg-gray-50 border-gray-200">
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="font-semibold text-gray-900">Important Notice:</p>
            <p>
              Brilliance Advisory Pte. Ltd. is not a bank, licensed financial advisory institution, or lender. We do not provide regulated financial advice. We provide application structuring and submission support services only. All funding approvals, terms, rates, and conditions are subject to third-party lender assessment. We do not guarantee any outcome, approval, rate, or timeline. The information on this website is for general guidance purposes only and should not be relied upon as professional advice.
            </p>
          </div>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-12">
          <Link href="/" className="text-primary hover:text-teal font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
