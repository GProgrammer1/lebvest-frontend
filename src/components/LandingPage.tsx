import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ChartLineIcon,
  CoinIcon,
  ShieldIcon,
  TrendingUpIcon,
} from "./Icons";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Invest in Lebanon's Future
              </h1>
              <p className="text-xl">
                Connect with verified Lebanese investment opportunities and help
                revitalize the local economy while growing your portfolio.
              </p>
              <div className="space-x-4 pt-4">
                <Button
                  size="lg"
                  className="bg-lebanese-green text-white hover:bg-opacity-90"
                  asChild
                >
                  <Link to="/investments">Browse Investments</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white hover:text-lebanese-navy"
                  asChild
                >
                  <Link to="/list-project">List Your Project</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-8 pt-2">
                <div className="flex items-center">
                  <div className="rounded-full bg-white/20 p-2 mr-2">
                    <ShieldIcon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm">Verified Opportunities</p>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full bg-white/20 p-2 mr-2">
                    <CoinIcon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm">Secure Investments</p>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full bg-white/20 p-2 mr-2">
                    <ChartLineIcon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm">AI-Powered Insights</p>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative animate-fade-in">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-lebanese-green rounded-full opacity-20 filter blur-3xl"></div>
              <div className="relative z-10 bg-white rounded-lg p-6 shadow-xl">
                <div className="relative w-full h-64 mb-6 bg-gray-200 rounded overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c"
                    alt="Beirut skyline"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className="bg-lebanese-red text-white text-xs px-2 py-1 rounded">Featured</span>
                    <h3 className="text-white font-semibold mt-1">Beirut Tech Hub</h3>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Real Estate</p>
                    <h3 className="text-lg font-semibold">$2,000,000 Target</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-medium">8.5% Return</p>
                    <p className="text-sm text-gray-500">Low Risk</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-lebanese-green h-2.5 rounded-full" style={{ width: "42%" }}></div>
                </div>
                <div className="flex justify-between text-sm mt-1 mb-4">
                  <p>$850,000 raised</p>
                  <p>42%</p>
                </div>
                <Button className="w-full bg-lebanese-navy hover:bg-opacity-90">View Opportunity</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Categories Section */}
      <section className="py-20 bg-gray-50 cedar-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Diverse Lebanese Investment Opportunities
            </h2>
            <p className="text-xl text-gray-600">
              Discover investment categories tailored to the Lebanese market, each with AI-powered insights to help you make informed decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real Estate */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="h-12 w-12 bg-lebanese-navy/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lebanese-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Real Estate</h3>
              <p className="text-gray-600 mb-4">Commercial and residential properties in key Lebanese locations with stable returns.</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <TrendingUpIcon className="h-4 w-4 mr-1 text-lebanese-green" />
                <span>Avg. Return: 8-12%</span>
                <span className="mx-2">•</span>
                <span>Low-Medium Risk</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/investments">Browse Properties</Link>
              </Button>
            </div>
            
            {/* Tech Startups */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="h-12 w-12 bg-lebanese-green/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lebanese-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Tech Startups</h3>
              <p className="text-gray-600 mb-4">Innovative Lebanese startups disrupting industries with cutting-edge solutions.</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <TrendingUpIcon className="h-4 w-4 mr-1 text-lebanese-red" />
                <span>Avg. Return: 20-30%</span>
                <span className="mx-2">•</span>
                <span>Medium-High Risk</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/investments">Explore Startups</Link>
              </Button>
            </div>
            
            {/* Government Bonds */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="h-12 w-12 bg-lebanese-red/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lebanese-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Government Bonds</h3>
              <p className="text-gray-600 mb-4">Lebanese government bonds that support national infrastructure and development.</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <TrendingUpIcon className="h-4 w-4 mr-1 text-lebanese-navy" />
                <span>Avg. Return: 6-8%</span>
                <span className="mx-2">•</span>
                <span>Medium Risk</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/investments">View Bonds</Link>
              </Button>
            </div>
            
            {/* Agriculture */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="h-12 w-12 bg-lebanese-green/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lebanese-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Agriculture</h3>
              <p className="text-gray-600 mb-4">Sustainable farming projects across Lebanon's fertile regions with export potential.</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <TrendingUpIcon className="h-4 w-4 mr-1 text-lebanese-green" />
                <span>Avg. Return: 10-15%</span>
                <span className="mx-2">•</span>
                <span>Medium Risk</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/investments">Discover Farming</Link>
              </Button>
            </div>
            
            {/* Tourism */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="h-12 w-12 bg-lebanese-navy/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lebanese-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Tourism</h3>
              <p className="text-gray-600 mb-4">Hospitality and tourism ventures in Lebanon's most scenic and historic locations.</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <TrendingUpIcon className="h-4 w-4 mr-1 text-lebanese-red" />
                <span>Avg. Return: 12-18%</span>
                <span className="mx-2">•</span>
                <span>Medium-High Risk</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/investments">Explore Tourism</Link>
              </Button>
            </div>
            
            {/* Education */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="h-12 w-12 bg-lebanese-red/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lebanese-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Education</h3>
              <p className="text-gray-600 mb-4">Educational institutions and EdTech solutions serving the Lebanese population.</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <TrendingUpIcon className="h-4 w-4 mr-1 text-lebanese-navy" />
                <span>Avg. Return: 8-14%</span>
                <span className="mx-2">•</span>
                <span>Low-Medium Risk</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/investments">Find Education</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How LebVest Works
            </h2>
            <p className="text-xl text-gray-600">
              Our platform makes investing in Lebanese opportunities simple, transparent, and secure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-lebanese-navy rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Browse Opportunities</h3>
              <p className="text-gray-600">
                Explore verified Lebanese investment opportunities across different sectors, risk levels, and return rates.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-lebanese-green rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Analyze with AI</h3>
              <p className="text-gray-600">
                Review AI-powered profit predictions and risk assessments tailored to the Lebanese market.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-lebanese-red rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Invest & Track</h3>
              <p className="text-gray-600">
                Invest directly through our secure platform and track your portfolio performance in real-time.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-lebanese-navy hover:bg-opacity-90" asChild>
              <Link to="/investments">Start Investing Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Lebanese Investors & Businesses
            </h2>
            <p className="text-xl text-gray-600">
              Join a community that's revitalizing the Lebanese economy through strategic investments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-500 font-semibold">RM</span>
                </div>
                <div>
                  <h4 className="font-semibold">Rima Makarem</h4>
                  <p className="text-sm text-gray-500">Investor</p>
                </div>
                <div className="ml-auto text-lebanese-green">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600">
                "LebVest has transformed how I invest in my home country. The AI-powered insights helped me identify opportunities I wouldn't have found otherwise."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-500 font-semibold">NK</span>
                </div>
                <div>
                  <h4 className="font-semibold">Nabil Khoury</h4>
                  <p className="text-sm text-gray-500">Business Owner</p>
                </div>
                <div className="ml-auto text-lebanese-green">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600">
                "As a small business owner, raising capital was always challenging. LebVest connected me with investors who believe in Lebanese entrepreneurship."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-500 font-semibold">ZA</span>
                </div>
                <div>
                  <h4 className="font-semibold">Zeina Abou-Dargham</h4>
                  <p className="text-sm text-gray-500">Startup Founder</p>
                </div>
                <div className="ml-auto text-lebanese-green">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600">
                "The platform's verification process gave investors confidence in my tech startup. We raised our seed round in just 3 weeks through LebVest."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 bg-lebanese-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to invest in Lebanon's future?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join LebVest today and be part of the movement revitalizing the Lebanese economy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-lebanese-navy hover:bg-gray-100" asChild>
              <Link to="/investments">Start Investing</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-lebanese-navy" asChild>
              <Link to="/list-project">List Your Project</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
