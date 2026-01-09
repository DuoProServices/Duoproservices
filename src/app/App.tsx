import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Pricing } from "./components/Pricing";
import { Process } from "./components/Process";
import { Contact } from "./components/Contact";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { SEO } from "./components/SEO";
import { SimpleErrorBoundary } from "./components/SimpleErrorBoundary";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { OnboardingSuccessPage } from "./pages/OnboardingSuccessPage";
import { SimpleDashboardPage } from "./pages/SimpleDashboardPage";
import { TaxFilingDetailPage } from "./pages/TaxFilingDetailPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { AdminHubPage } from "./pages/AdminHubPage";
import { AdminClientsPage } from "./pages/AdminClientsPage";
import { AdminClientDetailPage } from "./pages/AdminClientDetailPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminFinancialDashboard } from "./pages/AdminFinancialDashboard";
import { AdminBookkeepingDashboard } from "./pages/AdminBookkeepingDashboard";
import { AdminMarketingDashboard } from "./pages/AdminMarketingDashboard";
import { ContentCalendarDashboard } from "./pages/ContentCalendarDashboard";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AdminProductivityDashboard } from "./pages/AdminProductivityDashboard";
import { SupabaseConnectionTest } from "./components/SupabaseConnectionTest";

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        canonicalPath="/"
        type="website"
      />
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Pricing />
        <Process />
        <Contact />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <SimpleErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/onboarding-success" element={<OnboardingSuccessPage />} />
              <Route path="/dashboard" element={<SimpleDashboardPage />} />
              <Route path="/tax-filing/:year" element={<TaxFilingDetailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/admin" element={<AdminHubPage />} />
              <Route path="/admin/clients" element={<AdminClientsPage />} />
              <Route path="/admin/client/:userId" element={<AdminClientDetailPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/financial-dashboard" element={<AdminFinancialDashboard />} />
              <Route path="/admin/bookkeeping-dashboard" element={<AdminBookkeepingDashboard />} />
              <Route path="/admin/marketing-dashboard" element={<AdminMarketingDashboard />} />
              <Route path="/admin/content-calendar" element={<ContentCalendarDashboard />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/productivity" element={<AdminProductivityDashboard />} />
              <Route path="/test-supabase" element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                  <SupabaseConnectionTest />
                </div>
              } />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </SimpleErrorBoundary>
  );
}