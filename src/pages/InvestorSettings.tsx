import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  fetchInvestorProfile,
  updateInvestorProfile,
  fetchInvestorPreferences,
  updateInvestorPreferences,
  changePassword,
  uploadProfileImage,
  InvestorProfileDto,
  InvestorPreferenceDto,
  UpdateInvestorProfileRequest,
  UpdateInvestorPreferenceRequest,
  ChangePasswordRequest,
} from "@/api/investor";
import {
  InvestmentCategory,
  RiskLevel,
  Location as EnumLocation,
} from "@/lib/types";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

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

const InvestorSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState<InvestorProfileDto | null>(null);
  const [preferences, setPreferences] = useState<InvestorPreferenceDto | null>(null);

  const [profileForm, setProfileForm] = useState<UpdateInvestorProfileRequest>({
    name: "",
    email: "",
    bio: "",
    imageUrl: "",
    profilePublic: false,
  });

  const [preferencesForm, setPreferencesForm] = useState<UpdateInvestorPreferenceRequest>({
    categories: [],
    riskLevels: [],
    locations: [],
  });

  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, preferencesData] = await Promise.all([
        fetchInvestorProfile(),
        fetchInvestorPreferences(),
      ]);

      setProfile(profileData);
      setPreferences(preferencesData);

      setProfileForm({
        name: profileData.name || "",
        email: profileData.email || "",
        bio: profileData.bio || "",
        imageUrl: profileData.imageUrl || "",
        profilePublic: profileData.profilePublic ?? false,
      });

      // Set image preview if imageUrl exists
      if (profileData.imageUrl) {
        const fullImageUrl = getImageUrl(profileData.imageUrl);
        setProfileImagePreview(fullImageUrl);
      }

      // Convert backend lowercase strings to frontend enum format
      // Backend returns lowercase like "real_estate", "low", "beirut"
      // Frontend uses display names like "Real Estate", "Low", "Beirut"
      const categoryMap: Record<string, InvestmentCategory> = {
        "real_estate": "Real Estate",
        "government_bonds": "Government Bonds",
        "startup": "Startup",
        "personal_project": "Personal Project",
        "sme": "Sme",
        "agriculture": "Agriculture",
        "technology": "Technology",
        "education": "Education",
        "healthcare": "Healthcare",
        "energy": "Energy",
        "tourism": "Tourism",
        "retail": "Retail",
      };

      const riskLevelMap: Record<string, RiskLevel> = {
        "low": "Low",
        "medium": "Medium",
        "high": "High",
      };

      const locationMap: Record<string, EnumLocation> = {
        "beirut": "Beirut",
        "mount_lebanon": "Mount Lebanon",
        "north": "North",
        "south": "South",
        "bekaa": "Bekaa",
        "nabatieh": "Nabatieh",
        "baalbek_hermel": "Baalbek Hermel",
        "akkar": "Akkar",
      };

      setPreferencesForm({
        categories: preferencesData.categories
          .map((c) => categoryMap[c.toLowerCase()])
          .filter((c): c is InvestmentCategory => c !== undefined),
        riskLevels: preferencesData.riskLevels
          .map((r) => riskLevelMap[r.toLowerCase()])
          .filter((r): r is RiskLevel => r !== undefined),
        locations: preferencesData.locations
          .map((l) => locationMap[l.toLowerCase()])
          .filter((l): l is EnumLocation => l !== undefined),
      });
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

  const handleProfileChange = (field: keyof UpdateInvestorProfileRequest, value: string | boolean) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
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
          description: "Image size must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setProfileImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImageFile) return;

    try {
      setUploadingImage(true);
      const imageUrl = await uploadProfileImage(profileImageFile);
      setProfileForm((prev) => ({ ...prev, imageUrl }));
      setProfileImageFile(null);
      
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
    setProfileForm((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Upload image first if a new one was selected
      if (profileImageFile) {
        const imageUrl = await uploadProfileImage(profileImageFile);
        profileForm.imageUrl = imageUrl;
        setProfileImageFile(null);
      }
      
      const updated = await updateInvestorProfile(profileForm);
      setProfile(updated);
      
      // Update preview with new imageUrl
      if (updated.imageUrl) {
        const fullImageUrl = getImageUrl(updated.imageUrl);
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

  const handlePreferenceToggle = (
    type: "categories" | "riskLevels" | "locations",
    value: InvestmentCategory | RiskLevel | EnumLocation
  ) => {
    setPreferencesForm((prev) => {
      const current = prev[type] as any[];
      const isSelected = current.includes(value);
      return {
        ...prev,
        [type]: isSelected
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      // Convert frontend display names to backend enum names (uppercase with underscores)
      // Backend expects enum names like "REAL_ESTATE", "LOW", "BEIRUT"
      const categoryToEnum: Record<InvestmentCategory, string> = {
        "Real Estate": "REAL_ESTATE",
        "Government Bonds": "GOVERNMENT_BONDS",
        "Startup": "STARTUP",
        "Personal Project": "PERSONAL_PROJECT",
        "Sme": "SME",
        "Agriculture": "AGRICULTURE",
        "Technology": "TECHNOLOGY",
        "Education": "EDUCATION",
        "Healthcare": "HEALTHCARE",
        "Energy": "ENERGY",
        "Tourism": "TOURISM",
        "Retail": "RETAIL",
      };

      const riskLevelToEnum: Record<RiskLevel, string> = {
        "Low": "LOW",
        "Medium": "MEDIUM",
        "High": "HIGH",
      };

      const locationToEnum: Record<EnumLocation, string> = {
        "Beirut": "BEIRUT",
        "Mount Lebanon": "MOUNT_LEBANON",
        "North": "NORTH",
        "South": "SOUTH",
        "Bekaa": "BEKAA",
        "Nabatieh": "NABATIEH",
        "Baalbek Hermel": "BAALBEK_HERMEL",
        "Akkar": "AKKAR",
      };

      const request: UpdateInvestorPreferenceRequest = {
        categories: preferencesForm.categories.map((c) => categoryToEnum[c]),
        riskLevels: preferencesForm.riskLevels.map((r) => riskLevelToEnum[r]),
        locations: preferencesForm.locations.map((l) => locationToEnum[l]),
      };

      const updated = await updateInvestorPreferences(request);
      setPreferences(updated);
      toast({
        title: "Success",
        description: "Preferences updated successfully!",
      });
    } catch (error: any) {
      console.error("Failed to update preferences:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (field: keyof ChangePasswordRequest, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirmation password do not match.",
        variant: "destructive",
      });
      return;
    }

    // Validate password length
    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      await changePassword(passwordForm);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({
        title: "Success",
        description: "Password changed successfully!",
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

  const investmentCategories: InvestmentCategory[] = [
    "Real Estate",
    "Government Bonds",
    "Startup",
    "Personal Project",
    "Sme",
    "Agriculture",
    "Technology",
    "Education",
    "Healthcare",
    "Energy",
    "Tourism",
    "Retail",
  ];

  const riskLevels: RiskLevel[] = ["Low", "Medium", "High"];

  const locations: EnumLocation[] = [
    "Beirut",
    "Mount Lebanon",
    "North",
    "South",
    "Bekaa",
    "Nabatieh",
    "Baalbek Hermel",
    "Akkar",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Settings | Investor Profile | LebVest</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-lebanese-navy">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your profile, password, and investment preferences</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => handleProfileChange("name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => handleProfileChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profileImage">Profile Image</Label>
                    <div className="flex flex-col gap-4">
                      {profileImagePreview && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={profileImagePreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <Label
                          htmlFor="profileImage"
                          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {profileImageFile ? profileImageFile.name : "Choose Image"}
                        </Label>
                        {profileImageFile && (
                          <Button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={uploadingImage}
                            className="bg-lebanese-green hover:bg-lebanese-green/90 text-white"
                          >
                            {uploadingImage ? "Uploading..." : "Upload"}
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Accepted formats: JPG, PNG, GIF. Max size: 5MB
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="profilePublic"
                        checked={profileForm.profilePublic || false}
                        onCheckedChange={(checked) => 
                          handleProfileChange("profilePublic", checked as boolean)
                        }
                      />
                      <Label htmlFor="profilePublic" className="text-sm font-medium cursor-pointer">
                        Make my profile public
                      </Label>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">
                      When public, companies can view your portfolio summary, bio, and investment details. 
                      Your contact information (email) is always visible regardless of this setting.
                    </p>
                  </div>

                  {profile && (
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-500">Portfolio Value</p>
                        <p className="text-lg font-semibold">
                          ${profile.portfolioValue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Invested</p>
                        <p className="text-lg font-semibold">
                          ${profile.totalInvested.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Returns</p>
                        <p className="text-lg font-semibold text-green-600">
                          ${profile.totalReturns.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-lebanese-navy hover:bg-lebanese-navy/90 text-white"
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
                    Update your password to keep your account secure
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                      placeholder="Enter your new password (min. 8 characters)"
                    />
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters long
                    </p>
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
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleChangePassword}
                      disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                      className="bg-lebanese-navy hover:bg-lebanese-navy/90 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Preferences</CardTitle>
                  <CardDescription>
                    Customize your investment preferences to receive personalized recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Investment Categories</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      Select all categories you're interested in
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {investmentCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={preferencesForm.categories.includes(category)}
                            onCheckedChange={() =>
                              handlePreferenceToggle("categories", category)
                            }
                          />
                          <Label
                            htmlFor={`category-${category}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Risk Levels</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      Select all risk levels you're comfortable with
                    </p>
                    <div className="flex gap-4">
                      {riskLevels.map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={`risk-${level}`}
                            checked={preferencesForm.riskLevels.includes(level)}
                            onCheckedChange={() =>
                              handlePreferenceToggle("riskLevels", level)
                            }
                          />
                          <Label
                            htmlFor={`risk-${level}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Preferred Locations</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      Select all locations you're interested in
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {locations.map((location) => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox
                            id={`location-${location}`}
                            checked={preferencesForm.locations.includes(location)}
                            onCheckedChange={() =>
                              handlePreferenceToggle("locations", location)
                            }
                          />
                          <Label
                            htmlFor={`location-${location}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {location}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSavePreferences}
                      disabled={saving}
                      className="bg-lebanese-navy hover:bg-lebanese-navy/90 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Preferences"}
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

export default InvestorSettings;

