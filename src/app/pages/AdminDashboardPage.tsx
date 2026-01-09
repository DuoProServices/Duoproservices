import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabaseClient";
import { API_ENDPOINTS } from "../../config/api";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Loader2,
  Upload,
  Settings,
  FileText,
  Send
} from "lucide-react";
import { toast } from "sonner";
import { FILING_STATUSES, getStatusConfig } from "../config/filingStatus";
import { StorageDiagnostics } from "../components/admin/StorageDiagnostics";
import { RLSPolicyHelper } from "../components/admin/RLSPolicyHelper";
import { QuickDiagnosticButton } from "../components/admin/QuickDiagnosticButton";
import { MagicSetupButton } from "../components/admin/MagicSetupButton";
import { CreateBucketsButton } from "../components/admin/CreateBucketsButton";
import { DebugClientsButton } from "../components/admin/DebugClientsButton";
import { RLSInstructions } from "../components/admin/RLSInstructions";
import { BackendStatusChecker } from "../components/admin/BackendStatusChecker";

const isAdminEmail = (email: string | undefined) => {
  if (!email) return false;
  const adminEmails = [
    'gabriel@blumconsultoria.ca', 
    'admin@blumconsultoria.ca',
    'veprass@gmail.com'  // Added Verônica as admin
  ];
  return adminEmails.includes(email.toLowerCase());
};

interface Client {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  personalInfo: any;
  taxFilings: any[];
  onboardingComplete: boolean;
}

interface StatusStats {
  statusId: string;
  count: number;
  clients: Client[];
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 AdminDashboard mounted, user:', user?.email);
    
    if (!user || !isAdminEmail(user.email)) {
      console.log('❌ Not admin, redirecting to login');
      navigate("/login");
      return;
    }
    
    console.log('✅ Admin verified, loading clients...');
    loadClients();
  }, [user]);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📡 Fetching session...');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error("Not authenticated");
      }

      const accessToken = sessionData.session.access_token;
      console.log('🔑 Got access token, fetching clients...');

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
        console.error("❌ Error response:", errorData);
        throw new Error(errorData.error || "Failed to load clients");
      }

      const data = await response.json();
      console.log('✅ Loaded clients:', data.clients?.length || 0);
      setClients(data.clients || []);
    } catch (error) {
      console.error("❌ Error loading clients:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`Failed to load clients: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics by status
  const getStatusStats = (): StatusStats[] => {
    const stats: Record<string, StatusStats> = {};

    FILING_STATUSES.forEach(status => {
      stats[status.id] = {
        statusId: status.id,
        count: 0,
        clients: []
      };
    });

    clients.forEach(client => {
      // Get the most recent tax filing status
      if (client.taxFilings && client.taxFilings.length > 0) {
        const latestFiling = client.taxFilings.sort((a, b) => b.year - a.year)[0];
        const status = latestFiling.status || 'documents-pending';
        
        if (stats[status]) {
          stats[status].count++;
          stats[status].clients.push(client);
        }
      } else if (client.onboardingComplete) {
        // Has completed onboarding but no filings yet
        stats['documents-pending'].count++;
        stats['documents-pending'].clients.push(client);
      } else {
        // Still in onboarding
        stats['onboarding'].count++;
        stats['onboarding'].clients.push(client);
      }
    });

    return Object.values(stats);
  };

  const statusStats = getStatusStats();
  const filteredClients = selectedStatus 
    ? statusStats.find(s => s.statusId === selectedStatus)?.clients || []
    : clients;

  const iconMap: Record<string, any> = {
    CheckCircle,
    Clock,
    Upload,
    Settings,
    FileText,
    Send
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">
                  Overview of all client tax filings
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/admin")} variant="outline">
                Back to Admin Hub
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* RLS Instructions - CRÍTICO - Mostrar primeiro! */}
        <div className="mb-8">
          <RLSInstructions />
        </div>

        {/* Quick Diagnostic Button */}
        <div className="mb-8">
          <QuickDiagnosticButton />
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Clients</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">{clients.length}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  {statusStats.find(s => s.statusId === 'completed')?.count || 0}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">In Progress</p>
                <p className="text-3xl font-bold text-orange-900 mt-1">
                  {statusStats.filter(s => 
                    !['completed', 'onboarding', 'documents-pending'].includes(s.statusId)
                  ).reduce((sum, s) => sum + s.count, 0)}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-900 mt-1">
                  {statusStats.find(s => s.statusId === 'documents-pending')?.count || 0}
                </p>
              </div>
              <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Status Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Clients by Status</h2>
            {selectedStatus && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedStatus(null)}
              >
                Clear Filter
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statusStats.filter(stat => stat.count > 0).map((stat) => {
              const config = getStatusConfig(stat.statusId);
              if (!config) return null;

              const Icon = iconMap[config.icon] || Clock;
              const isSelected = selectedStatus === stat.statusId;

              return (
                <Card
                  key={stat.statusId}
                  className={`
                    p-5 cursor-pointer transition-all hover:shadow-lg
                    ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
                  `}
                  onClick={() => setSelectedStatus(isSelected ? null : stat.statusId)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stat.count}</p>
                      <p className="text-xs text-gray-500">
                        {stat.count === 1 ? 'client' : 'clients'}
                      </p>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{config.label.en}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {config.description.en}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Setup Buttons - Ordem correta: 1. Criar Buckets, 2. Criar Policies */}
        <div className="mb-8 space-y-6">
          {/* Debug Clients Button */}
          <DebugClientsButton />
          
          {/* Step 1: Create Buckets */}
          <CreateBucketsButton />
          
          {/* Step 2: Create Policies */}
          <MagicSetupButton />
        </div>

        {/* Client List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {selectedStatus 
                ? `Clients - ${getStatusConfig(selectedStatus)?.label.en}`
                : 'All Clients'
              }
            </h2>
            <Badge variant="outline" className="text-sm">
              {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'}
            </Badge>
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No clients found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredClients.map((client) => {
                const latestFiling = client.taxFilings?.[0];
                const status = latestFiling?.status || (client.onboardingComplete ? 'documents-pending' : 'onboarding');
                const statusConfig = getStatusConfig(status);
                const StatusIcon = statusConfig ? iconMap[statusConfig.icon] : Clock;

                return (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/client/${client.id}`)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{client.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{client.email}</p>
                      </div>

                      {statusConfig && (
                        <Badge variant="outline" className={`${statusConfig.color} border flex-shrink-0`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label.en}
                        </Badge>
                      )}

                      <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* RLS Policy Helper */}
        <div className="mt-8">
          <RLSPolicyHelper />
        </div>

        {/* Storage Diagnostics */}
        <div className="mt-8">
          <StorageDiagnostics />
        </div>

        {/* Backend Status Checker */}
        <div className="mt-8">
          <BackendStatusChecker />
        </div>
      </main>
    </div>
  );
}