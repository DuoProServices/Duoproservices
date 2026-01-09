import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { supabase } from "../utils/supabaseClient";
import { isAdminEmail } from "../config/admins";
import { API_ENDPOINTS } from "../../config/api";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  Users, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  FileText,
  Mail,
  Calendar,
  Receipt,
  DollarSign,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { AdminMessageDialog } from "../components/AdminMessageDialog";
import { AssignCaseDialog } from "../components/AssignCaseDialog";
import { Badge } from "../components/ui/badge";

interface Client {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  personalInfo: any;
  taxFilings: any[];
  onboardingComplete: boolean;
  assignedAccountant?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function AdminClientsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [assignDialogData, setAssignDialogData] = useState<{ 
    clientId: string; 
    clientName: string; 
    year: number; 
    currentAssignedTo?: string; 
  } | null>(null);

  useEffect(() => {
    if (!user || !isAdminEmail(user.email)) {
      navigate("/login");
      return;
    }
    loadClients();
  }, [user]);

  const loadClients = async () => {
    setLoading(true);
    try {
      // Buscar sessão e token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error("Not authenticated");
      }

      const accessToken = sessionData.session.access_token;
      console.log('🔑 Got access token, fetching clients from server...');

      // Usar a rota do servidor que tem permissão para listar usuários
      const response = await fetch(
        API_ENDPOINTS.adminClients,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch clients');
      }

      const data = await response.json();
      console.log("Fetched clients from server:", data.clients);

      setClients(data.clients || []);
      
      if (!data.clients || data.clients.length === 0) {
        toast.info("No customers found. Users need to sign up first.");
      }
    } catch (error) {
      console.error("Error loading clients:", error);
      toast.error(`Failed to load customers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientStatus = (client: Client) => {
    if (!client.onboardingComplete) {
      return {
        label: "Pending Onboarding",
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
        icon: AlertCircle
      };
    }

    const activeFiling = client.taxFilings?.find(f => 
      f.status === "in-progress" || f.status === "under-review"
    );

    if (activeFiling) {
      if (activeFiling.status === "under-review") {
        return {
          label: "Needs Review",
          color: "bg-orange-100 text-orange-700 border-orange-300",
          icon: AlertCircle
        };
      }
      return {
        label: "In Progress",
        color: "bg-blue-100 text-blue-700 border-blue-300",
        icon: Clock
      };
    }

    return {
      label: "Active",
      color: "bg-green-100 text-green-700 border-green-300",
      icon: CheckCircle
    };
  };

  const getTaxFilingsCount = (client: Client) => {
    return client.taxFilings?.length || 0;
  };

  const getLatestFilingYear = (client: Client) => {
    if (!client.taxFilings || client.taxFilings.length === 0) return null;
    
    // Filter valid years only
    const years: number[] = [];
    client.taxFilings.forEach(f => {
      if (f && typeof f === 'object' && 'year' in f && typeof f.year === 'number') {
        years.push(f.year);
      }
    });
    
    if (years.length === 0) return null;
    years.sort((a, b) => b - a);
    return years[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{t("admin.customerDashboard")}</h1>
                <p className="text-sm text-gray-500">
                  {clients.length} {clients.length === 1 ? t("admin.customer") : t("admin.customers")} {t("admin.customersTotal")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={() => navigate("/admin/bookkeeping-dashboard")} 
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Receipt className="w-4 h-4 mr-2" />
                {t("admin.bookkeepingTitle")}
              </Button>
              <Button 
                onClick={() => navigate("/admin/financial-dashboard")} 
                className="bg-green-600 hover:bg-green-700"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                {t("admin.financialTitle")}
              </Button>
              
              {/* Separador Visual */}
              <div className="w-px h-8 bg-gray-300 mx-2"></div>
              
              <Button onClick={() => navigate("/admin")} variant="ghost">
                {t("admin.backToHub")}
              </Button>
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                {t("admin.clientPortal")}
              </Button>
              <Button onClick={() => navigate("/")} variant="ghost">
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search clients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Clients</p>
                <p className="text-2xl font-semibold mt-1">{clients.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Onboarded</p>
                <p className="text-2xl font-semibold mt-1">
                  {clients.filter(c => c.onboardingComplete).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Needs Review</p>
                <p className="text-2xl font-semibold mt-1">
                  {clients.filter(c => 
                    c.taxFilings?.some(f => f.status === "under-review")
                  ).length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Filings</p>
                <p className="text-2xl font-semibold mt-1">
                  {clients.reduce((sum, c) => 
                    sum + (c.taxFilings?.filter(f => 
                      f.status === "in-progress" || f.status === "under-review"
                    ).length || 0), 0
                  )}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
        </div>

        {/* Clients List */}
        <div className="space-y-4">
          {filteredClients.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchTerm ? "No clients found matching your search" : "No clients yet"}
              </p>
            </Card>
          ) : (
            filteredClients.map((client) => {
              const status = getClientStatus(client);
              const StatusIcon = status.icon;
              const latestYear = getLatestFilingYear(client);

              return (
                <Card 
                  key={client.id} 
                  className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/admin/client/${client.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-lg">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg">{client.name}</h3>
                          <Badge variant="outline" className={`${status.color} border`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-3">{client.email}</p>

                        <div className="flex items-center gap-6 text-sm flex-wrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              Joined {new Date(client.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {getTaxFilingsCount(client)} {getTaxFilingsCount(client) === 1 ? "filing" : "filings"}
                            </span>
                          </div>

                          {latestYear && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">
                                Latest: Tax Year {latestYear}
                              </span>
                            </div>
                          )}

                          {/* Assigned Accountant */}
                          {client.assignedAccountant ? (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                Managed by:{' '}
                                <span className="font-medium text-purple-600">
                                  {client.assignedAccountant.name}
                                </span>
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500 italic">
                                Unassigned
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClient({ id: client.id, name: client.name });
                          setMessageDialogOpen(true);
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </main>

      {/* Admin Message Dialog */}
      <AdminMessageDialog
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}
        clientId={selectedClient?.id || ""}
        clientName={selectedClient?.name || ""}
      />

      {/* Assign Case Dialog */}
      <AssignCaseDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        data={assignDialogData}
      />
    </div>
  );
}