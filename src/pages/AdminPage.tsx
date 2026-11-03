import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { DataService } from '../services/dataService';
import { Partner, OfferItem, ServiceItem, GuidelineItem, ResourceItem, LeadItem } from '../types';
import { formatDateTimeIST } from '../utils/date';
import {
  Shield,
  Search,
  UserCheck,
  UserX,
  Users,
  Briefcase,
  Gift,
  FileText,
  Share2,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { user, isAdmin, adminLogin, logout } = useAuth();

  // Admin login credentials state if not logged in as admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Tab
  const [activeTab, setActiveTab] = useState<
    'partners' | 'leads' | 'offers' | 'services' | 'guidelines' | 'resources' | 'settings'
  >('partners');

  // Data
  const [partners, setPartners] = useState<Partner[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [guidelines, setGuidelines] = useState<GuidelineItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [partnerStatusFilter, setPartnerStatusFilter] = useState<'All' | 'Active' | 'Suspended'>('All');

  // Modals & Forms
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ open: false, title: '', message: '', onConfirm: () => {} });

  // Add/Edit Offer Form
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Partial<OfferItem>>({
    title: '',
    description: '',
    commission_type: 'Percentage',
    commission_value: '',
    terms: '',
    is_active: true,
  });

  // Add/Edit Resource Form
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Partial<ResourceItem>>({
    title: '',
    category: 'WhatsApp Introduction Scripts',
    content_body: '',
    language: 'both',
    is_active: true,
  });

  // Settings form
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});
  const [settingsSaved, setSettingsSaved] = useState(false);

  const loadAllAdminData = async () => {
    const [pList, lList, oList, sList, gList, rList, sMap] = await Promise.all([
      DataService.getAllPartnersAdmin(),
      DataService.getAllLeadsAdmin(),
      DataService.getAllOffersAdmin(),
      DataService.getAllServicesAdmin(),
      DataService.getGuidelines(),
      DataService.getResources(),
      DataService.getSettings(),
    ]);

    setPartners(pList);
    setLeads(lList);
    setOffers(oList);
    setServices(sList);
    setGuidelines(gList);
    setResources(rList);
    setSettings(sMap);
    setSettingsForm(sMap);
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  const handleAdminAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await adminLogin(adminEmail.trim(), adminPassword);
      if (!res.success) {
        setAuthError(res.error || 'Admin verification failed.');
      } else {
        await loadAllAdminData();
      }
    } catch {
      setAuthError('An error occurred during verification.');
    } finally {
      setAuthLoading(false);
    }
  };

  // If not admin, show secure login prompt
  if (!isAdmin) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg overflow-hidden">
          <div className="bg-[#0B1630] p-6 text-white text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#D4AF57]/20 border border-[#D4AF57]/40 text-[#D4AF57] flex items-center justify-center mx-auto mb-2">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Admin Console Access</h1>
            <p className="text-xs text-slate-300">
              Restricted to authorized DigWeb Expert administrators.
            </p>
          </div>

          <form onSubmit={handleAdminAuthSubmit} className="p-6 space-y-4">
            {authError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@digwebexpert.com"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 text-xs font-bold text-white bg-[#0B1630] hover:bg-[#102A56] rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF57]" />
              <span>{authLoading ? 'Verifying...' : 'Authenticate Admin'}</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Return to Home
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Filtered partners
  const filteredPartners = partners.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.full_name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.mobile_number.includes(q) ||
      p.partner_code.toLowerCase().includes(q);

    const matchesStatus =
      partnerStatusFilter === 'All' || p.account_status === partnerStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleTogglePartnerStatus = (partnerId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setConfirmModal({
      open: true,
      title: `${nextStatus === 'Suspended' ? 'Suspend' : 'Reactivate'} Partner Account`,
      message: `Are you sure you want to change this partner's status to ${nextStatus}?`,
      onConfirm: async () => {
        await DataService.updatePartnerStatus(partnerId, nextStatus);
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadAllAdminData();
      },
    });
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer.title || !editingOffer.commission_value) return;

    await DataService.saveOffer(editingOffer);
    setOfferModalOpen(false);
    loadAllAdminData();
  };

  const handleDeleteOffer = (id: string) => {
    setConfirmModal({
      open: true,
      title: 'Delete Offer',
      message: 'Are you sure you want to delete this offer? This cannot be undone.',
      onConfirm: async () => {
        await DataService.deleteOffer(id);
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadAllAdminData();
      },
    });
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource.title || !editingResource.category) return;

    await DataService.saveResource(editingResource);
    setResourceModalOpen(false);
    loadAllAdminData();
  };

  const handleDeleteResource = (id: string) => {
    setConfirmModal({
      open: true,
      title: 'Delete Resource',
      message: 'Are you sure you want to delete this marketing script?',
      onConfirm: async () => {
        await DataService.deleteResource(id);
        setConfirmModal((prev) => ({ ...prev, open: false }));
        loadAllAdminData();
      },
    });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const [k, v] of Object.entries(settingsForm)) {
      await DataService.updateSetting(k, v);
    }
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
    loadAllAdminData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1630]/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-base text-slate-900">{confirmModal.title}</h3>
            </div>
            <p className="text-xs text-slate-600">{confirmModal.message}</p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0B1630] hover:bg-[#102A56] rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {offerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1630]/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[#0B1630]">
              {editingOffer.id ? 'Edit Offer' : 'Create New Offer'}
            </h3>
            <form onSubmit={handleSaveOffer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-900 mb-1">Offer Title (English)</label>
                <input
                  type="text"
                  required
                  value={editingOffer.title || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-1">Offer Title (Hindi)</label>
                <input
                  type="text"
                  value={editingOffer.title_hi || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, title_hi: e.target.value })}
                  placeholder="हिंदी शीर्षक (वैकल्पिक)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-1">Commission Value / Payout</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15% Project Value or ₹3,000 Flat"
                  value={editingOffer.commission_value || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, commission_value: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingOffer.description || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-1">Terms & Conditions</label>
                <textarea
                  rows={2}
                  value={editingOffer.terms || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, terms: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="offerActive"
                  checked={editingOffer.is_active ?? true}
                  onChange={(e) => setEditingOffer({ ...editingOffer, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#1D4ED8]"
                />
                <label htmlFor="offerActive" className="text-slate-700 font-medium">
                  Active Offer
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B1630] text-white font-semibold rounded-lg"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resource Modal */}
      {resourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1630]/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[#0B1630]">
              {editingResource.id ? 'Edit Resource' : 'Add Marketing Resource'}
            </h3>
            <form onSubmit={handleSaveResource} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-900 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingResource.title || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-1">Category</label>
                <select
                  value={editingResource.category}
                  onChange={(e) => setEditingResource({ ...editingResource, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="WhatsApp Introduction Scripts">WhatsApp Introduction Scripts</option>
                  <option value="Instagram Promotional Content">Instagram Promotional Content</option>
                  <option value="Business Introduction Messages">Business Introduction Messages</option>
                  <option value="Service Posters & Creatives">Service Posters & Creatives</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-900 mb-1">Script / Content Body</label>
                <textarea
                  rows={4}
                  value={editingResource.content_body || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, content_body: e.target.value })}
                  placeholder="Paste marketing pitch text that partners can copy with one click..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResourceModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B1630] text-white font-semibold rounded-lg"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-[#0B1630] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#D4AF57]/20 text-[#D4AF57] border border-[#D4AF57]/30">
            <Shield className="w-3.5 h-3.5" />
            <span>EXECUTIVE ADMIN CONSOLE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {t.admin.title}
          </h1>
          <p className="text-xs text-slate-400">
            {t.admin.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={async () => {
            await logout();
            onNavigate('/');
          }}
          className="self-start md:self-auto px-4 py-2 text-xs font-semibold text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
        >
          Exit Admin
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">{t.admin.totalPartners}</span>
          <p className="text-2xl font-extrabold text-[#0B1630] mt-1 tabular-nums">{partners.length}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">{t.admin.activePartners}</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums">
            {partners.filter((p) => p.account_status === 'Active').length}
          </p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">{t.admin.totalLeads}</span>
          <p className="text-2xl font-extrabold text-[#1D4ED8] mt-1 tabular-nums">{leads.length}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">{t.admin.activeOffers}</span>
          <p className="text-2xl font-extrabold text-[#D4AF57] mt-1 tabular-nums">
            {offers.filter((o) => o.is_active).length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-medium scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('partners')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'partners'
              ? 'bg-[#0B1630] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.admin.tabs.partners}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'leads'
              ? 'bg-[#0B1630] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.admin.tabs.leads} ({leads.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'offers'
              ? 'bg-[#0B1630] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.admin.tabs.offers}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'services'
              ? 'bg-[#0B1630] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.admin.tabs.services}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guidelines')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'guidelines'
              ? 'bg-[#0B1630] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.admin.tabs.guidelines}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'resources'
              ? 'bg-[#0B1630] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.admin.tabs.resources}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#0B1630] text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.admin.tabs.settings}
        </button>
      </div>

      {/* TAB 1: PARTNERS MANAGEMENT */}
      {activeTab === 'partners' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.admin.searchPartnersPlaceholder}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
              <span className="text-slate-500 font-medium">Status:</span>
              <button
                type="button"
                onClick={() => setPartnerStatusFilter('All')}
                className={`px-2.5 py-1 rounded-lg ${
                  partnerStatusFilter === 'All' ? 'bg-[#0B1630] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setPartnerStatusFilter('Active')}
                className={`px-2.5 py-1 rounded-lg ${
                  partnerStatusFilter === 'Active' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setPartnerStatusFilter('Suspended')}
                className={`px-2.5 py-1 rounded-lg ${
                  partnerStatusFilter === 'Suspended' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Suspended
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-700 uppercase border-y border-slate-200/80">
                <tr>
                  <th className="py-2.5 px-3">Partner ID</th>
                  <th className="py-2.5 px-3">Full Name</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Registered (IST)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPartners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No partners match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredPartners.map((partner) => {
                    const { full } = formatDateTimeIST(partner.registered_at);
                    return (
                      <tr key={partner.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 font-mono font-bold text-[#856318]">
                          {partner.partner_code}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-900">{partner.full_name}</p>
                          {partner.instagram_username && (
                            <p className="text-[11px] text-pink-600">@{partner.instagram_username}</p>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-slate-800">{partner.email}</p>
                          <p className="text-slate-500">{partner.mobile_number}</p>
                        </td>
                        <td className="py-3 px-3 tabular-nums text-slate-600">
                          {full}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              partner.account_status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {partner.account_status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleTogglePartnerStatus(partner.id, partner.account_status)}
                            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                              partner.account_status === 'Active'
                                ? 'text-rose-600 hover:bg-rose-50'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {partner.account_status === 'Active'
                              ? t.admin.suspendBtn
                              : t.admin.activateBtn}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CLIENT LEADS MANAGEMENT */}
      {activeTab === 'leads' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#0B1630]">Referral Leads Submitted by Partners</h3>
              <p className="text-xs text-slate-500">Review status, update discussions, and record commission payouts.</p>
            </div>
            <span className="text-xs text-slate-500 tabular-nums">{leads.length} Total Submissions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-700 uppercase border-y border-slate-200/80">
                <tr>
                  <th className="py-2.5 px-3">Business</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Partner Ref</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Commission (₹)</th>
                  <th className="py-2.5 px-3 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No client referral leads recorded yet.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const p = partners.find((x) => x.id === lead.partner_id);

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-900">{lead.business_name}</p>
                          <p className="text-[11px] text-slate-500">
                            {lead.contact_person} · {lead.contact_number}
                          </p>
                          {lead.notes && <p className="text-[11px] text-slate-400 italic mt-0.5">{lead.notes}</p>}
                        </td>
                        <td className="py-3 px-3 text-slate-800">{lead.service_interested}</td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-[#856318] font-bold">
                            {p ? p.partner_code : 'Partner'}
                          </span>
                          <p className="text-[10px] text-slate-400">{p?.full_name}</p>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={lead.status}
                            onChange={async (e) => {
                              await DataService.updateLeadStatus(
                                lead.id,
                                e.target.value as LeadItem['status']
                              );
                              loadAllAdminData();
                            }}
                            className="text-xs px-2 py-1 rounded border border-slate-300 bg-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="Closed - Won">Closed - Won</option>
                            <option value="Commission Paid">Commission Paid</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            defaultValue={lead.commission_amount}
                            onBlur={async (e) => {
                              const val = parseFloat(e.target.value) || 0;
                              if (val !== lead.commission_amount) {
                                await DataService.updateLeadStatus(lead.id, lead.status, val);
                                loadAllAdminData();
                              }
                            }}
                            className="w-24 px-2 py-1 rounded border border-slate-300 text-xs font-semibold tabular-nums"
                          />
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="text-[11px] text-emerald-600">Auto-saved</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: OFFERS MANAGEMENT */}
      {activeTab === 'offers' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#0B1630]">Promotional Offers & Commission Terms</h3>
              <p className="text-xs text-slate-500">Create, edit, toggle active status, or delete seasonal incentives.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingOffer({
                  title: '',
                  description: '',
                  commission_type: 'Percentage',
                  commission_value: '',
                  terms: '',
                  is_active: true,
                });
                setOfferModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0B1630] hover:bg-[#102A56] rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF57]" />
              <span>{t.admin.addOfferBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((offer) => (
              <div key={offer.id} className="p-4 border border-slate-200 rounded-xl space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#856318] bg-[#D4AF57]/15 px-2 py-0.5 rounded">
                    {offer.commission_value}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingOffer(offer);
                        setOfferModalOpen(true);
                      }}
                      className="p-1 text-slate-500 hover:text-[#1D4ED8]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{offer.title}</h4>
                <p className="text-xs text-slate-600">{offer.description}</p>
                {offer.terms && <p className="text-[11px] text-slate-400 italic">{offer.terms}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SERVICES MANAGEMENT */}
      {activeTab === 'services' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-bold text-base text-[#0B1630]">Services Portfolio & Commission Rules</h3>
            <p className="text-xs text-slate-500">Configure descriptions and partner commission policies for the 4 core services.</p>
          </div>

          <div className="space-y-4">
            {services.map((svc) => (
              <div key={svc.id} className="p-4 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{svc.service_name}</h4>
                  <span className="text-xs text-slate-400">Order: {svc.display_order}</span>
                </div>
                <p className="text-xs text-slate-600">{svc.description}</p>
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700">
                  <span className="font-semibold text-[#0B1630]">Commission Rules: </span>
                  {svc.commission_rules}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GUIDELINES MANAGEMENT */}
      {activeTab === 'guidelines' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-bold text-base text-[#0B1630]">Partnership Guidelines & Policies</h3>
            <p className="text-xs text-slate-500">Compliance standards, role definitions, and fake leads policy.</p>
          </div>

          <div className="space-y-4">
            {guidelines.map((g) => (
              <div key={g.id} className="p-4 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{g.title}</h4>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {g.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{g.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: MARKETING RESOURCES MANAGEMENT */}
      {activeTab === 'resources' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#0B1630]">Marketing Scripts & Pitches</h3>
              <p className="text-xs text-slate-500">Provide high-converting copy and message templates for partners.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingResource({
                  title: '',
                  category: 'WhatsApp Introduction Scripts',
                  content_body: '',
                  language: 'both',
                  is_active: true,
                });
                setResourceModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0B1630] hover:bg-[#102A56] rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF57]" />
              <span>{t.admin.addResourceBtn}</span>
            </button>
          </div>

          <div className="space-y-4">
            {resources.map((res) => (
              <div key={res.id} className="p-4 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#1D4ED8]">
                      {res.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{res.title}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteResource(res.id)}
                    className="p-1 text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {res.content_body && (
                  <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700">
                    {res.content_body}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: APP SETTINGS & SUPPORT */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 max-w-xl">
          <div>
            <h3 className="font-bold text-base text-[#0B1630]">Contact & Application Settings</h3>
            <p className="text-xs text-slate-500">Manage official contact information rendered across landing and dashboard.</p>
          </div>

          {settingsSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                WhatsApp Support Number
              </label>
              <input
                type="text"
                value={settingsForm.whatsapp_support_number || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, whatsapp_support_number: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                Business Email Address
              </label>
              <input
                type="email"
                value={settingsForm.business_email || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, business_email: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={settingsForm.instagram_handle || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, instagram_handle: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                Founder Name
              </label>
              <input
                type="text"
                value={settingsForm.founder_name || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, founder_name: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={settingsForm.company_name || ''}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, company_name: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#0B1630] hover:bg-[#102A56] rounded-xl transition-all shadow-xs"
            >
              {t.admin.saveChangesBtn}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
