import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { TaxDeadlines } from "../components/client/TaxDeadlines";
import { MessageCenter } from "../components/client/MessageCenter";
import { PaymentTimeline } from "../components/client/PaymentTimeline";
import { LogOut, User, Mail, Phone, MapPin, Calendar, CreditCard, Users, Home, Briefcase, Edit, FileText, Clock, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { supabase } from "../utils/supabaseClient";
import { toast } from "sonner";
import { isAdminEmail } from "../config/admins";
import { fixUserTaxFilings } from "../utils/fixCorruptedTaxFilings";

interface ProfileData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  serviceCategory: "personal" | "small-business" | "bookkeeping" | "financial-reports" | "";
  dateOfBirth?: string;
  sin?: string;
  maritalStatus?: string;
  numberOfDependents?: string;
  firstTimeInCanada?: string;
  residencyStatus?: string;
  incomeType?: string;
  workProvince?: string;
  onboardingCompleted: boolean;
}

interface TaxFiling {
  year: number;
  status: "not-started" | "in-progress" | "under-review" | "completed" | "filed";
  createdAt: string;
  updatedAt: string;
  documents?: string[];
}

const getStatusConfig = (status: TaxFiling["status"]) => {
  switch (status) {
    case "not-started":
      return {
        label: "Not Started",
        color: "bg-gray-100 text-gray-700 border-gray-300",
        icon: AlertCircle,
        iconColor: "text-gray-500"
      };
    case "in-progress":
      return {
        label: "In Progress",
        color: "bg-blue-100 text-blue-700 border-blue-300",
        icon: Clock,
        iconColor: "text-blue-500"
      };
    case "under-review":
      return {
        label: "Under Review",
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
        icon: Clock,
        iconColor: "text-yellow-500"
      };
    case "completed":
      return {
        label: "Completed",
        color: "bg-green-100 text-green-700 border-green-300",
        icon: CheckCircle,
        iconColor: "text-green-500"
      };
    case "filed":
      return {
        label: "Filed with CRA",
        color: "bg-purple-100 text-purple-700 border-purple-300",
        icon: CheckCircle,
        iconColor: "text-purple-500"
      };
  }
};

