import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { projectId } from "../../../utils/supabase/info";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Send, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Calculator,
  Eye,
  Flag,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { getDocumentCategories, needsQuebecForms, getCategoryName, getCategoryDescription } from "../config/documentCategories";
import { TaxDocumentsUploader } from "../components/client/TaxDocumentsUploader";
import { TaxReturnPreviewComponent } from "../components/tax/TaxReturnPreviewComponent";
import { PaymentTimeline } from "../components/client/PaymentTimeline";
import { PaymentVerification } from "../components/payment/PaymentVerification";
import { usePaymentStatus } from "../hooks/usePaymentStatus";
import { API_ENDPOINTS } from "../../config/api";
import type { TaxReturnPreview, ParsedDocument, Province } from "../types/taxDocuments";
import { calculateCanadianTax, type TaxCalculationInput } from "../utils/taxCalculator";

interface QuestionnaireData {
  immigrationStatusChanged: "yes" | "no" | "";
  newImmigrationStatus?: string;
  maritalStatusChanged: "yes" | "no" | "";
  newMaritalStatus?: string;
  addressChanged: "yes" | "no" | "";
  newAddress?: string;
  dependentsChanged: "yes" | "no" | "";
  newDependentsCount?: string;
  employmentChanged: "yes" | "no" | "";
  employmentDetails?: string;
  otherChanges?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  category: string;
  uploadedAt: string;
  path: string;
  url?: string;
}

interface TaxFilingData {
  year: number;
  status: "not-started" | "in-progress" | "under-review" | "completed" | "filed";
  questionnaireData?: QuestionnaireData;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  calculatedTax?: TaxReturnPreview; // 🔥 NEW: Store calculated tax preview
  payment?: {
    initialPaid: boolean;
    initialAmount: number;
    finalPaid: boolean;
    finalAmount: number;
    totalPrice: number;
  };
}

const BUCKET_NAME = "tax-documents-c2a25be0";

