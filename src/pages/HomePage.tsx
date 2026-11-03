import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DataService } from '../services/dataService';
import { ServiceItem, OfferItem } from '../types';
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Palette,
  MapPin,
  TrendingUp,
  Award,
  Shield,
  HelpCircle,
  MessageSquare,
  Mail,
  Instagram,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    DataService.getServices().then(setServices);
    DataService.getOffers().then(setOffers);
    DataService.getSettings().then(setSettings);
  }, []);

  const whatsappNumber = settings.whatsapp_support_number || '+91 98765 43210';
  const email = settings.business_email || 'contact@digwebexpert.com';
  const instagram = settings.instagram_handle || '@digwebexpert';
  const founder = settings.founder_name || 'Harshadsinh Solanki';
  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const getServiceIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Globe className="w-5 h-5 text-[#1D4ED8]" />;
      case 1:
        return <Palette className="w-5 h-5 text-indigo-600" />;
      case 2:
        return <MapPin className="w-5 h-5 text-[#D4AF57]" />;
      default:
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
    }
  };

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1630] via-[#0E1E42] to-[#0B1630] text-white pt-16 sm:pt-20 pb-20 sm:pb-28 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[#D4AF57] border border-[#D4AF57]/30 tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.hero.kicker}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
                {t.hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {t.hero.subheading}
              </p>

              {/* Two Primary CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/register')}
                  className="px-6 py-3.5 text-sm sm:text-base font-bold text-[#0B1630] bg-[#D4AF57] hover:bg-[#e4c270] rounded-xl shadow-lg transition-all active:scale-[0.99] flex items-center gap-2 cursor-pointer"
                >
                  <span>{t.hero.becomePartnerBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  {t.hero.loginBtn}
                </button>
              </div>

              {/* 3 Proof Bullet Strip */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF57] shrink-0" />
                  <span>{t.hero.stat1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF57] shrink-0" />
                  <span>{t.hero.stat2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF57] shrink-0" />
                  <span>{t.hero.stat3}</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Impact Visual Asset */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/70 aspect-[16/10] bg-slate-900">
                <img
                  src="/src/assets/images/hero_corporate_partnership_1793639600789.jpg"
                  alt="DigWeb Expert Corporate Partnership"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1630]/90 via-[#0B1630]/20 to-transparent flex items-end p-5">
                  <div className="text-left">
                    <p className="text-xs uppercase font-semibold text-[#D4AF57] tracking-wider">
                      DIGWEB EXPERT NETWORK
                    </p>
                    <p className="text-sm font-medium text-white">
                      Connecting Businesses with High-Growth Digital Solutions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT DIGWEB EXPERT & WHAT IS REFERRAL PARTNERSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 sm:p-12 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-block text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
                {t.about.subtitle}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1630]">
                {t.about.title}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t.about.paragraph1}
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t.about.paragraph2}
              </p>
            </div>

            <div className="lg:col-span-4 bg-[#F8FAFC] border border-slate-200 rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0B1630] flex items-center justify-center text-[#D4AF57]">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-[#0B1630]">
                {founder}
              </div>
              <p className="text-xs text-slate-500">
                Founder, DigWeb Expert
              </p>
              <div className="text-xs text-slate-600 italic pt-2 border-t border-slate-200">
                "Our mission is to build lasting trust, empower local businesses with digital technology, and share prosperity with our partners."
              </div>
            </div>
          </div>

          {/* What is Referral Partnership Box */}
          <div className="pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#0B1630] text-white rounded-xl p-6 sm:p-8 space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-[#D4AF57]">
                {t.about.whatIsTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.about.whatIsDesc}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-[#0B1630]">
                {t.about.whyJoinTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <p className="font-semibold text-slate-900 mb-0.5">{t.about.why1Title}</p>
                  <p className="text-slate-500">{t.about.why1Desc}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <p className="font-semibold text-slate-900 mb-0.5">{t.about.why2Title}</p>
                  <p className="text-slate-500">{t.about.why2Desc}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <p className="font-semibold text-slate-900 mb-0.5">{t.about.why3Title}</p>
                  <p className="text-slate-500">{t.about.why3Desc}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <p className="font-semibold text-slate-900 mb-0.5">{t.about.why4Title}</p>
                  <p className="text-slate-500">{t.about.why4Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR SERVICES */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
            DIGWEB EXPERT PORTFOLIO
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1630] tracking-tight">
            {t.services.title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, idx) => {
            const title = language === 'hi' && service.service_name_hi ? service.service_name_hi : service.service_name;
            const desc = language === 'hi' && service.description_hi ? service.description_hi : service.description;
            const commRules = language === 'hi' && service.commission_rules_hi ? service.commission_rules_hi : service.commission_rules;

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow p-6 sm:p-7 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {getServiceIcon(idx)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0B1630]">
                        {title}
                      </h3>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Service 0{idx + 1}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {desc}
                  </p>

                  {/* Benefits */}
                  {Array.isArray(service.benefits) && service.benefits.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <div className="text-xs font-semibold text-slate-900">
                        {t.services.benefitsTitle}:
                      </div>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {service.benefits.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Commission Rule */}
                {commRules && (
                  <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs bg-slate-50 -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 p-4 rounded-b-2xl">
                    <span className="font-semibold text-[#0B1630]">Partner Rule: </span>
                    <span className="text-slate-600">{commRules}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CURRENT OFFERS & COMMISSION INFORMATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B1630] text-white rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF57] mb-1">
                DYNAMIC REWARDS
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {t.services.currentOffers}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF57] hover:underline"
            >
              <span>{t.nav.becomePartner}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Offers list */}
          {offers.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm bg-slate-900/60 rounded-xl">
              {t.services.noOffers}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map((offer) => {
                const title = language === 'hi' && offer.title_hi ? offer.title_hi : offer.title;
                const desc = language === 'hi' && offer.description_hi ? offer.description_hi : offer.description;
                const terms = language === 'hi' && offer.terms_hi ? offer.terms_hi : offer.terms;

                return (
                  <div
                    key={offer.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#D4AF57] bg-[#D4AF57]/15 px-2.5 py-0.5 rounded border border-[#D4AF57]/30">
                          {offer.commission_value}
                        </span>
                        {offer.commission_type && (
                          <span className="text-[11px] text-slate-400">
                            {offer.commission_type}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    {terms && (
                      <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5 italic">
                        {terms}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* MANDATORY DISCLAIMER */}
          <div className="bg-slate-900/90 border border-slate-800 p-4.5 rounded-xl text-xs text-slate-300 leading-relaxed">
            <span className="text-[#D4AF57] font-semibold">Important Policy Notice: </span>
            <span>{t.services.commissionNotice}</span>
          </div>
        </div>
      </section>

      {/* 5. HOW PARTNERSHIP WORKS (5 STEPS) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
            STEP-BY-STEP WORKFLOW
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1630] tracking-tight">
            {t.howItWorks.title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Step 1 */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-2.5 shadow-xs">
            <div className="text-xs font-extrabold text-[#1D4ED8]">01</div>
            <h3 className="text-sm font-bold text-[#0B1630]">
              {t.howItWorks.step1Title.replace(/^Step 1:\s*/, '')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.howItWorks.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-2.5 shadow-xs">
            <div className="text-xs font-extrabold text-[#1D4ED8]">02</div>
            <h3 className="text-sm font-bold text-[#0B1630]">
              {t.howItWorks.step2Title.replace(/^Step 2:\s*/, '')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.howItWorks.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-2.5 shadow-xs">
            <div className="text-xs font-extrabold text-[#1D4ED8]">03</div>
            <h3 className="text-sm font-bold text-[#0B1630]">
              {t.howItWorks.step3Title.replace(/^Step 3:\s*/, '')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.howItWorks.step3Desc}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-2.5 shadow-xs">
            <div className="text-xs font-extrabold text-[#1D4ED8]">04</div>
            <h3 className="text-sm font-bold text-[#0B1630]">
              {t.howItWorks.step4Title.replace(/^Step 4:\s*/, '')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.howItWorks.step4Desc}
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-[#0B1630] text-white rounded-xl border border-slate-800 p-5 space-y-2.5 shadow-md">
            <div className="text-xs font-extrabold text-[#D4AF57]">05</div>
            <h3 className="text-sm font-bold text-[#D4AF57]">
              {t.howItWorks.step5Title.replace(/^Step 5:\s*/, '')}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.howItWorks.step5Desc}
            </p>
          </div>
        </div>

        {/* Clear representation notice */}
        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-600">
          {t.howItWorks.statusNote}
        </div>
      </section>

      {/* 6. PARTNER BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
              WHY PARTNER WITH DIGWEB EXPERT
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1630]">
              {t.benefits.title}
            </h2>
            <p className="text-slate-600 text-sm">
              {t.benefits.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
              <Award className="w-5 h-5 text-[#D4AF57]" />
              <p className="text-xs font-semibold text-slate-900">{t.benefits.b1}</p>
            </div>
            <div className="p-4.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
              <Shield className="w-5 h-5 text-[#1D4ED8]" />
              <p className="text-xs font-semibold text-slate-900">{t.benefits.b2}</p>
            </div>
            <div className="p-4.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <p className="text-xs font-semibold text-slate-900">{t.benefits.b3}</p>
            </div>
            <div className="p-4.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <p className="text-xs font-semibold text-slate-900">{t.benefits.b4}</p>
            </div>
            <div className="p-4.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <p className="text-xs font-semibold text-slate-900">{t.benefits.b5}</p>
            </div>
            <div className="p-4.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-2">
              <Sparkles className="w-5 h-5 text-[#D4AF57]" />
              <p className="text-xs font-semibold text-slate-900">{t.benefits.b6}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
            CLARIFICATIONS
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1630]">
            {t.faq.title}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4.5 sm:p-5 flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm hover:text-[#1D4ED8] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#D4AF57] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#1D4ED8]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. CONTACT SECTION & CTA BAR */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0B1630] via-[#102A56] to-[#0B1630] text-white rounded-2xl p-8 sm:p-12 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ready to Join DigWeb Expert Referral Program?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl">
                Register as an official partner in 2 minutes. Get your unique Partner ID, access marketing scripts, and submit client referrals.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/register')}
                  className="px-6 py-3 text-xs sm:text-sm font-bold text-[#0B1630] bg-[#D4AF57] hover:bg-[#e4c270] rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>{t.hero.becomePartnerBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/${cleanWaNumber}?text=Hello%20DigWeb%20Expert%2C%20I%20have%20a%20question%20about%20the%20Partner%20Program.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>{t.contact.chatBtn}</span>
                </a>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
              <div className="font-semibold text-[#D4AF57] pb-2 border-b border-slate-800">
                Direct Partner Desk
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Instagram className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>{instagram}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