export function SimpleDashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [taxFiling, setTaxFiling] = useState<TaxFiling | null>(null);

  // Load tax filings from Supabase
  const [taxFilings, setTaxFilings] = useState<TaxFiling[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      // If user hasn't completed onboarding, redirect
      if (!data?.user?.user_metadata?.profile?.onboardingCompleted) {
        navigate("/onboarding");
        return;
      }

      setProfile(data.user.user_metadata.profile);
      
      // Load tax filings from user_metadata
      const taxFilingsData: any[] = data.user.user_metadata.taxFilings || [];
      
      console.log('📊 Raw tax filings data:', taxFilingsData);
      
      // AUTO-FIX corrupted tax filings before validation
      let needsUpdate = false;
      const fixedFilings = taxFilingsData.map((filing: any) => {
        // Check if year is an object (corrupted)
        if (filing && typeof filing === 'object' && typeof filing.year === 'object' && filing.year !== null) {
          console.warn('🔧 AUTO-FIXING corrupted filing:', filing);
          needsUpdate = true;
          
          // Extract the actual year from the nested object
          const actualYear = filing.year.year;
          
          if (typeof actualYear === 'number') {
            const fixed = {
              ...filing,
              year: actualYear, // Extract the number
            };
            
            // If pricingPresetId was in the nested year object, preserve it in payment
            if (filing.year.pricingPresetId && !filing.payment) {
              fixed.payment = {
                status: 'pending',
                amount: 0,
                currency: 'CAD',
                pricingPresetId: filing.year.pricingPresetId,
                createdAt: filing.createdAt
              };
            }
            
            console.log('✅ Fixed filing:', fixed);
            return fixed;
          } else {
            console.error('❌ Cannot extract year from:', filing.year);
            return null; // Mark for removal
          }
        }
        
        return filing;
      }).filter(Boolean); // Remove nulls
      
      // If we auto-fixed anything, save it back to Supabase
      if (needsUpdate) {
        console.log('💾 Saving auto-fixed tax filings to Supabase...');
        try {
          await supabase.auth.updateUser({
            data: { 
              ...data.user.user_metadata,
              taxFilings: fixedFilings 
            }
          });
          console.log('✅ Auto-fix completed and saved!');
          toast.success('Tax filings data has been automatically corrected');
        } catch (updateError) {
          console.error('❌ Failed to save auto-fix:', updateError);
          toast.error('Failed to save corrected data');
        }
      }
      
      // NOW validate the fixed filings
      const validFilings = fixedFilings.filter((filing: any) => {
        // Check if filing has the minimum required structure
        if (!filing || typeof filing !== 'object') {
          console.warn('⚠️ Invalid filing (not an object):', filing);
          return false;
        }
        
        if (!filing.year || typeof filing.year !== 'number') {
          console.warn('⚠️ Invalid filing (missing or invalid year):', filing);
          return false;
        }
        
        if (!filing.status || typeof filing.status !== 'string') {
          console.warn('⚠️ Invalid filing (missing or invalid status):', filing);
          return false;
        }
        
        // Check if it's ONLY pricingPresetId and year (corrupted data)
        const keys = Object.keys(filing);
        if (keys.length === 2 && keys.includes('pricingPresetId') && keys.includes('year')) {
          console.warn('⚠️ Corrupted filing detected (only pricingPresetId and year):', filing);
          return false;
        }
        
        return true;
      });
      
      console.log('✅ Valid filings after auto-fix and filtering:', validFilings);
      
      // If no valid tax filings exist, create default ones for 2025 and 2026
      if (validFilings.length === 0) {
        const defaultFilings: TaxFiling[] = [
          {
            year: 2025,
            status: "in-progress",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            year: 2026,
            status: "not-started",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        console.log('📝 Creating default filings:', defaultFilings);
        
        // Save default filings to Supabase
        await supabase.auth.updateUser({
          data: { taxFilings: defaultFilings }
        });
        
        setTaxFilings(defaultFilings);
      } else {
        // Sort by year descending (newest first)
        validFilings.sort((a, b) => b.year - a.year);
        setTaxFilings(validFilings);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleEdit = () => {
    navigate("/onboarding");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="font-medium">{profile?.name || user?.name || "Client Portal"}</h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isAdminEmail(user?.email) && (
              <Button onClick={() => navigate("/admin")} variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            )}
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl mb-2">Welcome, {profile?.name?.split(' ')[0]}! 👋</h2>
              <p className="text-gray-600 mb-4">
                Your profile is complete. We'll be in touch soon with next steps.
              </p>
              <div className="flex gap-2">
                <Badge variant="default" className="bg-green-600">
                  Profile Complete
                </Badge>
                <Badge variant="outline">
                  {profile?.serviceCategory === "personal" 
                    ? "Personal Tax" 
                    : profile?.serviceCategory === "small-business"
                    ? "Small Business"
                    : profile?.serviceCategory === "bookkeeping"
                    ? "Bookkeeping"
                    : "Financial Reports"}
                </Badge>
              </div>
            </div>
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-lg">Personal Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{profile?.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{profile?.phone}</p>
                </div>
              </div>

              {profile?.dateOfBirth && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">
                      {new Date(profile.dateOfBirth).toLocaleDateString('en-CA', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              )}

              {profile?.sin && (
                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">SIN</p>
                    <p className="font-medium">•••-•••-{profile.sin.slice(-3)}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Address */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <Home className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-lg">Address</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Street Address</p>
                  <p className="font-medium">{profile?.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium">{profile?.city}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Province</p>
                    <p className="font-medium">{profile?.province}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Postal Code</p>
                    <p className="font-medium">{profile?.postalCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tax Information (if taxReturn) */}
          {profile?.serviceCategory === "personal" && (
            <>
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-lg">Family Status</h3>
                </div>
                
                <div className="space-y-4">
                  {profile?.maritalStatus && (
                    <div className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Marital Status</p>
                        <p className="font-medium capitalize">{profile.maritalStatus}</p>
                      </div>
                    </div>
                  )}

                  {profile?.numberOfDependents !== undefined && (
                    <div className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Number of Dependents</p>
                        <p className="font-medium">{profile.numberOfDependents}</p>
                      </div>
                    </div>
                  )}

                  {profile?.residencyStatus && (
                    <div className="flex items-start gap-3">
                      <Home className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Residency Status</p>
                        <p className="font-medium capitalize">{profile.residencyStatus.replace('-', ' ')}</p>
                      </div>
                    </div>
                  )}

                  {profile?.firstTimeInCanada && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">First Time Filing in Canada</p>
                        <p className="font-medium capitalize">{profile.firstTimeInCanada}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-lg">Employment Information</h3>
                </div>
                
                <div className="space-y-4">
                  {profile?.incomeType && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Income Type</p>
                        <p className="font-medium capitalize">{profile.incomeType.replace('-', ' ')}</p>
                      </div>
                    </div>
                  )}

                  {profile?.workProvince && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Work Province</p>
                        <p className="font-medium">{profile.workProvince}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Tax Deadlines & Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Tax Deadlines */}
          <TaxDeadlines 
            isQuebec={
              profile?.province?.toLowerCase().includes('quebec') || 
              profile?.province?.toLowerCase().includes('québec') ||
              profile?.workProvince?.toLowerCase().includes('quebec') ||
              profile?.workProvince?.toLowerCase().includes('québec')
            } 
          />

          {/* Message Center */}
          <MessageCenter clientId={user?.id || ''} />
        </div>

        {/* Tax Filings Section */}
        <Card className="p-6 mt-6">
          <div className="flex items-center justify-between mb-6 pb-3 border-b">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-lg">Tax Filings</h3>
            </div>
            <Badge variant="outline" className="text-xs">
              {taxFilings.length} {taxFilings.length === 1 ? "Year" : "Years"}
            </Badge>
          </div>

          <div className="space-y-3">
            {taxFilings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No tax filings available yet.</p>
              </div>
            ) : (
              taxFilings.map((filing, index) => {
                // Ensure filing is a valid object with year property
                if (!filing || typeof filing !== 'object' || !filing.year) {
                  console.warn('Invalid filing detected:', filing);
                  return null;
                }

                const statusConfig = getStatusConfig(filing.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <button
                    key={`${filing.year}-${index}`}
                    onClick={() => navigate(`/tax-filing/${filing.year}`)}
                    className="w-full bg-white border rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        
                        <div className="text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-lg">Tax Year {filing.year}</p>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${statusConfig.color} border`}
                            >
                              <StatusIcon className={`w-3 h-3 mr-1 ${statusConfig.iconColor}`} />
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            Last updated: {new Date(filing.updatedAt).toLocaleDateString('en-CA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-6 pt-4 border-t">
            <p className="text-sm text-gray-500 text-center">
              💡 Click on a year to view details, upload documents, and track progress.
            </p>
          </div>
        </Card>

        {/* Next Steps Card */}
        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <span className="text-xl">📋</span> What's Next?
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>✅ Your profile is complete and under review.</p>
            <p>📧 We'll reach out to you at <strong>{profile?.email}</strong> with next steps.</p>
            <p>📞 You can also reach us at our contact number if you have any questions.</p>
            <p>🗓️ You'll receive instructions on how to proceed with your tax filing shortly.</p>
          </div>
        </Card>
      </main>
    </div>
  );
}