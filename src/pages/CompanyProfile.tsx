import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronLeft, MessageSquare, Globe, Linkedin, Facebook, Twitter, Instagram } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCompanyProfileById, CompanyProfile } from "@/api/company";
import apiClient from "@/api/common/apiClient";
import { ResponsePayload } from "@/lib/types";

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

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      if (!id) {
        setError("Invalid company ID");
        setLoading(false);
        return;
      }

      try {
        const profile = await getCompanyProfileById(id);
        setCompany(profile);
        setImageError(false);
      } catch (err: any) {
        console.error("Error fetching company profile:", err);
        setError(err.response?.data?.message || "Failed to load company profile");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="text-center">
            <div>Loading company profile...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Company not found</h2>
            <p className="mt-2 text-gray-600">{error || "The requested company profile does not exist."}</p>
            <Link to="/investments">
              <Button className="mt-4 bg-lebanese-navy hover:bg-opacity-90">
                Return to Investments
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{company.name || 'Company'} | Company Profile | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link to="/investments" className="inline-flex items-center text-lebanese-navy hover:text-lebanese-green">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Investments
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left column - Profile details */}
            <div className="w-full lg:w-1/3 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Company Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    {company.logo && !imageError ? (
                      <div className="mr-4 h-16 w-16 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                        <img 
                          src={getImageUrl(company.logo) || ''} 
                          alt={company.name || 'Company'} 
                          className="h-full w-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      </div>
                    ) : (
                      <div className="mr-4 h-16 w-16 rounded-full bg-lebanese-navy/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-8 w-8 text-lebanese-navy" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold">{company.name}</h2>
                      <p className="text-gray-500 text-sm">Company Profile</p>
                    </div>
                  </div>
                  
                  {company.description ? (
                    <div className="mt-4 space-y-1">
                      <p className="text-gray-700">{company.description}</p>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <p className="text-sm text-gray-500 italic">No description available.</p>
                    </div>
                  )}
                  
                  <div className="mt-6 p-4 bg-gray-50 border rounded-md">
                    <h3 className="font-medium mb-2">Contact Information</h3>
                    {company.email ? (
                      <p className="text-gray-700 mb-2">{company.email}</p>
                    ) : (
                      <p className="text-gray-500 text-sm mb-2">Email not available</p>
                    )}
                    <Button className="w-full bg-lebanese-navy hover:bg-opacity-90">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Company Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {company.sector && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Sector</h3>
                        <Badge variant="outline" className="text-sm">
                          {company.sector.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    )}
                    {company.location && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                        <p className="text-sm text-gray-700">{company.location}</p>
                      </div>
                    )}
                    {company.foundedYear && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Founded</h3>
                        <p className="text-sm text-gray-700">{company.foundedYear}</p>
                      </div>
                    )}
                    {company.socialMedia && (
                      <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Social Media</h3>
                        <div className="flex flex-wrap gap-2">
                          {company.socialMedia.website && (
                            <a 
                              href={company.socialMedia.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-lebanese-navy hover:text-lebanese-green"
                            >
                              <Globe className="h-4 w-4" />
                              Website
                            </a>
                          )}
                          {company.socialMedia.linkedin && (
                            <a 
                              href={company.socialMedia.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-lebanese-navy hover:text-lebanese-green"
                            >
                              <Linkedin className="h-4 w-4" />
                              LinkedIn
                            </a>
                          )}
                          {company.socialMedia.facebook && (
                            <a 
                              href={company.socialMedia.facebook} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-lebanese-navy hover:text-lebanese-green"
                            >
                              <Facebook className="h-4 w-4" />
                              Facebook
                            </a>
                          )}
                          {company.socialMedia.twitter && (
                            <a 
                              href={company.socialMedia.twitter} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-lebanese-navy hover:text-lebanese-green"
                            >
                              <Twitter className="h-4 w-4" />
                              Twitter
                            </a>
                          )}
                          {company.socialMedia.instagram && (
                            <a 
                              href={company.socialMedia.instagram} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-lebanese-navy hover:text-lebanese-green"
                            >
                              <Instagram className="h-4 w-4" />
                              Instagram
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - Company information */}
            <div className="w-full lg:w-2/3">
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">About {company.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {company.description ? (
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{company.description}</p>
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-md text-center">
                      <p className="text-gray-500 italic">No description available.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {company.teamMembers && company.teamMembers.length > 0 && (
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company.teamMembers.map((member, index) => (
                        <div key={member.id || index} className="p-4 border rounded-md">
                          <div className="flex items-center gap-3">
                            {member.imageUrl ? (
                              <img 
                                src={getImageUrl(member.imageUrl) || ''} 
                                alt={member.name}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium">{member.name}</h4>
                              <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                          </div>
                          {member.bio && (
                            <p className="mt-2 text-sm text-gray-600">{member.bio}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyProfile;

