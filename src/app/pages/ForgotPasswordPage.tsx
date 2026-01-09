import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl mb-2">{t("forgotPassword.title")}</h1>
          <p className="text-gray-600">{t("forgotPassword.subtitle")}</p>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl text-gray-900">{t("forgotPassword.successTitle")}</h2>
              <p className="text-gray-600">{t("forgotPassword.successMessage")}</p>
              <p className="text-sm text-gray-500">{t("forgotPassword.checkSpam")}</p>
            </div>
            <div className="pt-4">
              <Link to="/login" className="text-blue-600 hover:underline inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t("forgotPassword.backToLogin")}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <p className="text-sm text-gray-500 mt-2">
                  {t("forgotPassword.emailHint")}
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("clientPortal.uploading") : t("forgotPassword.sendButton")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t("forgotPassword.backToLogin")}
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
