
import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, User, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/api/common/apiClient';
import { ResponsePayload } from '@/lib/types';
import { fetchInvestorProfile } from '@/api/investor';
import { getCompanyProfile } from '@/api/company';

// Helper function to get full image URL
const getImageUrl = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl) return null;
  
  // If it's already a full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Otherwise, prepend the API base URL
  const apiBaseUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:8080';
  return `${apiBaseUrl}/${imageUrl}`;
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [logoError, setLogoError] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (isAuthenticated && role === 'Company') {
        try {
          const profileResponse = await apiClient.get<ResponsePayload>("/companies/me/profile");
          const companyStatus = profileResponse.data?.data?.profile?.status;
          
          // Check if company is approved (step 1) but not fully verified (step 2)
          // Status "APPROVED" means admin approved step 1, but step 2 verification is still needed
          // Status "FULLY_VERIFIED" means both steps are complete
          if (companyStatus === "APPROVED" || companyStatus === "PENDING_DOCS") {
            setNeedsVerification(true);
          } else {
            setNeedsVerification(false);
          }
        } catch (error) {
          console.error("Error checking verification status:", error);
          setNeedsVerification(false);
        }
      } else {
        setNeedsVerification(false);
      }
    };

    checkVerificationStatus();
  }, [isAuthenticated, role]);

  useEffect(() => {
    const loadProfile = async () => {
      if (isAuthenticated) {
        try {
          if (role === 'Investor') {
            const profile = await fetchInvestorProfile();
            if (profile.imageUrl) {
              const fullImageUrl = getImageUrl(profile.imageUrl);
              setProfileImageUrl(fullImageUrl);
            } else {
              setProfileImageUrl(null);
            }
          } else if (role === 'Company') {
            const profile = await getCompanyProfile();
            if (profile.logo) {
              const fullImageUrl = getImageUrl(profile.logo);
              setProfileImageUrl(fullImageUrl);
            } else {
              setProfileImageUrl(null);
            }
          } else {
            setProfileImageUrl(null);
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          setProfileImageUrl(null);
        }
      } else {
        setProfileImageUrl(null);
      }
    };

    loadProfile();
  }, [isAuthenticated, role]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    navigate('/signin');
    window.location.reload(); // Force reload to update auth state
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>, query: string) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/investments?search=${encodeURIComponent(query.trim())}`);
      setSearchQuery('');
      setMobileSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 rounded-md flex items-center justify-center overflow-hidden">
                {logoError ? (
                  <div className="h-full w-full bg-lebanese-navy rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xl">L</span>
                  </div>
                ) : (
                  <img 
                    src="/logo.png" 
                    alt="LebVest Logo" 
                    className="h-full w-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                )}
              </div>
              <span className="ml-2 text-xl font-bold text-lebanese-navy">LebVest</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/investments" className="text-gray-700 hover:text-lebanese-green inline-flex items-center px-1 pt-1 text-sm font-medium">
                Investments
              </Link>
              {isAuthenticated && (
                <>
                  {role === 'Investor' && (
                    <Link to="/dashboard" className="text-gray-700 hover:text-lebanese-green inline-flex items-center px-1 pt-1 text-sm font-medium">
                      Dashboard
                    </Link>
                  )}
                  {role === 'Company' && (
                    <>
                      <Link to="/company-dashboard" className="text-gray-700 hover:text-lebanese-green inline-flex items-center px-1 pt-1 text-sm font-medium">
                        Dashboard
                      </Link>
                      <Link to="/list-project" className="text-gray-700 hover:text-lebanese-green inline-flex items-center px-1 pt-1 text-sm font-medium">
                        List Project
                      </Link>
                      <Link to="/company-settings" className="text-gray-700 hover:text-lebanese-green inline-flex items-center px-1 pt-1 text-sm font-medium">
                        Settings
                      </Link>
                    </>
                  )}
                  {role === 'Admin' && (
                    <Link to="/admin-dashboard" className="text-gray-700 hover:text-lebanese-green inline-flex items-center px-1 pt-1 text-sm font-medium">
                      Dashboard
                    </Link>
                  )}
                </>
              )}
              <Link to="/about" className="text-gray-700 hover:text-lebanese-green inline-flex items-center px-1 pt-1 text-sm font-medium">
                About
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <form 
              onSubmit={(e) => handleSearch(e, searchQuery)}
              className="relative mx-4"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search investments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 pr-4 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-lebanese-green focus:border-lebanese-green border"
              />
            </form>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {needsVerification && (
                  <Button 
                    onClick={() => navigate("/company-verification")}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Verification
                  </Button>
                )}
                {(role === 'Investor' || role === 'Company') && profileImageUrl ? (
                  <div className="flex items-center gap-2">
                    <img 
                      src={profileImageUrl} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                      onError={() => setProfileImageUrl(null)}
                    />
                    <span className="text-sm text-gray-600">{role}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-600">{role}</span>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-lebanese-navy text-lebanese-navy hover:text-lebanese-navy hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline" className="mr-2 border-lebanese-navy text-lebanese-navy hover:text-lebanese-navy hover:bg-gray-100">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-lebanese-navy text-white hover:bg-opacity-90">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          {needsVerification && (
            <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200">
              <Button 
                onClick={() => {
                  navigate("/company-verification");
                  setIsMenuOpen(false);
                }}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Verification
              </Button>
            </div>
          )}
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/investments"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Investments
            </Link>
            {isAuthenticated && (
              <>
                {role === 'Investor' && (
                  <Link
                    to="/dashboard"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                {role === 'Company' && (
                  <>
                    <Link
                      to="/company-dashboard"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/list-project"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      List Project
                    </Link>
                    <Link
                      to="/company-settings"
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </>
                )}
                {role === 'Admin' && (
                  <Link
                    to="/admin-dashboard"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
            <Link
              to="/about"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                {isAuthenticated && role === 'Investor' && profileImageUrl ? (
                  <img 
                    src={profileImageUrl} 
                    alt="Profile" 
                    className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                    onError={() => setProfileImageUrl(null)}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-lebanese-navy flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <div className="ml-3">
                {isAuthenticated ? (
                  <>
                    <div className="text-base font-medium text-gray-800">{role}</div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-sm font-medium text-gray-500 hover:text-gray-800"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                      <div className="text-base font-medium text-gray-800">Sign in</div>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <div className="text-sm font-medium text-gray-500">Register</div>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="mt-3">
              <form 
                onSubmit={(e) => handleSearch(e, mobileSearchQuery)}
                className="relative px-4 py-3"
              >
                <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search investments..."
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  className="pl-10 py-2 pr-4 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-lebanese-green focus:border-lebanese-green border"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
