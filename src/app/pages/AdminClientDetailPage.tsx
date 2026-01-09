import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  MessageSquare,
  Send,
  FolderOpen,
  FileCheck,
  DollarSign,
  Wrench, // Added for fix button
} from "lucide-react";
import { isAdminEmail } from "../config/admins";
import { API_ENDPOINTS } from "../../config/api";
import { projectId } from "../../../utils/supabase/info";
import { SubmitReportModal } from "../components/admin/SubmitReportModal";
import { SubmitReportModalWithSummary } from "../components/admin/SubmitReportModalWithSummary";
import { UploadDocumentsModal } from "../components/admin/UploadDocumentsModal";
import { CreateTaxFilingModal } from "../components/admin/CreateTaxFilingModal";
import { CRAAssessmentSection } from "../components/admin/CRAAssessmentSection";
import { TaxFilingsSection } from "../components/admin/TaxFilingsSection";
import { fixUserTaxFilings } from "../utils/fixCorruptedTaxFilings"; // Added import

interface ClientData {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  personalInfo: any;
  taxFilings: any[];
  onboardingComplete: boolean;
}

interface FileData {
  id: string;
  name: string;
  size: number;
  category: string;
  uploadedAt: string;
  path: string;
  url?: string;
}

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

interface DocumentsByYear {
  year: number;
  files: FileData[];
}

