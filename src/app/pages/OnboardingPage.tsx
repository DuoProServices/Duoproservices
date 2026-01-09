import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { supabase } from "../utils/supabaseClient";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Progress } from "../components/ui/progress";
import { CheckCircle2, Building2, User, FileText, Users } from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  // Step 1: Basic Info
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;

  // Step 2: Service Category
  serviceCategory: "personal" | "small-business" | "bookkeeping" | "financial-reports" | "";

  // Step 2.5: Filing Type (only if personal)
  filingType: "individual" | "couple" | "";

  // Step 2.5b: Spouse Info (only if couple)
  spouseInfo?: {
    name: string;
    sin: string;
    dateOfBirth: string;
    relationship: "married" | "common-law" | "";
  };

  // Step 3: Tax Return Details (only if personal)
  dateOfBirth: string;
  sin: string;
  maritalStatus: string;
  numberOfDependents: string;
  firstTimeInCanada: string;
  residencyStatus: string;
  incomeType: string;
  workProvince: string;

  // Metadata
  onboardingCompleted: boolean;
}

const CANADIAN_PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "YT", label: "Yukon" },
];

export function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    phone: "",
    email: user?.email || "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    serviceCategory: "",
    filingType: "",
    dateOfBirth: "",
    sin: "",
    maritalStatus: "",
    numberOfDependents: "",
    firstTimeInCanada: "",
    residencyStatus: "",
    incomeType: "",
    workProvince: "",
    onboardingCompleted: false,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    checkExistingProfile();
  }, [user, navigate]);

  const checkExistingProfile = async () => {
    if (!user?.id) return;

    try {
      // Get the current session first
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        console.log("No active session, skipping profile check");
        return;
      }

      // Get user metadata from Supabase Auth
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (data?.user?.user_metadata?.profile) {
        const profile = data.user.user_metadata.profile;
        if (profile.onboardingCompleted) {
          navigate("/dashboard");
        } else {
          setProfileData(profile);
        }
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  const updateField = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const { name, phone, address, city, province, postalCode } = profileData;
    if (!name || !phone || !address || !city || !province || !postalCode) {
      toast.error(t("onboarding.fillAllFields"));
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { serviceCategory } = profileData;
    if (!serviceCategory) {
      toast.error(t("onboarding.selectServiceCategory"));
      return false;
    }
    return true;
  };

  const validateStep2_5 = () => {
    const { filingType } = profileData;
    if (!filingType) {
      toast.error(t("onboarding.selectFilingType"));
      return false;
    }
    return true;
  };

  const validateStep2_5b = () => {
    const { spouseInfo } = profileData;
    if (!spouseInfo) return true; // If not a couple, skip validation
    const { name, sin, dateOfBirth, relationship } = spouseInfo;
    if (!name || !sin || !dateOfBirth || !relationship) {
      toast.error(t("onboarding.fillAllFields"));
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const { dateOfBirth, sin, maritalStatus, firstTimeInCanada, residencyStatus, incomeType, workProvince } =
      profileData;
    if (!dateOfBirth || !sin || !maritalStatus || !firstTimeInCanada || !residencyStatus || !incomeType || !workProvince) {
      toast.error(t("onboarding.fillAllFields"));
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    // If business or consulting, skip personal tax steps
    if (currentStep === 2) {
      if (profileData.serviceCategory === "small-business" || profileData.serviceCategory === "bookkeeping" || profileData.serviceCategory === "financial-reports") {
        await saveProfile(true);
        return;
      }
      // If personal, go to filing type selection
      if (profileData.serviceCategory === "personal") {
        setCurrentStep(2.5);
        return;
      }
    }

    if (currentStep === 2.5) {
      if (!validateStep2_5()) return;
      
      // If couple and spouse info not filled, stay on this step to show spouse form
      if (profileData.filingType === "couple") {
        if (!validateStep2_5b()) return;
      }
      
      // Move to step 3
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!validateStep3()) return;
      await saveProfile(true);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 3) {
      setCurrentStep(2.5);
      return;
    }
    if (currentStep === 2.5) {
      setCurrentStep(2);
      return;
    }
    setCurrentStep((prev) => prev - 1);
  };

  const saveProfile = async (completed: boolean = false) => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Verify session exists first
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session) {
        console.error("No active session:", sessionError);
        toast.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      const finalProfile = {
        ...profileData,
        onboardingCompleted: completed,
        updatedAt: new Date().toISOString(),
      };

      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: {
          profile: finalProfile,
        },
      });

      if (error) throw error;

      if (completed) {
        toast.success(t("onboarding.profileCompleted"));
        navigate("/onboarding-success");
      } else {
        toast.success(t("onboarding.progressSaved"));
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || t("onboarding.saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = profileData.serviceCategory === "small-business" || profileData.serviceCategory === "bookkeeping" || profileData.serviceCategory === "financial-reports" ? 2 : 3;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">{t("onboarding.title")}</h1>
          <p className="text-gray-600">{t("onboarding.subtitle")}</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              {t("onboarding.step")} {currentStep} {t("onboarding.of")} {totalSteps}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl">{t("onboarding.step1Title")}</h2>
                <p className="text-sm text-gray-600">{t("onboarding.step1Desc")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">{t("onboarding.fullName")} *</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder={t("onboarding.fullNamePlaceholder")}
                />
              </div>

              <div>
                <Label htmlFor="phone">{t("onboarding.phone")} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="email">{t("onboarding.email")}</Label>
                <Input id="email" type="email" value={profileData.email} disabled className="bg-gray-50" />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">{t("onboarding.address")} *</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder={t("onboarding.addressPlaceholder")}
                />
              </div>

              <div>
                <Label htmlFor="city">{t("onboarding.city")} *</Label>
                <Input
                  id="city"
                  value={profileData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder={t("onboarding.cityPlaceholder")}
                />
              </div>

              <div>
                <Label htmlFor="province">{t("onboarding.province")} *</Label>
                <Select value={profileData.province} onValueChange={(value) => updateField("province", value)}>
                  <SelectTrigger id="province">
                    <SelectValue placeholder={t("onboarding.selectProvince")} />
                  </SelectTrigger>
                  <SelectContent>
                    {CANADIAN_PROVINCES.map((prov) => (
                      <SelectItem key={prov.value} value={prov.value}>
                        {prov.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="postalCode">{t("onboarding.postalCode")} *</Label>
                <Input
                  id="postalCode"
                  value={profileData.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value.toUpperCase())}
                  placeholder="A1A 1A1"
                  maxLength={7}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Service Type */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl">{t("onboarding.step2Title")}</h2>
                <p className="text-sm text-gray-600">{t("onboarding.step2Desc")}</p>
              </div>
            </div>

            {/* Service Category */}
            <div>
              <Label className="mb-3 block">{t("onboarding.serviceCategory")} *</Label>
              <RadioGroup
                value={profileData.serviceCategory}
                onValueChange={(value) => {
                  updateField("serviceCategory", value);
                }}
              >
                <div className="space-y-3">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      profileData.serviceCategory === "personal" ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      updateField("serviceCategory", "personal");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="personal" id="personal" />
                      <div className="flex items-center gap-3 flex-1">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <Label htmlFor="personal" className="cursor-pointer font-medium">
                            {t("onboarding.personal")}
                          </Label>
                          <p className="text-sm text-gray-600">{t("onboarding.personalDesc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      profileData.serviceCategory === "small-business" ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      updateField("serviceCategory", "small-business");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="small-business" id="small-business" />
                      <div className="flex items-center gap-3 flex-1">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <div>
                          <Label htmlFor="small-business" className="cursor-pointer font-medium">
                            {t("onboarding.smallBusiness")}
                          </Label>
                          <p className="text-sm text-gray-600">{t("onboarding.smallBusinessDesc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      profileData.serviceCategory === "bookkeeping" ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      updateField("serviceCategory", "bookkeeping");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="bookkeeping" id="bookkeeping" />
                      <div className="flex items-center gap-3 flex-1">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <div>
                          <Label htmlFor="bookkeeping" className="cursor-pointer font-medium">
                            {t("onboarding.bookkeeping")}
                          </Label>
                          <p className="text-sm text-gray-600">{t("onboarding.bookkeepingDesc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      profileData.serviceCategory === "financial-reports" ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      updateField("serviceCategory", "financial-reports");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="financial-reports" id="financial-reports" />
                      <div className="flex items-center gap-3 flex-1">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <div>
                          <Label htmlFor="financial-reports" className="cursor-pointer font-medium">
                            {t("onboarding.financialReports")}
                          </Label>
                          <p className="text-sm text-gray-600">{t("onboarding.financialReportsDesc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Step 2.5: Filing Type */}
        {currentStep === 2.5 && profileData.serviceCategory === "personal" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl">{t("onboarding.step2_5Title")}</h2>
                <p className="text-sm text-gray-600">{t("onboarding.step2_5Desc")}</p>
              </div>
            </div>

            {/* Filing Type */}
            <div>
              <Label className="mb-3 block">{t("onboarding.filingType")} *</Label>
              <RadioGroup
                value={profileData.filingType}
                onValueChange={(value) => {
                  updateField("filingType", value);
                }}
              >
                <div className="space-y-3">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      profileData.filingType === "individual" ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      updateField("filingType", "individual");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="individual" id="individual" />
                      <div className="flex items-center gap-3 flex-1">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <Label htmlFor="individual" className="cursor-pointer font-medium">
                            {t("onboarding.individual")}
                          </Label>
                          <p className="text-sm text-gray-600">{t("onboarding.individualDesc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      profileData.filingType === "couple" ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      updateField("filingType", "couple");
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="couple" id="couple" />
                      <div className="flex items-center gap-3 flex-1">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                          <Label htmlFor="couple" className="cursor-pointer font-medium">
                            {t("onboarding.couple")}
                          </Label>
                          <p className="text-sm text-gray-600">{t("onboarding.coupleDesc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Step 2.5b: Spouse Info */}
        {currentStep === 2.5 && profileData.filingType === "couple" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl">{t("onboarding.step2_5bTitle")}</h2>
                <p className="text-sm text-gray-600">{t("onboarding.step2_5bDesc")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Spouse Information */}
              <div className="md:col-span-2">
                <h3 className="font-medium mb-3">{t("onboarding.spouseInfo")}</h3>
              </div>

              <div>
                <Label htmlFor="spouseName">{t("onboarding.spouseName")} *</Label>
                <Input
                  id="spouseName"
                  value={profileData.spouseInfo?.name || ""}
                  onChange={(e) => updateField("spouseInfo", { ...profileData.spouseInfo, name: e.target.value })}
                  placeholder={t("onboarding.fullNamePlaceholder")}
                />
              </div>

              <div>
                <Label htmlFor="spouseSin">{t("onboarding.spouseSin")} *</Label>
                <Input
                  id="spouseSin"
                  value={profileData.spouseInfo?.sin || ""}
                  onChange={(e) => updateField("spouseInfo", { ...profileData.spouseInfo, sin: e.target.value.replace(/\D/g, "") })}
                  placeholder="123 456 789"
                  maxLength={9}
                />
              </div>

              <div>
                <Label htmlFor="spouseDateOfBirth">{t("onboarding.spouseDateOfBirth")} *</Label>
                <Input
                  id="spouseDateOfBirth"
                  type="date"
                  value={profileData.spouseInfo?.dateOfBirth || ""}
                  onChange={(e) => updateField("spouseInfo", { ...profileData.spouseInfo, dateOfBirth: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="spouseRelationship">{t("onboarding.spouseRelationship")} *</Label>
                <Select
                  value={profileData.spouseInfo?.relationship || ""}
                  onValueChange={(value) => updateField("spouseInfo", { ...profileData.spouseInfo, relationship: value })}
                >
                  <SelectTrigger id="spouseRelationship">
                    <SelectValue placeholder={t("onboarding.selectRelationship")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="married">{t("onboarding.married")}</SelectItem>
                    <SelectItem value="common-law">{t("onboarding.commonLaw")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Tax Return Details */}
        {currentStep === 3 && profileData.serviceCategory === "personal" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl">{t("onboarding.step3Title")}</h2>
                <p className="text-sm text-gray-600">{t("onboarding.step3Desc")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="md:col-span-2">
                <h3 className="font-medium mb-3">{t("onboarding.personalInfo")}</h3>
              </div>

              <div>
                <Label htmlFor="dateOfBirth">{t("onboarding.dateOfBirth")} *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="sin">{t("onboarding.sin")} *</Label>
                <Input
                  id="sin"
                  value={profileData.sin}
                  onChange={(e) => updateField("sin", e.target.value.replace(/\D/g, ""))}
                  placeholder="123 456 789"
                  maxLength={9}
                />
              </div>

              {/* Status Information */}
              <div className="md:col-span-2 pt-4 border-t">
                <h3 className="font-medium mb-3">{t("onboarding.statusInfo")}</h3>
              </div>

              <div>
                <Label htmlFor="maritalStatus">{t("onboarding.maritalStatus")} *</Label>
                <Select value={profileData.maritalStatus} onValueChange={(value) => updateField("maritalStatus", value)}>
                  <SelectTrigger id="maritalStatus">
                    <SelectValue placeholder={t("onboarding.selectMaritalStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">{t("onboarding.single")}</SelectItem>
                    <SelectItem value="married">{t("onboarding.married")}</SelectItem>
                    <SelectItem value="commonlaw">{t("onboarding.commonLaw")}</SelectItem>
                    <SelectItem value="divorced">{t("onboarding.divorced")}</SelectItem>
                    <SelectItem value="widowed">{t("onboarding.widowed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="numberOfDependents">{t("onboarding.numberOfDependents")} *</Label>
                <Input
                  id="numberOfDependents"
                  type="number"
                  min="0"
                  value={profileData.numberOfDependents}
                  onChange={(e) => updateField("numberOfDependents", e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="firstTimeInCanada">{t("onboarding.firstTimeInCanada")} *</Label>
                <Select
                  value={profileData.firstTimeInCanada}
                  onValueChange={(value) => updateField("firstTimeInCanada", value)}
                >
                  <SelectTrigger id="firstTimeInCanada">
                    <SelectValue placeholder={t("onboarding.selectYesNo")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">{t("onboarding.yes")}</SelectItem>
                    <SelectItem value="no">{t("onboarding.no")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="residencyStatus">{t("onboarding.residencyStatus")} *</Label>
                <Select
                  value={profileData.residencyStatus}
                  onValueChange={(value) => updateField("residencyStatus", value)}
                >
                  <SelectTrigger id="residencyStatus">
                    <SelectValue placeholder={t("onboarding.selectResidencyStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resident">{t("onboarding.resident")}</SelectItem>
                    <SelectItem value="non-resident">{t("onboarding.nonResident")}</SelectItem>
                    <SelectItem value="deemed-resident">{t("onboarding.deemedResident")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Employment/Income Information */}
              <div className="md:col-span-2 pt-4 border-t">
                <h3 className="font-medium mb-3">{t("onboarding.incomeInfo")}</h3>
              </div>

              <div>
                <Label htmlFor="incomeType">{t("onboarding.incomeType")} *</Label>
                <Select value={profileData.incomeType} onValueChange={(value) => updateField("incomeType", value)}>
                  <SelectTrigger id="incomeType">
                    <SelectValue placeholder={t("onboarding.selectIncomeType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employment">{t("onboarding.employment")}</SelectItem>
                    <SelectItem value="self-employed">{t("onboarding.selfEmployed")}</SelectItem>
                    <SelectItem value="both">{t("onboarding.both")}</SelectItem>
                    <SelectItem value="other">{t("onboarding.other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="workProvince">{t("onboarding.workProvince")} *</Label>
                <Select value={profileData.workProvince} onValueChange={(value) => updateField("workProvince", value)}>
                  <SelectTrigger id="workProvince">
                    <SelectValue placeholder={t("onboarding.selectProvince")} />
                  </SelectTrigger>
                  <SelectContent>
                    {CANADIAN_PROVINCES.map((prov) => (
                      <SelectItem key={prov.value} value={prov.value}>
                        {prov.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack} disabled={loading} className="flex-1">
              {t("onboarding.back")}
            </Button>
          )}
          <Button onClick={handleNext} disabled={loading} className="flex-1">
            {loading
              ? t("onboarding.saving")
              : currentStep === totalSteps
              ? t("onboarding.complete")
              : t("onboarding.continue")}
          </Button>
        </div>

        {/* Save Progress */}
        {currentStep > 1 && (
          <div className="text-center mt-4">
            <button
              onClick={() => saveProfile(false)}
              disabled={loading}
              className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            >
              {t("onboarding.saveProgress")}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}