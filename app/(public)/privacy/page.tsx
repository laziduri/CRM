import Link from 'next/link'
import { FileText, Shield, Lock, Eye, Globe, Mail, Phone } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-modern-dots opacity-3"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-lg text-gray-600">
            Last Updated: {new Date().toLocaleDateString('en-SG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Section 1: Introduction and Scope */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction and Scope</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Brilliance Advisory Pte. Ltd. (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or &quot;Brilliance Advisory&quot;) is a Singapore-based company that provides application structuring and submission support for personal and business funding to third-party lenders. This Privacy Policy explains how we collect, use, disclose, and protect your personal data in accordance with Singapore&apos;s Personal Data Protection Act 2012 (&quot;PDPA&quot;).
            </p>
            <p>
              This Privacy Policy applies to all personal data collected, used, disclosed, and processed by Brilliance Advisory through our website, consultations, communications, and any other services we provide. By using our services or providing your personal data to us, you acknowledge that you have read and understood this Privacy Policy.
            </p>
            <p>
              <strong>Important:</strong> Brilliance Advisory is not a bank, licensed financial advisory institution, or lender. We do not provide regulated financial advice. We provide guidance and application support services only. All loan approvals, terms, rates, and conditions are subject to third-party lender assessment and policies.
            </p>
          </div>
        </Card>

        {/* Section 2: Definition of Personal Data */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definition of Personal Data</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              &quot;Personal Data&quot; means data, whether true or not, about an individual who can be identified:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>From that data; or</li>
              <li>From that data and other information to which we have or are likely to have access.</li>
            </ul>
            <p>
              Personal Data includes, but is not limited to, names, identification numbers, contact information, financial information, employment details, and any other information that can be used to identify an individual.
            </p>
          </div>
        </Card>

        {/* Section 3: Types of Personal Data Collected */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Types of Personal Data Collected</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>We may collect the following types of personal data:</p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Identification Information:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name, identification number (NRIC/FIN), passport number, date of birth</li>
                  <li>Contact information (address, email address, telephone numbers)</li>
                  <li>Nationality and residential status</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Employment and Financial Information:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Employment details (employer name, job title, employment period, monthly income)</li>
                  <li>Income information, salary slips, bank statements</li>
                  <li>Credit history, credit bureau reports (if provided)</li>
                  <li>Financial statements, tax assessments</li>
                  <li>Loan requirements, loan amounts, intended loan purposes</li>
                  <li>Existing debts and financial obligations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Information (for business loan inquiries):</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Company name, registration number (UEN), business profile</li>
                  <li>Business financial statements, bank statements</li>
                  <li>Director and shareholder information</li>
                  <li>Business operations and industry details</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Technical and Usage Information:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>IP address, browser type, device information</li>
                  <li>Website usage data, cookies and tracking technologies</li>
                  <li>Communication records and correspondence</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Section 4: How Personal Data is Collected */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How Personal Data is Collected</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>We collect personal data through various means, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Directly from you when you provide information through our website, application forms, or during consultations</li>
              <li>Through communications with you, including emails, telephone calls, and written correspondence</li>
              <li>From third parties, such as credit bureaus or lenders, where you have consented to such collection</li>
              <li>Automatically through your use of our website, including through cookies and similar tracking technologies</li>
              <li>From publicly available sources, where relevant and permitted by law</li>
            </ul>
          </div>
        </Card>

        {/* Section 5: Purposes of Collection, Use and Disclosure */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Purposes of Collection, Use and Disclosure</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>We collect, use, and disclose your personal data for the following purposes:</p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Application Support Services:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Assessing your funding requirements and financial profile</li>
                  <li>Providing guidance on loan options and application structuring</li>
                  <li>Assisting with loan application preparation and documentation</li>
                  <li>Facilitating submission of applications to third-party lenders</li>
                  <li>Communicating with lenders on your behalf, subject to your consent</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Service Delivery and Operations:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Processing and managing your inquiries and applications</li>
                  <li>Communicating with you regarding our services</li>
                  <li>Providing customer support and responding to your requests</li>
                  <li>Managing our business relationships with lenders and service providers</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Legal and Regulatory Compliance:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Complying with applicable laws, regulations, and legal obligations</li>
                  <li>Responding to legal processes, requests from government authorities, or court orders</li>
                  <li>Protecting our rights, property, or safety, and that of our clients and third parties</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Operations:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Conducting internal business analytics and improving our services</li>
                  <li>Managing and maintaining our website and IT systems</li>
                  <li>Training our staff and ensuring service quality</li>
                </ul>
              </div>
            </div>
            <p className="mt-4">
              <strong>Disclosure to Third-Party Lenders:</strong> With your consent, we may share your personal data with third-party lenders for the purpose of facilitating loan applications and assessments. Such lenders are independent entities with their own privacy policies and data handling practices. All loan approvals, terms, rates, and conditions are subject to third-party lender assessment.
            </p>
          </div>
        </Card>

        {/* Section 6: Consent and Withdrawal of Consent */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Consent and Withdrawal of Consent</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              By providing your personal data to us, you consent to our collection, use, and disclosure of your personal data for the purposes outlined in this Privacy Policy.
            </p>
            <p>
              You may withdraw your consent at any time by contacting us using the contact information provided in Section 15. Upon receiving your withdrawal request, we will inform you of the consequences of withdrawal (which may include our inability to continue providing certain services) and cease collecting, using, and disclosing your personal data, except where such collection, use, or disclosure is required or permitted by law.
            </p>
            <p>
              Please note that withdrawal of consent may impact our ability to provide application support services, as certain information is necessary for us to assist with application structuring and submission to third-party lenders.
            </p>
          </div>
        </Card>

        {/* Section 7: Use of Service Providers and Third Parties */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Use of Service Providers and Third Parties</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We may engage third-party service providers to assist us in operating our business and providing services. Such service providers may include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>IT service providers and cloud hosting services</li>
              <li>Communication and messaging service providers</li>
              <li>Professional service providers (legal, accounting, consulting)</li>
              <li>Third-party lenders (with your consent)</li>
            </ul>
            <p>
              We require our service providers to implement reasonable safeguards to protect your personal data and to use it only for the purposes for which it was disclosed. However, we do not control the privacy practices of third-party service providers, and you should review their privacy policies.
            </p>
            <p>
              <strong>Third-Party Lenders:</strong> When you consent to us sharing your information with third-party lenders, such lenders are independent entities. We are not responsible for their data handling practices, and your relationship with lenders (including data sharing) is governed by their respective privacy policies and agreements.
            </p>
          </div>
        </Card>

        {/* Section 8: Protection of Personal Data */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Protection of Personal Data</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We implement reasonable administrative, technical and physical safeguards to protect your personal data against unauthorised access, collection, use, disclosure, copying, modification, disposal, or similar risks. These safeguards include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Secure data storage systems and encryption technologies</li>
              <li>Access controls and authentication measures</li>
              <li>Regular security assessments and updates</li>
              <li>Staff training on data protection and confidentiality</li>
              <li>Physical security measures for our premises and equipment</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic storage is completely secure. While we strive to protect your personal data, we cannot guarantee absolute security. You should also take reasonable steps to protect your personal information, such as keeping your login credentials confidential.
            </p>
          </div>
        </Card>

        {/* Section 9: Accuracy of Personal Data */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Accuracy of Personal Data</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We make reasonable efforts to ensure that personal data in our possession is accurate and complete. However, we rely on you to provide accurate, complete, and up-to-date information.
            </p>
            <p>
              Please inform us promptly if there are any changes to your personal data or if you become aware of any inaccuracies. You may update your information by contacting us using the contact details provided in Section 15.
            </p>
            <p>
              Inaccurate or incomplete information may affect our ability to provide application support services and may impact loan application outcomes with third-party lenders.
            </p>
          </div>
        </Card>

        {/* Section 10: Retention of Personal Data */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Retention of Personal Data</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, or as required or permitted by applicable laws and regulations.
            </p>
            <p>
              Factors we consider in determining retention periods include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>The purpose for which the data was collected</li>
              <li>Legal and regulatory requirements (including PDPA requirements)</li>
              <li>Statutory limitation periods for legal claims</li>
              <li>Business and operational needs</li>
            </ul>
            <p>
              When personal data is no longer needed, we will dispose of it securely in accordance with our data disposal policies and procedures.
            </p>
          </div>
        </Card>

        {/* Section 11: Transfer of Personal Data Outside Singapore */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Transfer of Personal Data Outside Singapore</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We generally store and process your personal data in Singapore. However, we may transfer your personal data outside Singapore to our service providers, business partners, or other third parties, subject to appropriate safeguards and in compliance with PDPA requirements.
            </p>
            <p>
              When transferring personal data outside Singapore, we will:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Obtain your consent where required by law</li>
              <li>Ensure that the recipient country has comparable data protection laws, or</li>
              <li>Implement appropriate contractual safeguards to protect your personal data</li>
            </ul>
            <p>
              By using our services, you consent to such transfers in accordance with this Privacy Policy.
            </p>
          </div>
        </Card>

        {/* Section 12: Access and Correction Requests */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Access and Correction Requests</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Under the PDPA, you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Access:</strong> Request access to your personal data that we hold</li>
              <li><strong>Correction:</strong> Request correction of any inaccurate or incomplete personal data</li>
            </ul>
            <p>
              To make an access or correction request, please contact us using the contact information provided in Section 15. We will respond to your request within a reasonable timeframe and in accordance with PDPA requirements.
            </p>
            <p>
              Please note that we may charge a reasonable fee for processing access requests, and we may refuse access or correction in certain circumstances as permitted by law (for example, where the request is frivolous or vexatious, or where disclosure would reveal confidential information about another individual).
            </p>
          </div>
        </Card>

        {/* Section 13: Cookies and Website Analytics */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Cookies and Website Analytics</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Our website may use cookies and similar tracking technologies to collect information about your browsing activities and preferences. Cookies are small text files stored on your device that help us:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Improve website functionality and user experience</li>
              <li>Provide personalized content</li>
            </ul>
            <p>
              You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.
            </p>
            <p>
              We may also use third-party analytics services (such as Google Analytics) to analyze website usage. These services may use cookies and similar technologies to collect and analyze information about website usage.
            </p>
          </div>
        </Card>

        {/* Section 14: Changes to this Privacy Policy */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to this Privacy Policy</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements. The updated Privacy Policy will be posted on our website with a revised &quot;Last Updated&quot; date.
            </p>
            <p>
              We encourage you to review this Privacy Policy periodically to stay informed about how we collect, use, and protect your personal data. Your continued use of our services after any changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </div>
        </Card>

        {/* Section 15: Contact Information for Data Protection Matters */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information for Data Protection Matters</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our handling of your personal data, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Email:</p>
                  <p>privacy@brillianceadvisory.sg</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Data Protection Officer:</p>
                  <p>Brilliance Advisory Pte. Ltd.</p>
                </div>
              </div>
            </div>
            <p>
              We will respond to your inquiries and requests in a timely manner and in accordance with PDPA requirements.
            </p>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="mb-8 bg-gray-50 border-gray-200">
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="font-semibold text-gray-900">Important Notice:</p>
            <p>
              The information provided in this Privacy Policy and through our services is for general guidance purposes only. Brilliance Advisory Pte. Ltd. is not a bank, licensed financial advisory institution, or lender. We do not provide regulated financial advice. We provide application structuring and submission support services only. All loan approvals, terms, rates, and conditions are subject to third-party lender assessment. We do not guarantee any outcome, approval, rate, or timeline.
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
