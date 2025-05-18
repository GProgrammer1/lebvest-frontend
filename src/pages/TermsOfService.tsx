
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Terms of Service | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="h-6 w-6 text-lebanese-navy" />
            <h1 className="text-3xl font-bold text-lebanese-navy">Terms of Service</h1>
          </div>

          <div className="bg-white p-8 rounded-lg shadow space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                These Terms of Service govern your use of the LebVest platform and website. By accessing or using LebVest, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Use of Service</h2>
              <p className="text-gray-700 mb-3">
                LebVest provides a platform connecting investors with investment opportunities in Lebanon. Users may browse investment opportunities, invest in projects, and list their own projects for funding.
              </p>
              <p className="text-gray-700">
                Users are responsible for maintaining the security of their account and password. LebVest cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. Investments and Risk</h2>
              <p className="text-gray-700 mb-3">
                All investments made through LebVest involve risk. Users acknowledge that they understand these risks and that LebVest does not guarantee returns on investments.
              </p>
              <p className="text-gray-700 mb-3">
                LebVest is not responsible for the success or failure of projects listed on the platform. While we conduct basic verification, we do not guarantee the accuracy of all information provided by project owners.
              </p>
              <p className="text-gray-700">
                Users should conduct their own due diligence before making investment decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Fees and Payments</h2>
              <p className="text-gray-700">
                LebVest charges fees for certain services provided through the platform. These fees are clearly disclosed at the time of transaction. By using our platform, you agree to pay all applicable fees and taxes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
              <p className="text-gray-700">
                The LebVest platform and its original content, features, and functionality are owned by LebVest and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Termination</h2>
              <p className="text-gray-700">
                LebVest reserves the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Changes to Terms</h2>
              <p className="text-gray-700">
                LebVest reserves the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms, please contact us at legal@lebvest.com.
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

export default TermsOfService;
