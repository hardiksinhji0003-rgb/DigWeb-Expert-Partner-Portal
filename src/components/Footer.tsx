import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DataService } from '../services/dataService';
import { MessageSquare, Mail, Instagram, MapPin, ArrowUpRight, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    DataService.getSettings().then(setSettings);
  }, []);

  const whatsappNumber = settings.whatsapp_support_number || '+91 98765 43210';
  const email = settings.business_email || 'contact@digwebexpert.com';
  const instagram = settings.instagram_handle || '@digwebexpert';
  const founder = settings.founder_name || 'Harshadsinh Solanki';

  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#0B1630] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand & Founder */}
          <div className="space-y-4">
            <div className="text-xl font-extrabold tracking-tight text-white">
              DIGWEB <span className="text-[#D4AF57]">EXPERT</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Referral Partnership Registration and Information Portal. Connect local and growing enterprises with premier web development, graphic design, and performance advertising.
            </p>
            <div className="pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-md bg-slate-800/70 text-[#D4AF57] border border-[#D4AF57]/20 font-medium">
                <span>{t.brand.founder} ({founder})</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t.services.title}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/services')}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>1. {t.services.service1Name}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/services')}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>2. {t.services.service2Name}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/services')}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>3. {t.services.service3Name}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/services')}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>4. {t.services.service4Name}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Partner Hub
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.howItWorks}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/guidelines')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.guidelines}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/register')}
                  className="hover:text-[#D4AF57] font-medium transition-colors"
                >
                  {t.nav.becomePartner}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.login}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1 text-[11px] text-slate-500"
                >
                  <Shield className="w-3 h-3 text-[#D4AF57]" />
                  <span>Admin Access</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Contact */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t.contact.title}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a
                  href={`https://wa.me/${cleanWaNumber}?text=Hello%20DigWeb%20Expert%20Team%2C%20I%20am%20interested%20in%20the%20Referral%20Partner%20Program.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#D4AF57] transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{whatsappNumber}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 hover:text-[#D4AF57] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#D4AF57] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>{instagram}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{settings.office_city || 'Gujarat, India'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} DIGWEB EXPERT. {t.footer.rights}</p>
          <p className="text-center sm:text-right text-[11px] text-slate-400">
            {t.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
};
