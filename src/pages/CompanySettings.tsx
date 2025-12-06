import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  getCompanyProfile,
  updateCompanyProfile,
  changeCompanyPassword,
  uploadCompanyProfileImage,
  UpdateCompanyProfileRequest,
  ChangePasswordRequest,
  CompanyProfile,
} from "@/api/company";
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

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

const CompanySettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  const [profileForm, setProfileForm] = useState<UpdateCompanyProfileRequest>({
    name: "",
    description: "",
    logo: "",
    sector: undefined,
    location: "",
    foundedYear: undefined,
    teamMembers: [],
    socialMedia: {},
  });

  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const profileData = await getCompanyProfile();

      setProfile(profileData);

      setProfileForm({
        name: profileData.name || "",
        description: profileData.description || "",
        logo: profileData.logo || "",
        sector: profileData.sector || undefined,
        location: profileData.location || "",
        foundedYear: profileData.foundedYear || undefined,
        teamMembers: profileData.teamMembers || [],
        socialMedia: profileData.socialMedia || {},
      });

      if (profileData.logo) {
        setProfileImagePreview(getImageUrl(profileData.logo));
      }
    } catch (error: any) {
      console.error("Failed to load settings:", error);
      toast({
        title: "Error",
        description: "Failed to load your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: keyof UpdateCompanyProfileRequest, value: any) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (field: string, value: string) => {
    setProfileForm((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [field]: value,
      },
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size cannot exceed 5MB.",
          variant: "destructive",
        });
        return;
      }

      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!profileImageFile) return;

    setUploadingImage(true);
    try {
      const imageUrl = await uploadCompanyProfileImage(profileImageFile);
      setProfileForm((prev) => ({ ...prev, logo: imageUrl }));
      setProfile((prev) => (prev ? { ...prev, logo: imageUrl } : null));
      setProfileImageFile(null); // Clear pending file after upload
      
      // Update preview with the server URL
      const fullImageUrl = getImageUrl(imageUrl);
      setProfileImagePreview(fullImageUrl);
      
      toast({
        title: "Success",
        description: "Profile image uploaded successfully!",
      });
    } catch (error: any) {
      console.error("Failed to upload image:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview(null);
    setProfileForm((prev) => ({ ...prev, logo: "" }));
    setProfile((prev) => (prev ? { ...prev, logo: "" } : null));
    toast({
      title: "Image Removed",
      description: "Profile image cleared. Save profile to confirm.",
    });
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Upload image first if a new one was selected
      if (profileImageFile) {
        const imageUrl = await uploadCompanyProfileImage(profileImageFile);
        profileForm.logo = imageUrl;
        setProfileImageFile(null);
      }
      
      const updated = await updateCompanyProfile(profileForm);
      setProfile(updated);
      
      // Update preview with new logo
      if (updated.logo) {
        const fullImageUrl = getImageUrl(updated.logo);
        setProfileImagePreview(fullImageUrl);
      }
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (field: keyof ChangePasswordRequest, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setPasswordErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on change
  };

  const handleSavePassword = async () => {
    let hasError = false;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required.";
      hasError = true;
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required.";
      hasError = true;
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters long.";
      hasError = true;
    }
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Confirmation password is required.";
      hasError = true;
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "New password and confirmation do not match.";
      hasError = true;
    }

    if (hasError) {
      setPasswordErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the password form.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await changeCompanyPassword(passwordForm);
      toast({
        title: "Success",
        description: "Password changed successfully!",
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Failed to change password:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const companySectors = [
    "TECHNOLOGY",
    "REAL_ESTATE",
    "AGRICULTURE",
    "HEALTHCARE",
    "EDUCATION",
    "ENERGY",
    "TOURISM",
    "RETAIL",
    "MANUFACTURING",
    "FINANCIAL_SERVICES",
    "OTHER",
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-lebanese-navy border-t-transparent mx-auto" />
            <p className="text-gray-500">Loading settings...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Settings | Company Profile | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/company-dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-lebanese-navy">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your company profile and account settings</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Company Profile Information</CardTitle>
                  <CardDescription>
                    Update your company information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => handleProfileChange("name", e.target.value)}
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={profileForm.description}
                      onChange={(e) => handleProfileChange("description", e.target.value)}
                      placeholder="Describe your company..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <select
                      id="sector"
                      value={profileForm.sector || ""}
                      onChange={(e) => handleProfileChange("sector", e.target.value || undefined)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a sector</option>
                      {companySectors.map((sector) => (
                        <option key={sector} value={sector}>
                          {sector.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileForm.location || ""}
                        onChange={(e) => handleProfileChange("location", e.target.value)}
                        placeholder="Enter location"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="foundedYear">Founded Year</Label>
                      <Input
                        id="foundedYear"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={profileForm.foundedYear || ""}
                        onChange={(e) => handleProfileChange("foundedYear", e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="e.g., 2020"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profileImage">Profile Image</Label>
                    <div className="flex items-center space-x-4">
                      {profileImagePreview ? (
                        <div className="relative h-24 w-24 rounded-full overflow-hidden">
                          <img
                            src={profileImagePreview}
                            alt="Profile Preview"
                            className="h-full w-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-0 right-0 h-6 w-6 rounded-full"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <ImageIcon className="h-12 w-12" />
                        </div>
                      )}
                      <div className="flex flex-col space-y-2">
                        <Input
                          id="profileImage"
                          type="file"
                          accept="image/jpeg,image/png,image/gif"
                          className="hidden"
                          onChange={handleImageSelect}
                        />
                        <Label
                          htmlFor="profileImage"
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                            ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                            focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
                            bg-lebanese-navy text-primary-foreground hover:bg-lebanese-navy/90 h-10 px-4 py-2 cursor-pointer"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {profileImageFile ? profileImageFile.name : "Choose Image"}
                        </Label>
                        {profileImageFile && (
                          <Button
                            onClick={handleImageUpload}
                            disabled={uploadingImage}
                            className="bg-lebanese-green hover:bg-lebanese-green/90"
                          >
                            {uploadingImage ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="mr-2 h-4 w-4" />
                            )}
                            {uploadingImage ? "Uploading..." : "Upload"}
                          </Button>
                        )}
                        <p className="text-xs text-gray-500">
                          Accepted formats: JPG, PNG, GIF. Max size: 5MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">Social Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={profileForm.socialMedia?.website || ""}
                          onChange={(e) => handleSocialMediaChange("website", e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          type="url"
                          value={profileForm.socialMedia?.linkedin || ""}
                          onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                          placeholder="https://linkedin.com/company/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          type="url"
                          value={profileForm.socialMedia?.facebook || ""}
                          onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                          placeholder="https://facebook.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          type="url"
                          value={profileForm.socialMedia?.twitter || ""}
                          onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                          placeholder="https://twitter.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          type="url"
                          value={profileForm.socialMedia?.instagram || ""}
                          onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-lebanese-navy hover:bg-opacity-90"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                      placeholder="Enter your current password"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                      placeholder="Enter your new password"
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                      placeholder="Confirm your new password"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSavePassword}
                      disabled={saving}
                      className="bg-lebanese-navy hover:bg-opacity-90"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Change Password"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanySettings;

