import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { supabase } from "../utils/supabaseClient";
import { API_ENDPOINTS } from "../../config/api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { CheckCircle2, Circle, Upload, FileText, Trash2, Eye, Send, Download, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  clientId: string;
  senderId: string;
  senderRole: 'admin' | 'client';
  senderName: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Document {
  id: string;
  fileName: string;
  category: string;
  description: string;
  uploadedAt: string;
  size: number;
  url: string;
  storagePath?: string;
}

interface TimelineStatus {
  step: number;
  updatedAt: string;
}

interface DocumentCategory {
  id: string;
  key: string;
  required: boolean;
}

const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  { id: "t4", key: "docCategory.t4", required: true },
  { id: "t5", key: "docCategory.t5", required: false },
  { id: "medical", key: "docCategory.medical", required: false },
  { id: "charity", key: "docCategory.charity", required: false },
  { id: "rrsp", key: "docCategory.rrsp", required: false },
  { id: "education", key: "docCategory.education", required: false },
  { id: "t4a", key: "docCategory.t4a", required: false },
  { id: "rental", key: "docCategory.rental", required: false },
  { id: "selfEmployed", key: "docCategory.selfEmployed", required: false },
  { id: "other", key: "docCategory.other", required: false },
];

const STEPS = [
  { key: "step1", titleKey: "process.step1Title", descKey: "process.step1Desc" },
  { key: "step2", titleKey: "process.step2Title", descKey: "process.step2Desc" },
  { key: "step3", titleKey: "process.step3Title", descKey: "process.step3Desc" },
  { key: "step4", titleKey: "process.step4Title", descKey: "process.step4Desc" },
  { key: "step5", titleKey: "process.step5Title", descKey: "process.step5Desc" },
];

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [timelineStatus, setTimelineStatus] = useState<TimelineStatus>({ step: 1, updatedAt: new Date().toISOString() });
  const [loading, setLoading] = useState(false);
  const [uploadingCategories, setUploadingCategories] = useState<Record<string, boolean>>({});
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [updatingTimeline, setUpdatingTimeline] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const BUCKET_NAME = "make-c2a25be0-client-documents";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    checkProfileCompletion();
  }, [user, navigate]);

  const checkProfileCompletion = async () => {
    if (!user?.id) return;

    try {
      // Get user metadata from Supabase Auth
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        console.log("No active session, redirecting to login");
        navigate("/login");
        return;
      }

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error checking profile:", error);
        navigate("/login");
        return;
      }

      const profile = data?.user?.user_metadata?.profile;
      
      if (!profile || !profile.onboardingCompleted) {
        // No profile or profile incomplete, redirect to onboarding
        console.log("Profile incomplete, redirecting to onboarding");
        navigate("/onboarding");
        return;
      }

      // Profile complete, proceed with normal initialization
      initializeBucket();
      fetchDocuments();
      fetchTimelineStatus();
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  const initializeBucket = async () => {
    try {
      console.log("🔍 Checking buckets...");
      
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.warn("⚠️ Could not list buckets (this is ok):", listError.message);
        console.log("ℹ️ Assuming bucket exists. Upload will verify.");
        return;
      }
      
      console.log("📦 Available buckets:", buckets);
      console.log("📦 Bucket names:", buckets?.map(b => b.name));
      console.log("📦 Looking for bucket:", BUCKET_NAME);
      console.log("📦 Bucket name length:", BUCKET_NAME.length);
      console.log("📦 Bucket name chars:", BUCKET_NAME.split('').map((c, i) => `[${i}]="${c}" (${c.charCodeAt(0)})`));
      
      const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
      
      if (bucketExists) {
        console.log(`✅ Bucket "${BUCKET_NAME}" found!`);
      } else {
        console.warn(`⚠️ Bucket "${BUCKET_NAME}" not found in list.`);
        console.log("ℹ️ Available bucket details:");
        buckets?.forEach(b => {
          console.log(`  - Name: "${b.name}" (length: ${b.name.length})`);
          console.log(`  - Chars:`, b.name.split('').map((c, i) => `[${i}]="${c}" (${c.charCodeAt(0)})`));
        });
      }
    } catch (error) {
      console.warn("⚠️ Error checking buckets:", error);
      console.log("ℹ️ This is OK - upload will verify bucket exists.");
    }
  };

  const fetchDocuments = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Get documents from user metadata
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      const docs = data?.user?.user_metadata?.documents || [];
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimelineStatus = async () => {
    if (!user?.id) return;
    
    try {
      // Get timeline from user metadata
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching timeline:", error);
        return;
      }

      const timeline = data?.user?.user_metadata?.timeline || { step: 1, updatedAt: new Date().toISOString() };
      setTimelineStatus(timeline);
    } catch (error) {
      console.error("Error fetching timeline:", error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !category) {
      toast.error("Please select a file and category");
      return;
    }

    setUploadingCategories((prev) => ({ ...prev, [category]: true }));

    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      if (!accessToken) {
        throw new Error("No access token");
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("category", category);
      formData.append("description", description);

      const response = await fetch(
        API_ENDPOINTS.documentsUpload,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        const wasOnStep1 = timelineStatus.step === 1;
        
        toast.success("Document uploaded successfully!");
        setSelectedFile(null);
        setCategory("");
        setDescription("");
        
        // Auto-advance to step 2 if still on step 1
        if (wasOnStep1) {
          await advanceTimeline(2, false);
          toast.success("✅ Advancing to Document Review stage!", { duration: 4000 });
        }
        
        // Fetch documents after advancing timeline
        await fetchDocuments();
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload document");
    } finally {
      setUploadingCategories((prev) => ({ ...prev, [category]: false }));
    }
  };

  const getDocumentsForCategory = (categoryId: string) => {
    return documents.filter((doc) => doc.category === categoryId);
  };

  const handleCategoryUpload = async (categoryId: string, file: File) => {
    if (!user?.id) return;
    
    setUploadingCategories((prev) => ({ ...prev, [categoryId]: true }));

    try {
      console.log("Starting upload for category:", categoryId);
      console.log("File:", file.name, "Size:", file.size);
      console.log("User ID:", user.id);
      
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${categoryId}_${Date.now()}.${fileExt}`;
      
      console.log("Uploading to bucket:", BUCKET_NAME, "Path:", fileName);
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log("Upload successful! Getting signed URL...");

      // Get signed URL (valid for 1 year)
      const { data: urlData, error: urlError } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(fileName, 31536000); // 1 year in seconds

      if (urlError) {
        console.error("Signed URL error:", urlError);
        throw new Error(`Failed to generate URL: ${urlError.message}`);
      }

      if (!urlData?.signedUrl) {
        throw new Error("No signed URL returned");
      }

      console.log("Signed URL created. Saving metadata to user...");

      // Create document metadata
      const docId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const documentData = {
        id: docId,
        fileName: file.name,
        category: categoryId,
        description: "",
        uploadedAt: new Date().toISOString(),
        size: file.size,
        url: urlData.signedUrl,
        storagePath: fileName,
      };

      // Get current documents from user metadata
      const { data: userData } = await supabase.auth.getUser();
      const currentDocs = userData?.user?.user_metadata?.documents || [];
      
      // Add new document
      const updatedDocs = [...currentDocs, documentData];

      // Update user metadata with new document list
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          documents: updatedDocs,
        },
      });

      if (updateError) {
        console.error("Update user error:", updateError);
        // If update fails, delete the uploaded file
        await supabase.storage.from(BUCKET_NAME).remove([fileName]);
        throw new Error(`Failed to save document: ${updateError.message}`);
      }

      console.log("✅ Upload complete!");
      toast.success(`${t(`docCategory.${categoryId}`)} uploaded successfully!`);
      await fetchDocuments();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload document");
    } finally {
      setUploadingCategories((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    if (!user?.id) return;

    try {
      // Find the document to get storage path
      const doc = documents.find(d => d.id === documentId);
      if (!doc) {
        throw new Error("Document not found");
      }

      // Delete from storage (if we have storagePath)
      if (doc.storagePath) {
        await supabase.storage.from(BUCKET_NAME).remove([doc.storagePath]);
      }

      // Remove from user metadata
      const { data: userData } = await supabase.auth.getUser();
      const currentDocs = userData?.user?.user_metadata?.documents || [];
      const updatedDocs = currentDocs.filter((d: Document) => d.id !== documentId);

      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          documents: updatedDocs,
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Document deleted");
      await fetchDocuments();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete document");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const advanceTimeline = async (nextStep: number, showToast: boolean = true) => {
    if (nextStep > 5 || nextStep < 1 || !user?.id) return;
    
    setUpdatingTimeline(true);
    try {
      const newTimeline = {
        step: nextStep,
        updatedAt: new Date().toISOString(),
      };

      // Update timeline in user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          timeline: newTimeline,
        },
      });

      if (error) throw error;

      setTimelineStatus(newTimeline);
      if (showToast) {
        toast.success("Progress updated!");
      }
    } catch (error: any) {
      console.error("Timeline update error:", error);
      toast.error(error.message || "Failed to update progress");
    } finally {
      setUpdatingTimeline(false);
    }
  };

  const fetchMessages = async () => {
    if (!user?.id) return;
    
    setLoadingMessages(true);
    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/messages/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return;
    
    setSendingMessage(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userName = userData?.user?.user_metadata?.name || user.email || 'Client';

      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/messages/send`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId: user.id,
            senderId: user.id,
            senderRole: 'client',
            senderName: userName,
            subject: 'Client Message',
            content: newMessage,
          })
        }
      );

      if (!response.ok) throw new Error('Failed to send message');

      setNewMessage('');
      toast.success('Message sent successfully!');
      await fetchMessages();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const canAdvanceToNextStep = () => {
    const currentStep = timelineStatus.step;
    
    // Step 1 -> 2: Need at least 1 document
    if (currentStep === 1) {
      return documents.length > 0;
    }
    
    // Step 2 -> 3: Need at least 3 documents
    if (currentStep === 2) {
      return documents.length >= 3;
    }
    
    // Can't advance from step 3, 4, or 5 (admin controlled)
    return false;
  };

  const handleSubmitForReview = () => {
    if (!confirm("Are you sure you want to submit all documents for review? You can still add more documents later.")) {
      return;
    }
    advanceTimeline(2);
  };

  const uploadedCount = documents.length;
  const totalCategories = DOCUMENT_CATEGORIES.length;
  const uploadProgress = Math.round((uploadedCount / totalCategories) * 100);

  const progressPercentage = (timelineStatus.step / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl">{t("clientPortal.title")}</h1>
            <p className="text-gray-600">
              {t("clientPortal.welcomeBack")}, {user?.email}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            {t("clientPortal.logout")}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Timeline */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl mb-6">Tax Return Progress</h2>
          <Progress value={progressPercentage} className="mb-8 h-3" />

          <div className="space-y-6">
            {STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isComplete = stepNumber < timelineStatus.step;
              const isCurrent = stepNumber === timelineStatus.step;

              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex-shrink-0">
                    {isComplete ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    ) : (
                      <Circle className={`w-8 h-8 ${isCurrent ? "text-blue-600" : "text-gray-300"}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={isCurrent ? "text-blue-600" : ""}>{t(step.titleKey)}</h3>
                      {isCurrent && <Badge>Current</Badge>}
                      {isComplete && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Complete</Badge>}
                    </div>
                    <p className="text-gray-600">{t(step.descKey)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Documents Section */}
        <Card className="p-8">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upload">{t("clientPortal.uploadDocuments")}</TabsTrigger>
              <TabsTrigger value="documents">{t("clientPortal.myDocuments")}</TabsTrigger>
              <TabsTrigger value="messages" onClick={fetchMessages}>
                <MessageSquare className="w-4 h-4 mr-2" />
                {t("messages.title")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div className="space-y-6">
                {/* Header with Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg">Upload Your Tax Documents</h3>
                    <Badge variant="outline">{uploadedCount} of {totalCategories} uploaded</Badge>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-gray-600 mt-2">
                    Upload all required documents. Optional documents can be added if applicable.
                  </p>
                </div>

                {/* Document Categories List */}
                <div className="space-y-3">
                  {DOCUMENT_CATEGORIES.map((cat) => {
                    const categoryDocs = getDocumentsForCategory(cat.id);
                    const hasDocument = categoryDocs.length > 0;
                    const isUploading = uploadingCategories[cat.id];

                    return (
                      <div
                        key={cat.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          hasDocument ? "bg-green-50 border-green-200" : "bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {hasDocument ? (
                              <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-300" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{t(cat.key)}</h4>
                              {cat.required && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                            </div>

                            {/* Show uploaded documents */}
                            {hasDocument ? (
                              <div className="space-y-2 mt-3">
                                {categoryDocs.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="flex items-center justify-between bg-white border border-green-200 rounded px-3 py-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-green-600" />
                                      <span className="text-sm">{doc.fileName}</span>
                                      <span className="text-xs text-gray-500">
                                        ({(doc.size / 1024).toFixed(1)} KB)
                                      </span>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => window.open(doc.url, "_blank")}
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => handleDelete(doc.id)}
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              /* Upload Button */
                              <div className="mt-3">
                                <label
                                  htmlFor={`file-${cat.id}`}
                                  className={`flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                    isUploading
                                      ? "bg-gray-50 border-gray-300 cursor-not-allowed"
                                      : "hover:bg-gray-50 hover:border-blue-400"
                                  }`}
                                >
                                  <Upload className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    {isUploading ? "Uploading..." : "Upload File"}
                                  </span>
                                </label>
                                <input
                                  id={`file-${cat.id}`}
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleCategoryUpload(cat.id, file);
                                    }
                                    e.target.value = "";
                                  }}
                                  disabled={isUploading}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Notes */}
                <div className="border-t pt-6">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="mt-2"
                    placeholder="Add any additional information for your tax specialist..."
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                {documents.length > 0 && timelineStatus.step === 1 && (
                  <div className="border-t pt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-900">
                        ✓ You have uploaded {uploadedCount} document{uploadedCount !== 1 ? "s" : ""}. 
                        Click below to submit for review.
                      </p>
                    </div>
                    <Button
                      onClick={handleSubmitForReview}
                      disabled={updatingTimeline}
                      className="w-full"
                      size="lg"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {updatingTimeline ? "Submitting..." : "Submit All Documents for Review"}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="documents">
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t("clientPortal.noDocuments")}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FileText className="w-10 h-10 text-blue-600" />
                          <div>
                            <h4>{doc.fileName}</h4>
                            <p className="text-sm text-gray-600">
                              {t("clientPortal.category")}: {t(`docCategory.${doc.category}` as any)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {t("clientPortal.uploadedOn")} {new Date(doc.uploadedAt).toLocaleDateString()} •{" "}
                              {(doc.size / 1024).toFixed(2)} KB
                            </p>
                            {doc.description && (
                              <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.url, "_blank")}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Request Review Button */}
                  {canAdvanceToNextStep() && (
                    <div className="border-t pt-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-blue-900">
                          {timelineStatus.step === 1 && "You have uploaded documents. Click below to move to the next step."}
                          {timelineStatus.step === 2 && "You have uploaded 3+ documents. Ready to submit for review?"}
                        </p>
                      </div>
                      <Button
                        onClick={() => advanceTimeline(timelineStatus.step + 1)}
                        disabled={updatingTimeline}
                        className="w-full"
                      >
                        {updatingTimeline ? "Updating..." : timelineStatus.step === 2 ? "Submit for Review" : "Continue to Document Collection"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="messages">
              <div className="space-y-6">
                {/* Messages Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">{t("messages.title")}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Chat with your tax advisor
                    </p>
                  </div>
                </div>

                {/* Messages List */}
                <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto space-y-4">
                  {loadingMessages ? (
                    <div className="text-center py-8 text-gray-500">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">{t("messages.noMessages")}</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isFromClient = msg.senderRole === 'client';
                      const date = new Date(msg.createdAt);
                      const today = new Date();
                      const yesterday = new Date(today);
                      yesterday.setDate(yesterday.getDate() - 1);
                      
                      let dateLabel = date.toLocaleDateString();
                      if (date.toDateString() === today.toDateString()) {
                        dateLabel = t("messages.today");
                      } else if (date.toDateString() === yesterday.toDateString()) {
                        dateLabel = t("messages.yesterday");
                      }

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isFromClient ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-4 ${
                              isFromClient
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold">
                                {isFromClient ? t("messages.you") : t("messages.admin")}
                              </span>
                              <span className={`text-xs ${isFromClient ? 'text-blue-100' : 'text-gray-500'}`}>
                                {dateLabel} • {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t("messages.writeMessage")}
                    className="flex-1 min-h-[80px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="h-[80px]"
                  >
                    {sendingMessage ? (
                      <span>{t("messages.sending")}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t("messages.send")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}