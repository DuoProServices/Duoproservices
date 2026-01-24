import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { LogIn, Mail, Lock, UserPlus, KeyRound, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { toast } from 'sonner';

export default function LoginPage() {
  const { t, language } = useLanguage();
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [showSetupHint, setShowSetupHint] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
      
      // Check if admin
      if (email === 'admin@duoproservices.ca') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
      toast.success(language === 'en' 
        ? '✅ Welcome back!' 
        : '✅ Bienvenue!'
      );
    } catch (err: any) {
      console.error('Login error:', err);
      
      let errorMessage = err.message || 'Failed to sign in';
      
      // User-friendly error messages
      if (errorMessage.includes('Invalid login credentials') || 
          errorMessage.includes('Invalid email or password')) {
        errorMessage = language === 'en'
          ? '❌ Invalid email or password.'
          : '❌ Email ou mot de passe invalide.';
        setShowSetupHint(true); // Show setup hint
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = language === 'en'
          ? '❌ Cannot connect to server. Please check your internet connection.'
          : '❌ Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet.';
      }
      
      // ✅ REMOVED: Email confirmation check - all emails are auto-confirmed
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await resetPassword(email);
      
      toast.success(language === 'en' 
        ? '✅ Password reset link sent to your email!'
        : '✅ Lien de réinitialisation envoyé à votre email!'
      );
      
      setShowForgotPassword(false);
      setEmail('');
    } catch (err: any) {
      console.error('Reset password error:', err);
      
      let errorMessage = err.message || 'Failed to send reset email';
      
      if (errorMessage.includes('User not found')) {
        errorMessage = language === 'en'
          ? '❌ No account found with this email address.'
          : '❌ Aucun compte trouvé avec cette adresse email.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - DuoPro Services</title>
        <meta name="description" content="Login to your DuoPro Services client portal" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 pt-24 pb-20">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  {showForgotPassword ? (
                    <KeyRound className="w-8 h-8 text-blue-600" />
                  ) : (
                    <LogIn className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  {showForgotPassword 
                    ? (language === 'en' ? 'Reset Password' : 'Réinitialiser le mot de passe')
                    : t('nav.login')
                  }
                </h1>
                <p className="text-gray-600">
                  {showForgotPassword
                    ? (language === 'en' 
                      ? 'Enter your email to receive a reset link'
                      : 'Entrez votre email pour recevoir un lien de réinitialisation')
                    : (language === 'en' ? 'Access your client portal' : 'Accédez à votre portail client')
                  }
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {showForgotPassword ? (
                // FORGOT PASSWORD FORM
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading 
                      ? t('common.loading') 
                      : (language === 'en' ? 'Send Reset Link' : 'Envoyer le lien')
                    }
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setError('');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {language === 'en' ? '← Back to Login' : '← Retour à la connexion'}
                    </button>
                  </div>
                </form>
              ) : (
                // LOGIN FORM
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setError('');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {language === 'en' ? 'Forgot password?' : 'Mot de passe oublié?'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? t('common.loading') : t('nav.login')}
                  </button>

                  {/* Sign Up Link */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        {language === 'en' ? 'or' : 'ou'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-blue-600 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    {language === 'en' ? 'New here? Create Account' : 'Nouveau? Créer un compte'}
                  </button>

                  {/* Setup Hint - Only show when credentials are invalid */}
                  {showSetupHint && (
                    <div className="space-y-3">
                      {/* Setup Hint */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-amber-900 mb-1">
                              {language === 'en' ? '🔧 Admin Setup Options:' : '🔧 Options de configuration admin:'}
                            </h4>
                            <p className="text-xs text-amber-800 mb-3">
                              {language === 'en' 
                                ? 'Choose the appropriate option based on your situation:' 
                                : 'Choisissez l\'option appropriée selon votre situation:'}
                            </p>
                            <div className="space-y-2">
                              <button
                                type="button"
                                onClick={() => navigate('/direct-reset')}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg"
                              >
                                <KeyRound className="w-5 h-5" />
                                {language === 'en' ? '📋 VER INSTRUÇÕES (Recomendado)' : '📋 VOIR INSTRUCTIONS (Recommandé)'}
                              </button>
                              <button
                                type="button"
                                onClick={() => navigate('/auth-debug')}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                              >
                                <UserPlus className="w-4 h-4" />
                                {language === 'en' ? '🗑️ Deletar e Recriar Tudo' : '🗑️ Supprimer et recréer'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
            
            {/* Debug & Setup Links */}
            <div className="text-center mt-4 space-y-2">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => navigate('/direct-reset')}
                  className="text-xs text-purple-600 hover:text-purple-700 underline font-bold"
                >
                  📋 INSTRUÇÕES
                </button>
                <span className="text-gray-300">•</span>
                <button
                  onClick={() => navigate('/auth-debug')}
                  className="text-xs text-red-600 hover:text-red-700 underline font-bold"
                >
                  🗑️ RESETAR TUDO
                </button>
                <span className="text-gray-300">•</span>
                <button
                  onClick={() => navigate('/admin-diagnostic')}
                  className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  🔧 Diagnostic
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}