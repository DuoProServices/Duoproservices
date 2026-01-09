import { projectId } from '../../utils/supabase/info';

// Base API URL for Edge Functions
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0`;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  signup: `${API_BASE_URL}/auth/signup`,
  session: `${API_BASE_URL}/auth/session`,
  
  // Documents
  documentsUpload: `${API_BASE_URL}/documents/upload`,
  documents: `${API_BASE_URL}/documents`,
  documentDelete: (id: string) => `${API_BASE_URL}/documents/${id}`,
  
  // Messages
  messages: (clientId: string) => `${API_BASE_URL}/messages/${clientId}`,
  messagesSend: `${API_BASE_URL}/messages/send`,
  messagesUnreadCount: (clientId: string) => `${API_BASE_URL}/messages/${clientId}/unread-count`,
  messagesMarkRead: (messageId: string) => `${API_BASE_URL}/messages/${messageId}/read`,
  
  // Admin
  adminClients: `${API_BASE_URL}/admin/clients`,
  adminClient: (userId: string) => `${API_BASE_URL}/admin/clients/${userId}`,
  adminClientFiles: (userId: string, year: string) => `${API_BASE_URL}/admin/clients/${userId}/files/${year}`,
  adminFilingStatus: (userId: string, year: string) => `${API_BASE_URL}/admin/clients/${userId}/filings/${year}/status`,
  adminFinancials: `${API_BASE_URL}/admin/financials`,
  adminNotifications: `${API_BASE_URL}/admin/notifications/send`,
  adminCreateBuckets: `${API_BASE_URL}/admin/create-buckets`,
  adminSetupPolicies: `${API_BASE_URL}/admin/setup-storage-policies`,
  adminTaxDocumentNotify: `${API_BASE_URL}/admin/tax-document/notify`,
  adminCraAssessmentSend: `${API_BASE_URL}/admin/cra-assessment/send`,
  
  // Tax Filing
  taxFilingCreate: `${API_BASE_URL}/tax-filing/create`,
  taxFilingSubmitReport: `${API_BASE_URL}/tax-filing/submit-report`,
  taxFilingApproveReport: `${API_BASE_URL}/tax-filing/approve-report`,
  taxFilingRejectReport: `${API_BASE_URL}/tax-filing/reject-report`,
  
  // Tax Documents & Preview
  taxDocumentsParse: `${API_BASE_URL}/tax-documents/parse`,
  taxDocumentsGet: (year: string) => `${API_BASE_URL}/tax-documents/${year}`,
  taxPreviewSave: `${API_BASE_URL}/tax-preview/save`,
  taxPreviewGet: (userId: string, year: string) => `${API_BASE_URL}/tax-preview/${userId}/${year}`,
  
  // Bookkeeping
  bookkeepingSummary: `${API_BASE_URL}/bookkeeping/summary`,
  bookkeepingExpenses: `${API_BASE_URL}/bookkeeping/expenses`,
  bookkeepingExpense: (id: string) => `${API_BASE_URL}/bookkeeping/expenses/${id}`,
  
  // Health check
  health: `${API_BASE_URL}/health`,
};