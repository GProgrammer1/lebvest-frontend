
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Privacy Policy | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="h-6 w-6 text-lebanese-navy" />
            <h1 className="text-3xl font-bold text-lebanese-navy">Privacy Policy</h1>
          </div>

          <div className="bg-white p-8 rounded-lg shadow space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                At LebVest, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully to understand our practices regarding your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-gray-700 mb-3">
                We collect several types of information from and about users of our platform, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Personal identifiable information such as name, email address, phone number, and address.</li>
                <li>Financial information necessary for investment transactions and identity verification.</li>
                <li>Usage data including how you interact with our platform.</li>
                <li>Device information such as IP address, browser type, and operating system.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Provide, maintain, and improve our platform and services.</li>
                <li>Process transactions and send related information.</li>
                <li>Verify your identity and prevent fraud.</li>
                <li>Send administrative notifications and updates.</li>
                <li>Respond to your comments and questions.</li>
                <li>Understand user trends and improve user experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Information Sharing</h2>
              <p className="text-gray-700 mb-3">
                We may share your information with:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Service providers who perform services on our behalf.</li>
                <li>Business partners with whom we offer joint products or services.</li>
                <li>Law enforcement or regulatory agencies when required by law.</li>
                <li>Other users when you explicitly consent to share your information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-3">
                Depending on your location, you may have certain rights regarding your personal data, including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>The right to access personal data we hold about you.</li>
                <li>The right to rectify inaccurate personal data.</li>
                <li>The right to request erasure of your personal data.</li>
                <li>The right to restrict or object to our processing of your personal data.</li>
                <li>The right to data portability.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Cookies and Similar Technologies</h2>
              <p className="text-gray-700">
                We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at privacy@lebvest.com.
              </p>
            </section>
            
            <div className="text-sm text-gray-500 pt-6 border-t border-gray-200">
              <p>Last updated: May 15, 2025</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
