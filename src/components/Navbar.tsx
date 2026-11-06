import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Shield, Calendar } from 'lucide-react';
import { BookAppointmentModal } from './BookAppointmentModal';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { language, t } = useLanguage();
  const { user, partner, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <>
      <BookAppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        defaultPartnerCode={partner?.partner_code || null}
      />
    <header className="sticky top-0 z-40 w-full bg-[#0B1630] text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-17">
          {/* Zone 1: Single text element wordmark with gold accent */}
          <button
            type="button"
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2 text-left tracking-tight cursor-pointer focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0">
              DIGWEB <span className="text-[#D4AF57]">EXPERT</span>
            </span>
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button
              type="button"
              onClick={() => handleNavClick('/')}
              className={`hover:text-[#D4AF57] transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/' ? 'text-white font-semibold' : ''
              }`}
            >
              {t.nav.home}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/services')}
              className={`hover:text-[#D4AF57] transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/services' ? 'text-white font-semibold' : ''
              }`}
            >
              {t.nav.services}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/how-it-works')}
              className={`hover:text-[#D4AF57] transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/how-it-works' ? 'text-white font-semibold' : ''
              }`}
            >
              {t.nav.howItWorks}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/guidelines')}
              className={`hover:text-[#D4AF57] transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/guidelines' ? 'text-white font-semibold' : ''
              }`}
            >
              {t.nav.guidelines}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/contact')}
              className={`hover:text-[#D4AF57] transition-colors whitespace-nowrap shrink-0 ${
                currentPath === '/contact' ? 'text-white font-semibold' : ''
              }`}
            >
              {t.contact.title}
            </button>
          </nav>

          {/* Zone 3: Language selector + Primary Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Language Selector Dropdown */}
            <LanguageSelector variant="header" />

            {/* Book Appointment CTA */}
            <button
              type="button"
              onClick={() => setAppointmentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {language === 'gu'
                  ? 'એપોઇન્ટમેન્ટ બુક કરો'
                  : language === 'hi'
                  ? 'अपॉइंटमेंट बुक करें'
                  : 'Book Appointment'}
              </span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('/dashboard')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
                >
                  <User className="w-3.5 h-3.5 text-[#D4AF57]" />
                  <span>{t.nav.dashboard}</span>
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleNavClick('/admin')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#D4AF57] bg-slate-800 hover:bg-slate-700 rounded-lg border border-[#D4AF57]/30 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    handleNavClick('/');
                  }}
                  title={t.nav.logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('/login')}
                  className="px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white transition-colors whitespace-nowrap shrink-0"
                >
                  {t.nav.login}
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('/register')}
                  className="px-4 py-2 text-xs font-semibold text-[#0B1630] bg-[#D4AF57] hover:bg-[#e4c270] rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
                >
                  {t.nav.becomePartner}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <LanguageSelector variant="header" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0B1630] px-4 py-4 space-y-3">
          {/* Mobile Language Selector */}
          <div className="pb-3 border-b border-slate-800">
            <LanguageSelector
              variant="mobile"
              onLanguageChange={() => {
                // Keep open or update seamlessly
              }}
            />
          </div>

          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            <button
              type="button"
              onClick={() => handleNavClick('/')}
              className="text-left py-2 hover:text-white"
            >
              {t.nav.home}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/services')}
              className="text-left py-2 hover:text-white"
            >
              {t.nav.services}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/how-it-works')}
              className="text-left py-2 hover:text-white"
            >
              {t.nav.howItWorks}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/guidelines')}
              className="text-left py-2 hover:text-white"
            >
              {t.nav.guidelines}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('/contact')}
              className="text-left py-2 hover:text-white"
            >
              {t.contact.title}
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('/dashboard')}
                  className="w-full py-2.5 text-center text-xs font-semibold text-white bg-[#1D4ED8] rounded-lg"
                >
                  {t.nav.dashboard} ({partner?.partner_code || 'Partner'})
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleNavClick('/admin')}
                    className="w-full py-2 text-center text-xs font-semibold text-[#D4AF57] bg-slate-800 rounded-lg border border-[#D4AF57]/30"
                  >
                    Admin Console
                  </button>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    handleNavClick('/');
                  }}
                  className="w-full py-2 text-center text-xs text-rose-400 bg-slate-900 rounded-lg"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('/register')}
                  className="w-full py-2.5 text-center text-xs font-semibold text-[#0B1630] bg-[#D4AF57] rounded-lg"
                >
                  {t.nav.becomePartner}
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('/login')}
                  className="w-full py-2 text-center text-xs font-medium text-slate-300 hover:text-white"
                >
                  {t.nav.login}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAppointmentModalOpen(true);
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold text-white bg-emerald-600 rounded-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {language === 'gu'
                      ? 'એપોઇન્ટમેન્ટ બુક કરો'
                      : language === 'hi'
                      ? 'अपॉइंटमेंट बुक करें'
                      : 'Book Appointment'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
};
