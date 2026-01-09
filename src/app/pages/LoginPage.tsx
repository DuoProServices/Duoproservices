import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";

export function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with:", email);
      await signIn(email, password);
      console.log("Login successful, navigating to dashboard");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error details:", err);
      let errorMessage = err.message || "Failed to sign in. Please check your credentials.";
      
      // Make the error message more user-friendly
      if (errorMessage.includes("Invalid login credentials") || errorMessage.includes("Invalid")) {
        errorMessage = language === "fr" 
          ? "❌ Email ou mot de passe incorrect. Pas encore de compte? Cliquez sur 'Créer un compte' ci-dessous."
          : "❌ Email or password incorrect. Don't have an account yet? Click 'Sign Up Now' below to create one.";
      } else if (errorMessage.includes("Email not confirmed")) {
        errorMessage = language === "fr"
          ? "📧 Veuillez confirmer votre adresse email avant de vous connecter. Vérifiez votre boîte de réception."
          : "📧 Please confirm your email address before logging in. Check your inbox for the confirmation link.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <SEO 
        title={`Login - DuoPro Services | Canadian Tax Specialist`}
        description="Access your tax filing portal. Secure login for DuoPro Services clients."
        canonicalPath="/login"
        lang={language}
      />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("clientPortal.login")}</h1>
          <p className="text-gray-600">{t("clientPortal.subtitle")}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t("clientPortal.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t("clientPortal.password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link 
                to="/forgot-password" 
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                {t("clientPortal.forgotPassword")}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : t("clientPortal.signIn")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t("clientPortal.noAccount")}{" "}
            <Link 
              to="/signup" 
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              {t("clientPortal.signUpNow")}
            </Link>
          </p>
        </div>

        {/* First time user help */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>🆕 {language === "fr" ? "Première visite?" : "First time here?"}</strong><br />
            {language === "fr" 
              ? "Créez un compte en cliquant sur 'Créer un compte' ci-dessus. Ça ne prend qu'une minute!"
              : "Create a new account by clicking 'Sign Up Now' above. It only takes a minute!"}
          </p>
        </div>

        {/* Demo credentials for testing */}
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-800">
            <strong>🧪 {language === "fr" ? "Compte de test" : "Demo Account"}</strong><br />
            {language === "fr" ? "Email" : "Email"}: demo@canadiantaxpro.ca<br />
            {language === "fr" ? "Mot de passe" : "Password"}: Demo123!<br />
            <span className="text-green-600 italic">
              {language === "fr" 
                ? "Utilisez ces identifiants pour tester le système"
                : "Use these credentials to test the system"}
            </span>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link 
            to="/" 
            className="block text-center text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}