
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>About | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-lebanese-navy text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About LebVest</h1>
            <p className="text-xl md:text-2xl max-w-3xl">
              Connecting Lebanese investors with opportunities that drive growth and prosperity.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-lebanese-navy">Our Mission</h2>
                <p className="text-lg mb-6">
                  LebVest was founded with a clear vision: to revitalize Lebanon's economy by connecting
                  entrepreneurs with the capital they need to succeed and investors with opportunities
                  that deliver both financial returns and positive social impact.
                </p>
                <p className="text-lg mb-6">
                  We believe that by facilitating strategic investments in Lebanese businesses and projects,
                  we can contribute to economic growth, create jobs, and build a more prosperous future for all.
                </p>
              </div>
              <div className="bg-gray-100 p-8 rounded-lg">
                <blockquote className="text-xl italic">
                  "Our platform is dedicated to unlocking Lebanon's immense potential through
                  strategic investments and partnerships that benefit all stakeholders."
                </blockquote>
                <p className="mt-4 font-medium">— Founder, LebVest</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-lebanese-navy">How LebVest Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-lebanese-navy rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">1</div>
                <h3 className="text-xl font-bold mb-3">Discover Opportunities</h3>
                <p className="text-gray-700">
                  Browse through curated investment opportunities across different sectors in Lebanon,
                  from technology startups to real estate developments.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-lebanese-green rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">2</div>
                <h3 className="text-xl font-bold mb-3">Make Informed Decisions</h3>
                <p className="text-gray-700">
                  Access detailed financial projections, business plans, and risk assessments
                  to evaluate each investment opportunity thoroughly.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-lebanese-navy rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">3</div>
                <h3 className="text-xl font-bold mb-3">Invest & Track</h3>
                <p className="text-gray-700">
                  Invest securely through our platform and monitor your investments
                  with real-time updates and transparent reporting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-lebanese-navy">Our Leadership Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team members */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold">Team Member {i}</h3>
                  <p className="text-gray-600">Position</p>
                  <p className="mt-3 text-gray-700">
                    Brief description of the team member's experience and role in the company.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-lebanese-navy text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to be part of Lebanon's economic revival?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Whether you're an investor looking for opportunities or an entrepreneur seeking funding,
              LebVest is here to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/investments">
                <Button size="lg" className="bg-lebanese-green hover:bg-opacity-90">
                  View Investments
                </Button>
              </Link>
              <Link to="/list-project">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-lebanese-navy">
                  List Your Project
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