export function AdminClientDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [filesCache, setFilesCache] = useState<Record<number, FileData[]>>({});
  const [loadingFiles, setLoadingFiles] = useState<Record<number, boolean>>({});
  const [showSubmitReportModal, setShowSubmitReportModal] = useState(false);
  const [selectedFilingYear, setSelectedFilingYear] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [allDocuments, setAllDocuments] = useState<DocumentsByYear[]>([]);
  const [loadingAllDocuments, setLoadingAllDocuments] = useState(false);
  const [showUploadDocumentsModal, setShowUploadDocumentsModal] = useState(false);
  const [showCreateTaxFilingModal, setShowCreateTaxFilingModal] = useState(false);

  useEffect(() => {
    if (!user || !isAdminEmail(user.email)) {
      navigate("/login");
      return;
    }
    loadClientData();
    loadMessages();
    loadAllDocuments();
  }, [user, userId]);

  const loadClientData = async () => {
    setLoading(true);
    try {
      if (!userId) {
        throw new Error("No user ID provided");
      }

      // Buscar sessão e token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error("Not authenticated");
      }

      const accessToken = sessionData.session.access_token;

      // Usar a rota do servidor para buscar dados do cliente
      const response = await fetch(
        `${API_ENDPOINTS.adminClients}/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch client');
      }

      const data = await response.json();
      console.log("Fetched client from server:", data.client);

      setClient(data.client);
    } catch (error) {
      console.error("Error loading client:", error);
      toast.error(`Failed to load client data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadFilesForYear = async (year: number) => {
    if (filesCache[year]) {
      return; // Already loaded
    }

    setLoadingFiles(prev => ({ ...prev, [year]: true }));
    
    try {
      if (!userId) {
        throw new Error("No user ID provided");
      }

      // Buscar arquivos do KV store
      const { data: kvData, error: kvError } = await supabase
        .from('kv_store_c2a25be0')
        .select('key, value')
        .eq('key', `user:${userId}:documents:${year}`);

      if (kvError) {
        console.error("Error fetching documents from KV:", kvError);
        throw new Error("Failed to load documents");
      }

      let files: FileData[] = [];
      
      if (kvData && kvData.length > 0) {
        const documentsData = kvData[0].value;
        
        if (Array.isArray(documentsData)) {
          // Gerar URLs assinadas para cada arquivo
          files = await Promise.all(
            documentsData.map(async (doc: any) => {
              let signedUrl = null;
              
              // Tentar gerar URL assinada do Supabase Storage
              if (doc.path) {
                const { data: urlData } = await supabase.storage
                  .from('tax-documents-c2a25be0')
                  .createSignedUrl(doc.path, 3600); // 1 hora
                
                if (urlData) {
                  signedUrl = urlData.signedUrl;
                }
              }

              return {
                id: doc.id || doc.path,
                name: doc.name || doc.fileName || 'Unknown',
                size: doc.size || 0,
                category: doc.category || 'other',
                uploadedAt: doc.uploadedAt || doc.createdAt || new Date().toISOString(),
                path: doc.path || '',
                url: signedUrl,
              };
            })
          );
        }
      }

      console.log(`Loaded ${files.length} files for year ${year}`);
      setFilesCache(prev => ({ ...prev, [year]: files }));
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error(`Failed to load documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setFilesCache(prev => ({ ...prev, [year]: [] }));
    } finally {
      setLoadingFiles(prev => ({ ...prev, [year]: false }));
    }
  };

  const toggleYear = (year: number) => {
    if (expandedYear === year) {
      setExpandedYear(null);
    } else {
      setExpandedYear(year);
      loadFilesForYear(year);
    }
  };

  const updateFilingStatus = async (year: number, newStatus: string) => {
    try {
      if (!userId || !client) {
        throw new Error("Missing user or client data");
      }

      // Atualizar status localmente no array de taxFilings
      const updatedFilings = client.taxFilings.map(filing => 
        filing.year === year 
          ? { ...filing, status: newStatus, updatedAt: new Date().toISOString() }
          : filing
      );

      // Atualizar no KV store
      const { error: updateError } = await supabase
        .from('kv_store_c2a25be0')
        .upsert({
          key: `user:${userId}:taxFilings`,
          value: updatedFilings
        });

      if (updateError) {
        console.error("Error updating filing status:", updateError);
        throw new Error("Failed to update status");
      }

      toast.success("Status updated successfully");
      
      // Recarregar dados do cliente
      await loadClientData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "not-started":
        return {
          label: "Not Started",
          color: "bg-gray-100 text-gray-700 border-gray-300",
          icon: AlertCircle,
        };
      case "in-progress":
        return {
          label: "In Progress",
          color: "bg-blue-100 text-blue-700 border-blue-300",
          icon: Clock,
        };
      case "under-review":
        return {
          label: "Under Review",
          color: "bg-yellow-100 text-yellow-700 border-yellow-300",
          icon: Clock,
        };
      case "completed":
        return {
          label: "Completed",
          color: "bg-green-100 text-green-700 border-green-300",
          icon: CheckCircle,
        };
      case "filed":
        return {
          label: "Filed with CRA",
          color: "bg-purple-100 text-purple-700 border-purple-300",
          icon: CheckCircle,
        };
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-700 border-gray-300",
          icon: AlertCircle,
        };
    }
  };

  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      income: "Income Documents",
      deductions: "Deduction Receipts",
      business: "Business Documents",
      property: "Property & Investments",
      other: "Other Documents",
    };
    return categories[categoryId] || categoryId;
  };

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      if (!userId) {
        throw new Error("No user ID provided");
      }

      // Buscar mensagens do KV store
      const { data: kvData, error: kvError } = await supabase
        .from('kv_store_c2a25be0')
        .select('key, value')
        .eq('key', `user:${userId}:messages`);

      if (kvError) {
        console.error("Error fetching messages from KV:", kvError);
        throw new Error("Failed to load messages");
      }

      let messages: Message[] = [];
      
      if (kvData && kvData.length > 0) {
        const messagesData = kvData[0].value;
        
        if (Array.isArray(messagesData)) {
          messages = messagesData.map((msg: any) => ({
            id: msg.id,
            clientId: msg.clientId,
            senderId: msg.senderId,
            senderRole: msg.senderRole,
            senderName: msg.senderName,
            subject: msg.subject,
            content: msg.content,
            isRead: msg.isRead,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
          }));
        }
      }

      console.log(`Loaded ${messages.length} messages`);
      setMessages(messages);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error(`Failed to load messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    setSending(true);
    try {
      if (!userId || !client || !newMessage.trim()) {
        throw new Error("Missing user, client, or message data");
      }

      console.log('Sending message to client:', userId);

      // Obter token de autenticação
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error("Not authenticated");
      }

      const accessToken = sessionData.session.access_token;

      // Enviar mensagem via API do servidor
      const response = await fetch(
        API_ENDPOINTS.messagesSend,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId: userId,
            subject: 'Admin Message',
            content: newMessage,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      console.log('Message sent successfully via API');

      toast.success("Message sent successfully");
      
      // Recarregar mensagens
      await loadMessages();
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to send message: ${errorMessage}`);
    } finally {
      setSending(false);
    }
  };

  const loadAllDocuments = async () => {
    setLoadingAllDocuments(true);
    try {
      if (!userId) {
        throw new Error("No user ID provided");
      }

      // 🔥 NOVO: Buscar via backend que usa Service Role Key
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error("Not authenticated");
      }

      const accessToken = sessionData.session.access_token;

      // Usar endpoint do backend para buscar todos os documentos com signed URLs
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/admin/client-documents/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load documents');
      }

      const data = await response.json();
      const documentsByYear: DocumentsByYear[] = data.documents || [];

      console.log(`✅ Loaded ${documentsByYear.length} years with documents from backend`);
      setAllDocuments(documentsByYear);
    } catch (error) {
      console.error("Error loading all documents:", error);
      toast.error(`Failed to load all documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setAllDocuments([]);
    } finally {
      setLoadingAllDocuments(false);
    }
  };

  const handleCreateTaxFiling = async (data: {
    year: number;
    pricingPresetId: string;
    customAmount?: number;
    discount?: {
      type: string;
      percentage: number;
      amount: number;
      referredBy?: string;
    };
    adminNotes?: string;
  }) => {
    const { year } = data;
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error("Please log in again");
      }

      const response = await fetch(
        API_ENDPOINTS.taxFilingCreate,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.session.access_token}`,
          },
          body: JSON.stringify({
            userId: userId,
            year: data.year,
            pricingPresetId: data.pricingPresetId,
            customAmount: data.customAmount,
            discount: data.discount,
            adminNotes: data.adminNotes,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create tax filing");
      }

      toast.success(`Tax filing for ${year} created successfully`);
      await loadClientData();
    } catch (error: any) {
      console.error("Error creating filing:", error);
      toast.error(error.message || "Failed to create tax filing");
      throw error;
    }
  };

  const fixTaxFilings = async () => {
    try {
      if (!userId) {
        throw new Error("Missing user ID");
      }

      toast.info("Fixing corrupted tax filings...");

      // Chamar a função de fix para corrigir os tax filings
      const result = await fixUserTaxFilings(userId);

      if (result.success) {
        if (result.fixed > 0) {
          toast.success(`Fixed ${result.fixed} corrupted tax filing(s)!`);
        } else {
          toast.success("No corrupted tax filings found");
        }
        
        // Recarregar dados do cliente
        await loadClientData();
      } else {
        throw new Error(result.errors.join(', ') || 'Unknown error');
      }
    } catch (error) {
      console.error("Error fixing tax filings:", error);
      toast.error(`Failed to fix tax filings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading client data...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Client not found</p>
          <Button onClick={() => navigate("/admin")} className="mt-4">
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Clients
            </Button>
            
            <div className="flex-1 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xl">
                  {client.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="font-semibold text-xl">{client.name}</h1>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
            </div>

            <Badge 
              variant="outline" 
              className={`${client.onboardingComplete 
                ? "bg-green-100 text-green-700 border-green-300" 
                : "bg-yellow-100 text-yellow-700 border-yellow-300"
              } border`}
            >
              {client.onboardingComplete ? "Onboarded" : "Pending Onboarding"}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info */}
            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h2>
              
              {/* Sempre mostrar informações básicas */}
              <div className="space-y-4">
                {/* Informações básicas sempre disponíveis */}
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{client.name || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </p>
                  <p className="font-medium">{client.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Account Created
                  </p>
                  <p className="font-medium">{new Date(client.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-mono text-xs text-gray-600 break-all">{client.id}</p>
                </div>

                {/* Divisor */}
                <div className="border-t pt-4 mt-4"></div>

                {/* Informações detalhadas do onboarding */}
                {client.personalInfo ? (
                  <>
                    {client.personalInfo.phone && (
                      <div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          Phone
                        </p>
                        <p className="font-medium">{client.personalInfo.phone}</p>
                      </div>
                    )}

                    {client.personalInfo.dateOfBirth && (
                      <div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Date of Birth
                        </p>
                        <p className="font-medium">{client.personalInfo.dateOfBirth}</p>
                      </div>
                    )}

                    {client.personalInfo.sin && (
                      <div>
                        <p className="text-sm text-gray-500">SIN</p>
                        <p className="font-medium font-mono">{client.personalInfo.sin}</p>
                      </div>
                    )}

                    {client.personalInfo.address && (
                      <div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Address
                        </p>
                        <p className="font-medium">{client.personalInfo.address}</p>
                        {client.personalInfo.city && (
                          <p className="font-medium">
                            {client.personalInfo.city}, {client.personalInfo.province} {client.personalInfo.postalCode}
                          </p>
                        )}
                      </div>
                    )}

                    {client.personalInfo.maritalStatus && (
                      <div>
                        <p className="text-sm text-gray-500">Marital Status</p>
                        <p className="font-medium capitalize">{client.personalInfo.maritalStatus.replace('-', ' ')}</p>
                      </div>
                    )}

                    {client.personalInfo.residenceStatus && (
                      <div>
                        <p className="text-sm text-gray-500">Residence Status</p>
                        <p className="font-medium capitalize">{client.personalInfo.residenceStatus.replace('-', ' ')}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-900 mb-1">
                          Additional Information Pending
                        </p>
                        <p className="text-xs text-yellow-700">
                          The client hasn't completed the onboarding process yet. 
                          Additional details like phone, address, SIN, and tax information 
                          will appear here once they complete their profile.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Account Info */}
            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4">Account Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Joined</p>
                  <p className="font-medium">{new Date(client.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Filings</p>
                  <p className="font-medium">{client.taxFilings?.length || 0}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Tax Filings */}
          <div className="lg:col-span-2">
            {/* All Client Documents Section */}
            <Card className="p-6 mb-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-green-600" />
                  All Client Documents
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  {allDocuments.reduce((total, year) => total + year.files.length, 0)} files
                </Badge>
              </h2>

              {loadingAllDocuments ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : allDocuments.length > 0 ? (
                <div className="space-y-4">
                  {allDocuments.map((yearData) => (
                    <div key={yearData.year} className="border rounded-lg overflow-hidden">
                      {/* Year Header */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Tax Year {yearData.year}</h3>
                              <p className="text-xs text-gray-500">{yearData.files.length} document{yearData.files.length !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Documents Grid */}
                      <div className="p-4 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {yearData.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate text-gray-900">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {getCategoryName(file.category)} • {formatFileSize(file.size)}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {file.url && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(file.url, '_blank')}
                                  className="flex-shrink-0 hover:bg-blue-50"
                                >
                                  <Download className="w-4 h-4 text-blue-600" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No documents uploaded yet</p>
                  <p className="text-xs text-gray-400 mt-1">Documents will appear here once the client uploads them</p>
                </div>
              )}
            </Card>

            {/* CRA ASSESSMENT SECTION - Mostrar para cada ano que tem documentos */}
            {allDocuments.map((yearData) => (
              <CRAAssessmentSection
                key={`cra-${yearData.year}`}
                userId={userId!}
                clientName={client.name}
                clientEmail={client.email}
                year={yearData.year}
                onSave={loadClientData}
              />
            ))}

            {/* Tax Filings Section - NEW COMPONENT */}
            <TaxFilingsSection 
              userId={userId!}
              clientName={client.name}
            />

            {/* Messages Section */}
            <Card className="p-6 mt-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Messages
              </h2>

              {/* Messages List */}
              <div className="mb-4 max-h-[400px] overflow-y-auto space-y-3">
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isFromAdmin = msg.senderRole === 'admin';
                    const date = new Date(msg.createdAt);

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isFromAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isFromAdmin
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold">
                              {isFromAdmin ? 'You' : msg.senderName}
                            </span>
                            <span className={`text-xs ${isFromAdmin ? 'text-blue-100' : 'text-gray-500'}`}>
                              {date.toLocaleDateString()} • {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Send Message Form */}
              <div className="border-t pt-4">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message to the client..."
                  className="min-h-[100px] mb-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Send Message
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Submit Report Modal */}
      {showSubmitReportModal && selectedFilingYear && (
        <SubmitReportModalWithSummary
          isOpen={showSubmitReportModal}
          onClose={() => {
            setShowSubmitReportModal(false);
            setSelectedFilingYear(null);
          }}
          client={{
            id: client.id,
            name: client.name,
            email: client.email
          }}
          filingYear={selectedFilingYear}
          onSuccess={loadClientData}
        />
      )}

      {/* Upload Documents Modal */}
      {showUploadDocumentsModal && selectedFilingYear && (
        <UploadDocumentsModal
          isOpen={showUploadDocumentsModal}
          onClose={() => {
            setShowUploadDocumentsModal(false);
            setSelectedFilingYear(null);
          }}
          clientId={client.id}
          clientName={client.name}
          year={selectedFilingYear}
          onSuccess={async () => {
            await loadAllDocuments();
            if (selectedFilingYear) {
              // Limpar cache para forçar reload
              setFilesCache(prev => {
                const newCache = { ...prev };
                delete newCache[selectedFilingYear];
                return newCache;
              });
              await loadFilesForYear(selectedFilingYear);
            }
          }}
        />
      )}

      {/* Create Tax Filing Modal */}
      {showCreateTaxFilingModal && (() => {
        console.log("🔍 Full client.taxFilings:", client.taxFilings);
        
        // FIXED: Properly extract years and filter out invalid data
        const existingYears: number[] = [];
        
        if (Array.isArray(client.taxFilings)) {
          client.taxFilings.forEach(f => {
            console.log("📋 Processing tax filing:", f);
            
            // Check if filing is a valid object with a year property
            if (f && typeof f === 'object' && 'year' in f) {
              const year = f.year;
              
              // Ensure year is a number
              if (typeof year === 'number' && !isNaN(year)) {
                existingYears.push(year);
              } else {
                console.warn('⚠️ Invalid year type:', typeof year, year);
              }
            } else {
              console.warn('⚠️ Invalid filing structure:', f);
            }
          });
        }
        
        console.log("✅ Final existingYears array:", existingYears);
        
        return (
          <CreateTaxFilingModal
            isOpen={showCreateTaxFilingModal}
            onClose={() => setShowCreateTaxFilingModal(false)}
            onSubmit={handleCreateTaxFiling}
            existingYears={existingYears}
          />
        );
      })()}

      {/* Fix Tax Filings Button */}
      <Button
        onClick={fixTaxFilings}
        className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        <Wrench className="w-4 h-4 mr-2" />
        Fix Tax Filings
      </Button>
    </div>
  );
}