export function TaxFilingDetailPage() {
  const { year } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [filingData, setFilingData] = useState<TaxFilingData | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [taxReturnPreview, setTaxReturnPreview] = useState<TaxReturnPreview | null>(null);
  const [calculating, setCalculating] = useState(false); // 🔥 NEW: Calculating state

  // 🔥 NEW: Payment status hook
  const { paymentStatus, loading: paymentLoading, refetch: refetchPayment } = usePaymentStatus(Number(year));

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<QuestionnaireData>({
    defaultValues: {
      immigrationStatusChanged: "",
      maritalStatusChanged: "",
      addressChanged: "",
      dependentsChanged: "",
      employmentChanged: ""
    }
  });

  const immigrationChanged = watch("immigrationStatusChanged");
  const maritalChanged = watch("maritalStatusChanged");
  const addressChanged = watch("addressChanged");
  const dependentsChanged = watch("dependentsChanged");
  const employmentChanged = watch("employmentChanged");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    initializePage();
  }, [user, year]);

  const initializePage = async () => {
    setLoading(true);
    try {
      // Load tax filing data
      await loadFilingData();
      
      // Load uploaded files
      await loadUploadedFiles();
    } catch (error) {
      console.error("Error initializing page:", error);
      toast.error("Error loading tax filing data");
    } finally {
      setLoading(false);
    }
  };

  const loadFilingData = async () => {
    if (!user) return;

    try {
      const { data: userData, error } = await supabase.auth.getUser();
      
      if (error || !userData?.user) {
        console.error("Error getting user:", error);
        return;
      }

      const metadata = userData.user.user_metadata;
      
      // Save user profile to determine categories
      setUserProfile(metadata?.profile || {});
      
      const taxFilings: TaxFilingData[] = metadata?.taxFilings || [];
      
      // Find or create filing for this year
      let filing = taxFilings.find(f => f.year === Number(year));
      
      if (!filing) {
        // Create new filing
        filing = {
          year: Number(year),
          status: "in-progress",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Save to Supabase
        const updatedFilings = [...taxFilings, filing];
        await supabase.auth.updateUser({
          data: { taxFilings: updatedFilings }
        });
      }
      
      setFilingData(filing);
      
      // Load questionnaire data into form
      if (filing.questionnaireData) {
        Object.keys(filing.questionnaireData).forEach((key) => {
          setValue(key as keyof QuestionnaireData, filing.questionnaireData![key as keyof QuestionnaireData]);
        });
      }
    } catch (error) {
      console.error("Error loading filing data:", error);
    }
  };

  const loadUploadedFiles = async () => {
    if (!user || !year) return;

    try {
      // 🔥 NOVO: Carregar do KV store ao invés do Storage direto
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      // Buscar documentos do KV store via backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/tax-documents/list/${year}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        console.error('Failed to load documents:', await response.text());
        setUploadedFiles([]);
        return;
      }

      const result = await response.json();
      setUploadedFiles(result.files || []);
      console.log('✅ Loaded files from KV store:', result.files);
    } catch (error) {
      console.error("Error loading uploaded files:", error);
      setUploadedFiles([]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !category || !user || !year) return;

    setLoading(true);
    setSelectedCategory(category);
    setUploadProgress(0);

    try {
      // Get access token
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        toast.error('Authentication error. Please log in again.');
        setLoading(false);
        return;
      }

      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file size (10MB max)
        if (file.size > 10485760) {
          toast.error(`${file.name} is too large. Max size is 10MB.`);
          return null;
        }

        // Validate file type
        const allowedTypes = [
          'application/pdf',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!allowedTypes.includes(file.type)) {
          toast.error(`${file.name} has an invalid file type.`);
          return null;
        }

        setUploadProgress(20);

        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('year', year);

        setUploadProgress(40);

        try {
          // 🔥 Upload through backend (bypasses RLS)
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/tax-documents/upload`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`
              },
              body: formData
            }
          );

          setUploadProgress(80);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
          }

          const result = await response.json();
          setUploadProgress(100);

          console.log('✅ File uploaded successfully:', result);
          return result.file as UploadedFile;
        } catch (uploadError: any) {
          console.error('Upload error:', uploadError);
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(f => f !== null) as UploadedFile[];

      if (successfulUploads.length > 0) {
        setUploadedFiles(prev => [...prev, ...successfulUploads]);
        toast.success(`${successfulUploads.length} file(s) uploaded successfully`);
        
        // Update filing status to in-progress
        await updateFilingStatus("in-progress");
      }

      // Reset file input
      e.target.value = "";
      setSelectedCategory("");
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files. Please try again or contact support.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = async (file: UploadedFile) => {
    if (!confirm(`Are you sure you want to delete ${file.name}?`)) return;

    try {
      // Get access token
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        toast.error('Authentication error');
        return;
      }

      // Extract year, category, and filename from path
      // Path format: userId/year/category/filename
      const pathParts = file.path.split('/');
      const year = pathParts[1];
      const category = pathParts[2];
      const filename = pathParts[3];

      // 🔥 Delete through backend (bypasses RLS)
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/tax-documents/${year}/${category}/${encodeURIComponent(filename)}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }

      // Remove from local state
      const updatedFiles = uploadedFiles.filter(f => f.id !== file.id);
      setUploadedFiles(updatedFiles);
      
      toast.success("File deleted successfully");
    } catch (error: any) {
      console.error("Error deleting file:", error);
      toast.error(`Error deleting file: ${error.message}`);
    }
  };

  const handleDownloadFile = async (file: UploadedFile) => {
    try {
      // If we have a URL from backend, use it directly
      if (file.url) {
        window.open(file.url, '_blank');
        return;
      }

      // Otherwise, create signed URL via Storage (may fail with RLS)
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(file.path, 60);

      if (error || !data) {
        toast.error("Failed to download file");
        return;
      }

      // Open in new tab
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error downloading file");
    }
  };

  const updateFilingStatus = async (status: TaxFilingData["status"], questionnaireData?: QuestionnaireData) => {
    if (!user || !year) return;

    try {
      const { data: userData, error } = await supabase.auth.getUser();
      
      if (error || !userData?.user) {
        console.error("Error getting user:", error);
        return;
      }

      const metadata = userData.user.user_metadata;
      const taxFilings: TaxFilingData[] = metadata?.taxFilings || [];
      
      // Find and update filing
      const filingIndex = taxFilings.findIndex(f => f.year === Number(year));
      
      if (filingIndex >= 0) {
        taxFilings[filingIndex] = {
          ...taxFilings[filingIndex],
          status,
          updatedAt: new Date().toISOString(),
          ...(questionnaireData && { questionnaireData }),
          ...(status === "under-review" && { submittedAt: new Date().toISOString() })
        };
      } else {
        taxFilings.push({
          year: Number(year),
          status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...(questionnaireData && { questionnaireData }),
          ...(status === "under-review" && { submittedAt: new Date().toISOString() })
        });
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { taxFilings }
      });

      if (updateError) {
        console.error("Error updating filing status:", updateError);
      }
    } catch (error) {
      console.error("Error updating filing status:", error);
    }
  };

  const onSubmit = async (data: QuestionnaireData) => {
    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one document before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      // Save questionnaire data and update status
      await updateFilingStatus("under-review", data);
      
      toast.success("Tax filing submitted successfully! We'll review your information and get back to you soon.");
      
      // Wait a bit for the success message to show
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Error submitting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFilesByCategory = (category: string) => {
    return uploadedFiles.filter(f => f.category === category);
  };

  const getStatusConfig = (status: TaxFilingData["status"]) => {
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

  // 🔥 NEW: Auto-calculate tax from uploaded OCR documents
  const handleCalculateTax = async () => {
    if (!user || !year) return;

    setCalculating(true);

    try {
      // 1. Get access token
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        toast.error('Authentication error');
        setCalculating(false);
        return;
      }

      console.log('🔍 Step 1: Fetching parsed documents for year:', year);

      // 2. Fetch parsed documents from backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/tax-documents/${year}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      console.log('🔍 Step 2: Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch parsed documents');
      }

      const responseData = await response.json();
      console.log('🔍 Step 3: Response data:', responseData);
      
      const parsedDocs = responseData.documents;
      console.log('📄 Fetched documents:', parsedDocs);
      console.log('📊 Number of documents:', parsedDocs?.length || 0);
      
      if (!parsedDocs || parsedDocs.length === 0) {
        toast.error('No parsed documents found. Please upload and SAVE tax documents first using the OCR uploader above.', {
          duration: 6000
        });
        setCalculating(false);
        return;
      }

      console.log('🔍 Step 4: Processing', parsedDocs.length, 'documents');

      // 3. Get user data for calculation
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData?.user) {
        throw new Error('Failed to get user data');
      }

      const profile = userData.user.user_metadata?.profile || {};
      const questionnaireData = filingData?.questionnaireData || {};

      console.log('🔍 Step 5: User profile:', profile);
      console.log('🔍 Step 6: Questionnaire data:', questionnaireData);

      // 4. Prepare calculation input
      const maritalStatus = questionnaireData.newMaritalStatus || profile.maritalStatus || 'single';
      const numberOfChildren = questionnaireData.newDependentsCount 
        ? parseInt(questionnaireData.newDependentsCount) 
        : (profile.numberOfChildren || 0);

      const calculationInput: TaxCalculationInput = {
        province: (profile.province || 'ON') as Province,
        maritalStatus: maritalStatus as 'single' | 'married' | 'common-law',
        numberOfChildren: numberOfChildren,
        childrenUnder6: Math.min(numberOfChildren, profile.childrenUnder6 || 0),
        documents: parsedDocs as ParsedDocument[],
        personalInfo: {
          name: profile.fullName || userData.user.email || '',
          sin: profile.sin
        },
        year: Number(year)
      };

      console.log('🧮 Step 7: Calculating tax with input:', calculationInput);

      // 5. Calculate tax
      const calculatedPreview = calculateCanadianTax(calculationInput);
      calculatedPreview.userId = userData.user.id;

      console.log('✅ Step 8: Tax calculated successfully!', calculatedPreview);
      console.log('💰 Federal Tax:', calculatedPreview.federalTax.refundOrOwing);
      console.log('💰 Provincial Tax:', calculatedPreview.provincialTax.refundOrOwing);
      console.log('💰 Total:', calculatedPreview.totalRefundOrOwing);

      // 6. Save to state
      setTaxReturnPreview(calculatedPreview);

      // 7. Save to user metadata for persistence
      const taxFilings: TaxFilingData[] = userData.user.user_metadata?.taxFilings || [];
      const filingIndex = taxFilings.findIndex(f => f.year === Number(year));
      
      if (filingIndex >= 0) {
        taxFilings[filingIndex] = {
          ...taxFilings[filingIndex],
          calculatedTax: calculatedPreview,
          updatedAt: new Date().toISOString()
        };
      } else {
        taxFilings.push({
          year: Number(year),
          status: 'in-progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          calculatedTax: calculatedPreview
        });
      }

      await supabase.auth.updateUser({
        data: { taxFilings }
      });

      console.log('✅ Step 9: Saved to user metadata');

      toast.success('✅ Tax calculation completed successfully!', { duration: 4000 });
    } catch (error: any) {
      console.error('❌ Error calculating tax:', error);
      console.error('❌ Error stack:', error.stack);
      toast.error(`Failed to calculate tax: ${error.message}`, { duration: 5000 });
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading tax filing data...</p>
        </div>
      </div>
    );
  }

  const statusConfig = filingData ? getStatusConfig(filingData.status) : null;
  const StatusIcon = statusConfig?.icon || Clock;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔥 Payment Verification - Detects Stripe redirect */}
      <PaymentVerification />

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex-1 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="font-medium text-lg">Tax Year {year}</h1>
                <p className="text-sm text-gray-500">Complete questionnaire and upload documents</p>
              </div>
            </div>

            {statusConfig && (
              <Badge variant="outline" className={`${statusConfig.color} border`}>
                <StatusIcon className={`w-3 h-3 mr-1 ${statusConfig.iconColor}`} />
                {statusConfig.label}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 🔥 NEW: Payment Timeline */}
        {filingData && (
          <Card className="p-6 mb-6">
            <PaymentTimeline 
              currentStep={
                filingData.status === "not-started" ? 1 :
                filingData.status === "in-progress" ? 2 :
                filingData.status === "under-review" ? 3 :
                filingData.status === "completed" ? 4 :
                5 // filed
              }
              initialPaymentPaid={filingData.payment?.initialPaid || false}
              finalPaymentPaid={filingData.payment?.finalPaid || false}
              totalPrice={filingData.payment?.totalPrice || 199}
              taxYear={Number(year)}
              onPaymentSuccess={() => {
                // Reload filing data after payment
                loadFilingData();
                refetchPayment();
              }}
            />
          </Card>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Questionnaire Section */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <h2 className="font-medium text-lg">Annual Questionnaire</h2>
                <p className="text-sm text-gray-500">Let us know if there were any changes since last year</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Immigration Status */}
              <div className="space-y-3">
                <Label className="text-base">
                  Did your immigration status change this year? <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="yes"
                      {...register("immigrationStatusChanged", { required: true })}
                      className="w-4 h-4"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="no"
                      {...register("immigrationStatusChanged", { required: true })}
                      className="w-4 h-4"
                    />
                    <span>No</span>
                  </label>
                </div>
                {errors.immigrationStatusChanged && (
                  <p className="text-sm text-red-500">This field is required</p>
                )}
                
                {immigrationChanged === "yes" && (
                  <div className="ml-6 mt-3">
                    <Label htmlFor="newImmigrationStatus">What is your new status?</Label>
                    <select
                      id="newImmigrationStatus"
                      {...register("newImmigrationStatus")}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select...</option>
                      <option value="citizen">Canadian Citizen</option>
                      <option value="permanent-resident">Permanent Resident</option>
                      <option value="work-permit">Work Permit</option>
                      <option value="study-permit">Study Permit</option>
                      <option value="visitor">Visitor</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Marital Status */}
              <div className="space-y-3">
                <Label className="text-base">
                  Did your marital status change this year? <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="yes"
                      {...register("maritalStatusChanged", { required: true })}
                      className="w-4 h-4"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="no"
                      {...register("maritalStatusChanged", { required: true })}
                      className="w-4 h-4"
                    />
                    <span>No</span>
                  </label>
                </div>
                {errors.maritalStatusChanged && (
                  <p className="text-sm text-red-500">This field is required</p>
                )}
                
                {maritalChanged === "yes" && (
                  <div className="ml-6 mt-3">
                    <Label htmlFor="newMaritalStatus">What is your new marital status?</Label>
                    <select
                      id="newMaritalStatus"
                      {...register("newMaritalStatus")}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select...</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="common-law">Common-law</option>
                      <option value="divorced">Divorced</option>
                      <option value="separated">Separated</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Address Change */}
              <div className="space-y-3">
                <Label className="text-base">
                  Did you change your address this year? <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="yes"
                      {...register("addressChanged", { required: true })}
                      className="w-4 h-4"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="no"
                      {...register("addressChanged", { required: true })}
                      className="w-4 h-4"
                    />
                    <span>No</span>
                  </label>
                </div>
                {errors.addressChanged && (
                  <p className="text-sm text-red-500">This field is required</p>
                )}
                
                {addressChanged === "yes" && (
                  <div className="ml-6 mt-3">
                    <Label htmlFor="newAddress">What is your new address?</Label>
                    <Input
                      id="newAddress"
                      {...register("newAddress")}
                      placeholder="Full address including city and postal code"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              {/* Dependents Change */}
              <div className="space-y-3">
                <Label className="text-base">
                  Did your number of dependents change? <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="yes"
                      {...register("dependentsChanged", { required: true })}
                      className="w-4 h-4"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="no"
                      {...register("dependentsChanged", { required: true })}
                      className="w-4 h-4"
                    />
                    <span>No</span>
                  </label>
                </div>
                {errors.dependentsChanged && (
                  <p className="text-sm text-red-500">This field is required</p>
                )}
                
                {dependentsChanged === "yes" && (
                  <div className="ml-6 mt-3">
                    <Label htmlFor="newDependentsCount">How many dependents do you have now?</Label>
                    <Input
                      id="newDependentsCount"
                      type="number"
                      min="0"
                      {...register("newDependentsCount")}
                      placeholder="0"
                      className="mt-1 max-w-xs"
                    />
                  </div>
                )}
              </div>

              {/* Employment Change */}
              <div className="space-y-3">
                <Label className="text-base">
                  Did your employment situation change? <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="yes"
                      {...register("employmentChanged", { required: true })}
                      className="w-4 h-4"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="no"
                      {...register("employmentChanged", { required: true })}
                      className="w-4 h-4"
                    />
                    <span>No</span>
                  </label>
                </div>
                {errors.employmentChanged && (
                  <p className="text-sm text-red-500">This field is required</p>
                )}
                
                {employmentChanged === "yes" && (
                  <div className="ml-6 mt-3">
                    <Label htmlFor="employmentDetails">Please describe the change</Label>
                    <textarea
                      id="employmentDetails"
                      {...register("employmentDetails")}
                      placeholder="e.g., Changed employer, Started self-employment, Became unemployed, etc."
                      className="w-full mt-1 px-3 py-2 border rounded-lg min-h-[80px]"
                    />
                  </div>
                )}
              </div>

              {/* Other Changes */}
              <div className="space-y-3">
                <Label htmlFor="otherChanges" className="text-base">
                  Any other important changes we should know about?
                </Label>
                <textarea
                  id="otherChanges"
                  {...register("otherChanges")}
                  placeholder="e.g., Started a business, Sold property, Received inheritance, etc."
                  className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
                />
              </div>
            </div>
          </Card>

          {/* 🔥 NEW: Tax Documents with OCR Section */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-purple-200">
              <Calculator className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <h2 className="font-medium text-lg">🔥 Smart Tax Document Upload (with OCR)</h2>
                <p className="text-sm text-gray-600">
                  Upload T4, Relevé 1, T5, T2202, RRSP receipts - We'll automatically extract the data!
                </p>
              </div>
            </div>

            {paymentStatus?.initialPaid ? (
              <>
                <TaxDocumentsUploader 
                  year={Number(year)}
                  onDocumentsUploaded={(docs) => {
                    console.log('📄 Documents uploaded with OCR:', docs);
                    toast.success(`Uploaded ${docs.length} document(s) with automatic data extraction!`);
                  }}
                  onComplete={() => {
                    toast.success('✅ All documents saved! Now you can calculate your taxes below.', {
                      duration: 5000
                    });
                  }}
                />

                {/* Important Instructions */}
                <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-amber-900 mb-1">⚠️ Important: Save Before Calculating</p>
                      <p className="text-sm text-amber-800">
                        After uploading documents above, <strong>click the green &quot;Save All Documents&quot; button</strong> that appears. 
                        Only then you can use the tax calculator below to see your refund or amount owing.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 bg-white/50 border-2 border-dashed border-amber-300 rounded-lg text-center backdrop-blur-sm">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  🔒 Initial Payment Required
                </h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  To start uploading documents and using our advanced OCR technology, please complete the 
                  <strong> $50 CAD initial deposit</strong> using the payment button in the timeline above.
                </p>
                <p className="text-sm text-gray-500">
                  This deposit secures your spot and allows us to begin processing your tax return immediately.
                </p>
              </div>
            )}


          </Card>

          {/* 🔥 NEW: Auto-Calculate Tax Section */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-300">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-medium text-lg">🧮 Automatic Tax Calculation</h2>
                  <p className="text-sm text-gray-600">
                    Calculate your tax return based on uploaded documents
                  </p>
                </div>
              </div>
              
              <Button
                type="button"
                onClick={handleCalculateTax}
                disabled={calculating}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {calculating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Taxes
                  </>
                )}
              </Button>
            </div>

            {!taxReturnPreview && !calculating && (
              <div className="text-center py-8 px-4 bg-white rounded-lg border-2 border-dashed border-blue-200">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">No Tax Calculation Yet</h3>
                <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                  Upload your tax documents using the OCR uploader above, then click "Calculate Taxes" to see your estimated refund or amount owing.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Calculations are based on CRA 2025 tax rates</span>
                </div>
              </div>
            )}

            {calculating && (
              <div className="text-center py-12 px-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                <h3 className="font-medium text-lg mb-2">Calculating Your Taxes...</h3>
                <p className="text-sm text-gray-600">
                  Processing your documents and applying Canadian tax rates
                </p>
              </div>
            )}

            {taxReturnPreview && !calculating && (
              <div className="space-y-6">
                {/* Quick Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Federal Tax</h3>
                      <Flag className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">
                        Refund: <span className="font-medium text-green-600">
                          ${Math.abs(Math.min(0, taxReturnPreview.federalTax.refundOrOwing)).toFixed(2)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Owing: <span className="font-medium text-red-600">
                          ${Math.abs(Math.max(0, taxReturnPreview.federalTax.refundOrOwing)).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500">Provincial Tax</h3>
                      <Flag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">
                        Refund: <span className="font-medium text-green-600">
                          ${Math.abs(Math.min(0, taxReturnPreview.provincialTax.refundOrOwing)).toFixed(2)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Owing: <span className="font-medium text-red-600">
                          ${Math.abs(Math.max(0, taxReturnPreview.provincialTax.refundOrOwing)).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Summary */}
                <div className={`p-6 rounded-lg border-2 ${
                  taxReturnPreview.totalRefundOrOwing < 0 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {taxReturnPreview.totalRefundOrOwing < 0 ? '🎉 Total Refund' : '💰 Total Owing'}
                    </p>
                    <p className={`text-4xl font-bold ${
                      taxReturnPreview.totalRefundOrOwing < 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Math.abs(taxReturnPreview.totalRefundOrOwing).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Federal + Provincial (based on uploaded documents)
                    </p>
                  </div>
                </div>

                {/* Annual Credits Info */}
                {(taxReturnPreview as any).annualCredits && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-4 text-sm">📋 Estimated Annual Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(taxReturnPreview as any).annualCredits.gstHst > 0 && (
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <p className="text-xs text-gray-600 mb-1">GST/HST Credit</p>
                          <p className="font-medium text-blue-600">
                            ${((taxReturnPreview as any).annualCredits.gstHst).toFixed(2)}/year
                          </p>
                        </div>
                      )}
                      {(taxReturnPreview as any).annualCredits.ccb > 0 && (
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <p className="text-xs text-gray-600 mb-1">Canada Child Benefit</p>
                          <p className="font-medium text-purple-600">
                            ${((taxReturnPreview as any).annualCredits.ccb).toFixed(2)}/year
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Info Box */}
                <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Note:</strong> This is an estimated calculation based on the documents you've uploaded. 
                    Final amounts may vary after professional review and may be subject to additional deductions or credits.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Document Upload Section */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Upload className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <h2 className="font-medium text-lg">Upload Documents</h2>
                <p className="text-sm text-gray-500">Upload your tax documents organized by category</p>
              </div>
              <Badge variant="outline">
                {uploadedFiles.length} {uploadedFiles.length === 1 ? "file" : "files"}
              </Badge>
            </div>

            <div className="space-y-6">
              {getDocumentCategories(userProfile?.province, userProfile?.workProvince).map((category) => {
                const filesInCategory = getFilesByCategory(category.id);
                
                return (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <h3 className="font-medium">{getCategoryName(category.id, language)}</h3>
                          <p className="text-sm text-gray-500">{getCategoryDescription(category.id, language)}</p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="file"
                          id={`upload-${category.id}`}
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, category.id)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (!paymentStatus?.initialPaid) {
                              toast.error('Please complete the initial $50 payment first');
                              return;
                            }
                            document.getElementById(`upload-${category.id}`)?.click();
                          }}
                          disabled={(loading && selectedCategory === category.id) || !paymentStatus?.initialPaid}
                        >
                          {loading && selectedCategory === category.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : !paymentStatus?.initialPaid ? (
                            <>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Payment Required
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Uploaded files in this category */}
                    {filesInCategory.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {filesInCategory.map((file) => (
                          <div 
                            key={file.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadFile(file)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteFile(file)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {loading && selectedCategory === category.id && uploadProgress > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Accepted file formats:</p>
                  <p>PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-2">Ready to Submit?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Once you submit, our team will review your information and documents. 
                  We'll contact you if we need any additional information.
                </p>
                
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>You can come back and upload more documents anytime before we start processing.</p>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting || uploadedFiles.length === 0 || !paymentStatus?.initialPaid}
                className="flex-shrink-0"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : !paymentStatus?.initialPaid ? (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Required
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Tax Filing
                  </>
                )}
              </Button>
            </div>

            {!paymentStatus?.initialPaid && (
              <div className="mt-4 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>Initial payment of $50 CAD is required before submitting your tax filing.</p>
              </div>
            )}

            {uploadedFiles.length === 0 && paymentStatus?.initialPaid && (
              <div className="mt-4 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>Please upload at least one document before submitting.</p>
              </div>
            )}
          </Card>
        </form>
      </main>
    </div>
  );
}