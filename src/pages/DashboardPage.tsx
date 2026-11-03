import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { DataService } from '../services/dataService';
import { ServiceItem, OfferItem, GuidelineItem, ResourceItem, LeadItem } from '../types';
import { formatDateTimeIST } from '../utils/date';
import {
  User,
  Hash,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  PlusCircle,
  FileText,
  Briefcase,
  HelpCircle,
  Share2,
  Phone,
  Mail,
  Instagram,
  ArrowRight,
  TrendingUp,
  LogOut,
  ExternalLink,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, partner, logout, refreshPartner } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'howItWorks' | 'servicesOffers' | 'guidelines' | 'resources' | 'support' | 'profile'
  >('overview');

  // Data states
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [guidelines, setGuidelines] = useState<GuidelineItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  // Lead Submission Form
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [serviceInterested, setServiceInterested] = useState('Website Development');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccessMsg, setLeadSuccessMsg] = useState(false);

  // Profile Edit
  const [editMobile, setEditMobile] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      onNavigate('/login');
      return;
    }

    DataService.getServices().then(setServices);
    DataService.getOffers().then(setOffers);
    DataService.getGuidelines().then(setGuidelines);
    DataService.getResources().then(setResources);
    DataService.getSettings().then(setSettings);

    if (partner) {
      setEditMobile(partner.mobile_number);
      setEditInstagram(partner.instagram_username || '');
      DataService.getLeadsByPartner(partner.id).then(setLeads);
    }
  }, [user, partner, onNavigate]);

  if (!partner) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#0B1630] border-t-[#D4AF57] rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-600">Loading partner profile...</p>
        </div>
      </div>
    );
  }

  const { date: regDate, time: regTime } = formatDateTimeIST(partner.registered_at);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !contactPerson.trim() || !contactNumber.trim()) return;

    setSubmittingLead(true);
    try {
      const newLead = await DataService.submitLead({
        partner_id: partner.id,
        business_name: businessName.trim(),
        contact_person: contactPerson.trim(),
        contact_number: contactNumber.trim(),
        service_interested: serviceInterested,
        city: city.trim() || null,
        notes: notes.trim() || null,
      });

      setLeads([newLead, ...leads]);
      setBusinessName('');
      setContactPerson('');
      setContactNumber('');
      setCity('');
      setNotes('');
      setLeadSuccessMsg(true);
      setTimeout(() => setLeadSuccessMsg(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await DataService.updatePartnerProfile(partner.id, {
        mobile_number: editMobile.trim(),
        instagram_username: editInstagram.trim() || null,
      });
      await refreshPartner();
      setProfileSuccessMsg(true);
      setTimeout(() => setProfileSuccessMsg(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const whatsappNumber = settings.whatsapp_support_number || '+91 98765 43210';
  const cleanWaNumber = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP WELCOME & CREDENTIALS BANNER */}
      <div className="bg-[#0B1630] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4AF57]/20 text-[#D4AF57] border border-[#D4AF57]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VERIFIED REFERRAL PARTNER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.dashboard.welcome} {partner.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Official Partner Account for DigWeb Expert Digital Solutions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('resources')}
              className="px-4 py-2 text-xs font-semibold text-[#0B1630] bg-[#D4AF57] hover:bg-[#e4c270] rounded-xl transition-all flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Marketing Scripts</span>
            </button>
            <button
              type="button"
              onClick={async () => {
                await logout();
                onNavigate('/');
              }}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.nav.logout}</span>
            </button>
          </div>
        </div>

        {/* Official Metadata Grid */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1.5 text-[11px] mb-1">
              <Hash className="w-3.5 h-3.5 text-[#D4AF57]" />
              {t.dashboard.partnerIdLabel}
            </span>
            <span className="font-mono font-bold text-sm text-[#D4AF57]">{partner.partner_code}</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1.5 text-[11px] mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {t.dashboard.registeredOn}
            </span>
            <span className="font-medium text-slate-200">{regDate}</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1.5 text-[11px] mb-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {t.dashboard.registeredAt}
            </span>
            <span className="font-medium text-slate-200 tabular-nums">{regTime}</span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1.5 text-[11px] mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {t.dashboard.statusLabel}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-400">
              {partner.account_status}
            </span>
          </div>
        </div>
      </div>

      {/* 2. DASHBOARD NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-medium scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#0B1630] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {t.dashboard.tabs.overview}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('howItWorks')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'howItWorks'
              ? 'bg-[#0B1630] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {t.dashboard.tabs.howItWorks}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('servicesOffers')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'servicesOffers'
              ? 'bg-[#0B1630] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {t.dashboard.tabs.servicesOffers}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guidelines')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'guidelines'
              ? 'bg-[#0B1630] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {t.dashboard.tabs.guidelines}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'resources'
              ? 'bg-[#0B1630] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {t.dashboard.tabs.resources}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'support'
              ? 'bg-[#0B1630] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {t.dashboard.tabs.support}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#0B1630] text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {t.dashboard.tabs.profile}
        </button>
      </div>

      {/* 3. TAB CONTENTS */}

      {/* TAB 1: OVERVIEW & LEAD SUBMISSION */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">{t.dashboard.stats.totalLeads}</span>
              <p className="text-2xl font-extrabold text-[#0B1630] mt-1 tabular-nums">{leads.length}</p>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">{t.dashboard.stats.wonLeads}</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums">
                {leads.filter((l) => l.status === 'Closed - Won' || l.status === 'Commission Paid').length}
              </p>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">{t.dashboard.stats.inDiscussion}</span>
              <p className="text-2xl font-extrabold text-[#1D4ED8] mt-1 tabular-nums">
                {leads.filter((l) => l.status === 'In Discussion').length}
              </p>
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">{t.dashboard.stats.pending}</span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums">
                {leads.filter((l) => l.status === 'Pending').length}
              </p>
            </div>
          </div>

          {/* 2-Column: Submit Lead Form + Referral History */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Submit Lead Form */}
            <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#0B1630]">
                  {t.dashboard.leadForm.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t.dashboard.leadForm.subtitle}
                </p>
              </div>

              {leadSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.dashboard.leadForm.successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmitLead} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1">
                    {t.dashboard.leadForm.businessName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder={t.dashboard.leadForm.businessNamePlaceholder}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1">
                      {t.dashboard.leadForm.contactPerson} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder={t.dashboard.leadForm.contactPersonPlaceholder}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1">
                      {t.dashboard.leadForm.contactNumber} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder={t.dashboard.leadForm.contactNumberPlaceholder}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1">
                      {t.dashboard.leadForm.serviceInterested}
                    </label>
                    <select
                      value={serviceInterested}
                      onChange={(e) => setServiceInterested(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8] bg-white"
                    >
                      <option value="Website Development">Website Development</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Google Business Profile">Google Business Profile (GBP)</option>
                      <option value="Meta Ads Management">Meta Ads Management</option>
                      <option value="Full Digital Package">Full Digital Package</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1">
                      {t.dashboard.leadForm.city}
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={t.dashboard.leadForm.cityPlaceholder}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1">
                    {t.dashboard.leadForm.notes}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.dashboard.leadForm.notesPlaceholder}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingLead}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#0B1630] hover:bg-[#102A56] rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#D4AF57]" />
                  <span>{submittingLead ? t.dashboard.leadForm.submittingLeadBtn : t.dashboard.leadForm.submitLeadBtn}</span>
                </button>
              </form>
            </div>

            {/* Referral Leads Table */}
            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#0B1630]">
                  {t.dashboard.leadsList.title}
                </h3>
                <span className="text-xs text-slate-500 tabular-nums">
                  {leads.length} Records
                </span>
              </div>

              {leads.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl space-y-2">
                  <p>{t.dashboard.leadsList.empty}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] font-semibold text-slate-700 uppercase border-y border-slate-200/80">
                      <tr>
                        <th className="py-2.5 px-3">{t.dashboard.leadsList.business}</th>
                        <th className="py-2.5 px-3">{t.dashboard.leadsList.service}</th>
                        <th className="py-2.5 px-3">{t.dashboard.leadsList.status}</th>
                        <th className="py-2.5 px-3">{t.dashboard.leadsList.commission}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.map((lead) => {
                        let statusColor = 'bg-slate-100 text-slate-700';
                        if (lead.status === 'Closed - Won' || lead.status === 'Commission Paid') {
                          statusColor = 'bg-emerald-50 text-emerald-700 font-semibold';
                        } else if (lead.status === 'In Discussion') {
                          statusColor = 'bg-blue-50 text-blue-700 font-semibold';
                        } else if (lead.status === 'Rejected') {
                          statusColor = 'bg-rose-50 text-rose-700';
                        }

                        return (
                          <tr key={lead.id} className="hover:bg-slate-50/70">
                            <td className="py-3 px-3">
                              <p className="font-semibold text-slate-900">{lead.business_name}</p>
                              <p className="text-[11px] text-slate-400">{lead.contact_person} · {lead.contact_number}</p>
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-slate-800">{lead.service_interested}</span>
                              {lead.city && <p className="text-[10px] text-slate-400">{lead.city}</p>}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded text-[11px] ${statusColor}`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 tabular-nums font-semibold text-slate-900">
                              {lead.commission_amount > 0 ? `₹${lead.commission_amount.toLocaleString('en-IN')}` : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOW PARTNERSHIP WORKS */}
      {activeTab === 'howItWorks' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1630]">
              {t.howItWorks.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="text-xs font-bold text-[#1D4ED8]">01. Find Local Businesses</div>
              <p className="text-xs text-slate-700 leading-relaxed">{t.howItWorks.step1Desc}</p>
            </div>
            <div className="p-4.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="text-xs font-bold text-[#1D4ED8]">02. Introduce DigWeb Expert</div>
              <p className="text-xs text-slate-700 leading-relaxed">{t.howItWorks.step2Desc}</p>
            </div>
            <div className="p-4.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="text-xs font-bold text-[#1D4ED8]">03. Connect Interested Clients</div>
              <p className="text-xs text-slate-700 leading-relaxed">{t.howItWorks.step3Desc}</p>
            </div>
            <div className="p-4.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="text-xs font-bold text-[#1D4ED8]">04. DigWeb Expert Handles the Client</div>
              <p className="text-xs text-slate-700 leading-relaxed">{t.howItWorks.step4Desc}</p>
            </div>
            <div className="p-4.5 rounded-xl border border-[#D4AF57]/40 bg-[#0B1630] text-white space-y-1.5">
              <div className="text-xs font-bold text-[#D4AF57]">05. Earn Your Commission</div>
              <p className="text-xs text-slate-300 leading-relaxed">{t.howItWorks.step5Desc}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-600">
            {t.howItWorks.statusNote}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES & OFFERS */}
      {activeTab === 'servicesOffers' && (
        <div className="space-y-8">
          {/* Services List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s, idx) => {
              const title = language === 'hi' && s.service_name_hi ? s.service_name_hi : s.service_name;
              const desc = language === 'hi' && s.description_hi ? s.description_hi : s.description;
              const rule = language === 'hi' && s.commission_rules_hi ? s.commission_rules_hi : s.commission_rules;

              return (
                <div key={s.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-[#0B1630]">{title}</h3>
                    <span className="text-[11px] text-slate-400">0{idx + 1}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                  {rule && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200/60">
                      <span className="font-semibold text-[#0B1630]">Commission Rule: </span>
                      {rule}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Active Offers */}
          <div className="bg-[#0B1630] text-white rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">
              {t.services.currentOffers}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map((off) => {
                const title = language === 'hi' && off.title_hi ? off.title_hi : off.title;
                const desc = language === 'hi' && off.description_hi ? off.description_hi : off.description;
                const terms = language === 'hi' && off.terms_hi ? off.terms_hi : off.terms;

                return (
                  <div key={off.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#D4AF57] bg-[#D4AF57]/15 px-2 py-0.5 rounded">
                        {off.commission_value}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white">{title}</h4>
                    <p className="text-xs text-slate-300">{desc}</p>
                    {terms && <p className="text-[11px] text-slate-400 italic pt-2">{terms}</p>}
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300">
              <span className="text-[#D4AF57] font-semibold">Policy Note: </span>
              <span>{t.services.commissionNotice}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PARTNERSHIP GUIDELINES */}
      {activeTab === 'guidelines' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-[#0B1630]">{t.nav.guidelines}</h2>
            <p className="text-xs text-slate-500 mt-1">Official partnership code of ethics and rules of engagement.</p>
          </div>

          <div className="space-y-4">
            {guidelines.map((g) => {
              const title = language === 'hi' && g.title_hi ? g.title_hi : g.title;
              const content = language === 'hi' && g.content_hi ? g.content_hi : g.content;

              return (
                <div key={g.id} className="p-5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0B1630]">{title}</h3>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {g.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{content}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: MARKETING RESOURCES */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#0B1630]">{t.dashboard.tabs.resources}</h2>
              <p className="text-xs text-slate-500 mt-1">Ready-to-use approved communication pitches and marketing text.</p>
            </div>

            <div className="space-y-4 pt-2">
              {resources.map((res) => {
                const title = language === 'hi' && res.title_hi ? res.title_hi : res.title;
                const desc = language === 'hi' && res.description_hi ? res.description_hi : res.description;

                return (
                  <div key={res.id} className="p-5 border border-slate-200 rounded-xl space-y-3 bg-white hover:border-[#1D4ED8]/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded">
                          {res.category}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 mt-1">{title}</h3>
                        {desc && <p className="text-xs text-slate-500">{desc}</p>}
                      </div>

                      {res.content_body && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(res.content_body || '', res.id)}
                          className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0B1630] hover:bg-[#102A56] text-white flex items-center gap-1.5 transition-all"
                        >
                          {copiedId === res.id ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{t.dashboard.resourcesSection.copied}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#D4AF57]" />
                              <span>{t.dashboard.resourcesSection.copyBtn}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {res.content_body && (
                      <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-lg text-xs font-sans text-slate-800 leading-relaxed select-all">
                        {res.content_body}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CONTACT & SUPPORT */}
      {activeTab === 'support' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#0B1630]">{t.contact.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{t.contact.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href={`https://wa.me/${cleanWaNumber}?text=Hello%20DigWeb%20Expert%2C%20Partner%20ID%3A%20${partner.partner_code}%20reporting%20in.`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 border border-slate-200 rounded-xl hover:border-emerald-500 transition-colors flex flex-col justify-between space-y-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">{t.contact.whatsapp}</p>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">{whatsappNumber}</p>
              </div>
              <span className="text-[11px] text-slate-400 group-hover:text-emerald-600 flex items-center gap-1 font-medium">
                <span>Start WhatsApp Chat</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </a>

            <a
              href={`mailto:${settings.business_email || 'contact@digwebexpert.com'}`}
              className="p-5 border border-slate-200 rounded-xl hover:border-[#1D4ED8] transition-colors flex flex-col justify-between space-y-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1D4ED8] flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">{t.contact.email}</p>
                <p className="text-sm font-bold text-[#0B1630] mt-0.5 truncate">{settings.business_email || 'contact@digwebexpert.com'}</p>
              </div>
              <span className="text-[11px] text-slate-400 group-hover:text-[#1D4ED8] flex items-center gap-1 font-medium">
                <span>Send Email</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </a>

            <a
              href={`https://instagram.com/${(settings.instagram_handle || 'digwebexpert').replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 border border-slate-200 rounded-xl hover:border-pink-500 transition-colors flex flex-col justify-between space-y-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">{t.contact.instagram}</p>
                <p className="text-sm font-bold text-[#0B1630] mt-0.5">{settings.instagram_handle || '@digwebexpert'}</p>
              </div>
              <span className="text-[11px] text-slate-400 group-hover:text-pink-600 flex items-center gap-1 font-medium">
                <span>Visit Instagram</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          </div>
        </div>
      )}

      {/* TAB 7: MY PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6 max-w-2xl">
          <div>
            <h2 className="text-xl font-bold text-[#0B1630]">{t.dashboard.profileSection.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{t.dashboard.profileSection.subtitle}</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            {t.dashboard.profileSection.editNotice}
          </div>

          {profileSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.dashboard.profileSection.savedSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.successModal.partnerName}
                </label>
                <input
                  type="text"
                  disabled
                  value={partner.full_name}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.dashboard.partnerIdLabel}
                </label>
                <input
                  type="text"
                  disabled
                  value={partner.partner_code}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 font-mono text-[#D4AF57] font-bold cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.login.email}
              </label>
              <input
                type="text"
                disabled
                value={partner.email}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  {t.register.mobile}
                </label>
                <input
                  type="tel"
                  required
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  {t.register.instagram}
                </label>
                <input
                  type="text"
                  value={editInstagram}
                  onChange={(e) => setEditInstagram(e.target.value)}
                  placeholder="@username"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0B1630] hover:bg-[#102A56] rounded-xl transition-all shadow-xs"
              >
                {savingProfile ? 'Saving...' : t.dashboard.profileSection.saveBtn}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
