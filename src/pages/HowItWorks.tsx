import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>How It Works | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-lebanese-navy text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <HelpCircle className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How LebVest Works</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Our platform simplifies investment in Lebanon's most promising opportunities,
              connecting businesses with capital and investors with returns.
            </p>
          </div>
        </section>

        {/* For Investors */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-lebanese-navy">For Investors</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-lebanese-navy rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold mb-3">Create an Account</h3>
                <p className="text-gray-700">
                  Sign up on LebVest to access our curated investment opportunities across different sectors in Lebanon.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lebanese-navy rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold mb-3">Browse Investments</h3>
                <p className="text-gray-700">
                  Explore vetted opportunities with detailed information on each project, including financial projections and risk assessments.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lebanese-navy rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold mb-3">Make Your Investment</h3>
                <p className="text-gray-700">
                  Choose projects that align with your investment goals and complete the secure investment process online.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lebanese-navy rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">4</div>
                <h3 className="text-xl font-bold mb-3">Track & Receive Returns</h3>
                <p className="text-gray-700">
                  Monitor your investments through our dashboard and receive returns based on the terms of each investment.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <Link to="/investments">
                <Button size="lg" className="bg-lebanese-navy hover:bg-opacity-90">Browse Investment Opportunities</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* For Project Owners */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-lebanese-navy">For Project Owners</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-lebanese-green rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold mb-3">Submit Your Project</h3>
                <p className="text-gray-700">
                  Complete our application form with details about your business, funding needs, and growth plans.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lebanese-green rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold mb-3">Verification Process</h3>
                <p className="text-gray-700">
                  Our team reviews your project, verifies information, and may request additional documentation.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lebanese-green rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold mb-3">Project Listing</h3>
                <p className="text-gray-700">
                  Once approved, your project is featured on our platform, visible to our network of investors.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-lebanese-green rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">4</div>
                <h3 className="text-xl font-bold mb-3">Funding & Growth</h3>
                <p className="text-gray-700">
                  Receive funds as investors commit to your project, and use our platform to provide updates on your progress.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <Link to="/list-project">
                <Button size="lg" className="bg-lebanese-green hover:bg-opacity-90">List Your Project</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Investment Types */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-lebanese-navy">Investment Types</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-lebanese-navy">Equity Investments</h3>
                <p className="text-gray-700 mb-4">
                  Purchase ownership stakes in promising Lebanese businesses with growth potential.
                  Benefit from dividend payments and potential value appreciation.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Minimum investment varies by opportunity</li>
                  <li>Longer-term investment horizon</li>
                  <li>Higher risk, higher potential return</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-lebanese-navy">Debt Investments</h3>
                <p className="text-gray-700 mb-4">
                  Lend money to established businesses seeking capital for expansion or operations.
                  Receive regular interest payments with principal returned at maturity.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Fixed interest rates</li>
                  <li>Defined investment term</li>
                  <li>Lower risk, more predictable returns</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-lebanese-navy">Real Estate Projects</h3>
                <p className="text-gray-700 mb-4">
                  Invest in carefully selected Lebanese real estate development projects or income-producing properties.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Tangible asset backing</li>
                  <li>Potential for rental income and capital appreciation</li>
                  <li>Moderate risk profile</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-lebanese-navy">Still Have Questions?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Check out our frequently asked questions or contact our support team for assistance.
            </p>
            <Link to="/faq">
              <Button size="lg" className="bg-lebanese-navy hover:bg-opacity-90">View FAQ</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
