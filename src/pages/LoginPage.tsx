import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { login, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot Password Modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage(
        language === 'gu'
          ? 'કૃપા કરીને તમારું ઇમેઇલ અને પાસવર્ડ બંને દાખલ કરો.'
          : language === 'hi'
          ? 'कृपया अपना ईमेल और पासवर्ड दोनों दर्ज करें।'
          : 'Please enter both your email address and password.'
      );
      return;
    }

    setLoading(true);

    try {
      const res = await login(email.trim(), password);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
        setLoading(false);
        return;
      }

      onNavigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during sign in.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    if (!resetEmail.trim()) {
      setResetError('Please enter your email address.');
      return;
    }

    setResetLoading(true);
    try {
      const res = await resetPassword(resetEmail.trim());
      if (res.success) {
        setResetSuccess(true);
      } else {
        setResetError(res.error || 'Failed to send reset link.');
      }
    } catch {
      setResetError('An error occurred.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1630]/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#0B1630]">
              {t.login.resetTitle}
            </h3>
            <p className="text-xs text-slate-600">
              {t.login.resetDesc}
            </p>

            {resetSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.login.resetSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(false);
                    setResetSuccess(false);
                  }}
                  className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {resetError && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg">
                    {resetError}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1">
                    {t.login.email}
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    {t.login.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0B1630] rounded-lg"
                  >
                    {resetLoading ? 'Sending...' : t.login.sendResetBtn}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
        <div className="bg-[#0B1630] px-6 sm:px-8 py-7 text-white text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#D4AF57]/20 text-[#D4AF57] border border-[#D4AF57]/30 mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>PARTNER PORTAL ACCESS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t.login.title}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            {t.login.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-900">
              {t.login.email}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/10 text-slate-900"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-900">
                {t.login.password}
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-[11px] font-medium text-[#1D4ED8] hover:underline"
              >
                {t.login.forgotPassword}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/10 text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#1D4ED8] border-slate-300 focus:ring-[#1D4ED8]"
              />
              <span>{t.login.rememberMe}</span>
            </label>
          </div>

          {/* Sign In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 text-sm font-bold text-white bg-[#0B1630] hover:bg-[#102A56] disabled:bg-slate-400 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>{t.login.loggingInBtn}</span>
              ) : (
                <>
                  <span>{t.login.loginBtn}</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF57]" />
                </>
              )}
            </button>
          </div>

          {/* Registration Link */}
          <div className="text-center pt-3 text-xs text-slate-500">
            <span>{t.login.noAccount} </span>
            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className="font-semibold text-[#1D4ED8] hover:underline"
            >
              {t.login.registerLink}
            </button>
          </div>

          {/* Admin access footnote */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>{t.login.adminNote}</span>
            <button
              type="button"
              onClick={() => onNavigate('/admin')}
              className="text-[#D4AF57] hover:underline font-semibold flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>{t.login.goToAdmin}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
