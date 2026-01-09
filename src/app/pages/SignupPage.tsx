import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { toast } from "sonner";

export function SignupPage() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [name, setName] = useState("");
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

    if (password.length < 6) {
      setError(language === "fr" 
        ? "❌ Le mot de passe doit contenir au moins 6 caractères"
        : "❌ Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      console.log("Creating account for:", email, "with name:", name);
      await signUp(email, password, name);
      console.log("Account created successfully, navigating to onboarding");
      navigate("/onboarding");
    } catch (err: any) {
      console.error("Signup error details:", err);
      
      let errorMessage = err.message || "Failed to create account";
      
      // Handle specific error cases
      if (errorMessage === "EMAIL_CONFIRMATION_REQUIRED") {
        setError("");
        toast.success(language === "fr"
          ? "✅ Compte créé! Veuillez vérifier votre email pour confirmer votre compte avant de vous connecter."
          : "✅ Account created! Please check your email to confirm your account before logging in.");
        setLoading(false);
        return;
      }
      
      // Make error messages more user-friendly
      if (errorMessage.includes("User already registered") || 
          errorMessage.includes("already exists") ||
          errorMessage.includes("duplicate key")) {
        errorMessage = language === "fr"
          ? `⚠️ L'email ${email} est déjà enregistré. Veuillez utiliser la page de connexion à la place.`
          : `⚠️ The email ${email} is already registered. Please use the login page instead.`;
      } else if (errorMessage.includes("Invalid email")) {
        errorMessage = language === "fr"
          ? "❌ Veuillez entrer une adresse email valide."
          : "❌ Please enter a valid email address.";
      } else if (errorMessage.includes("Password")) {
        errorMessage = language === "fr"
          ? "❌ Le mot de passe doit contenir au moins 6 caractères."
          : "❌ Password must be at least 6 characters long.";
      } else if (errorMessage.includes("Failed to fetch")) {
        errorMessage = language === "fr"
          ? "❌ Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet."
          : "❌ Cannot connect to server. Please check your internet connection.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <SEO 
        title="Sign Up - DuoPro Services | Canadian Tax Specialist"
        description="Create your account to get started with professional Canadian tax services. Quick and secure registration."
        canonicalPath="/signup"
        lang={language}
      />
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">{t("clientPortal.signup")}</h1>
          <p className="text-gray-600">{t("clientPortal.subtitle")}</p>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">{t("clientPortal.name")}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label htmlFor="email">{t("clientPortal.email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <Label htmlFor="password">{t("clientPortal.password")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              placeholder="••••••••"
              minLength={6}
            />
            <p className="text-sm text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("clientPortal.uploading") : t("clientPortal.signUpButton")}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t("clientPortal.alreadyHaveAccount")}{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              {t("clientPortal.signInHere")}
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
            ← {t("header.about")}
          </Link>
        </div>
      </Card>
    </div>
  );
}