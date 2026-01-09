import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function OnboardingSuccessPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleContinue = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md p-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl mb-4">{t("onboardingSuccess.title")}</h1>
          <p className="text-gray-600 text-lg mb-2">{t("onboardingSuccess.subtitle")}</p>
          <p className="text-gray-500">{t("onboardingSuccess.description")}</p>
        </div>

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            {t("onboardingSuccess.nextSteps")}
          </p>
        </div>

        {/* Action Button */}
        <Button onClick={handleContinue} className="w-full" size="lg">
          {t("onboardingSuccess.accessPortal")}
        </Button>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {t("onboardingSuccess.contact")}
          </p>
        </div>
      </Card>
    </div>
  );
}
