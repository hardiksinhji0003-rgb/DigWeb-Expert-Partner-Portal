import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Partner,
  ServiceItem,
  OfferItem,
  GuidelineItem,
  ResourceItem,
  AppSetting,
  LeadItem,
  AppointmentItem,
  Language,
} from '../types';

// Pre-seeded initial data matching the PostgreSQL migration
const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    service_name: 'Website Development',
    service_name_hi: 'वेबसाइट डेवलपमेंट',
    description: 'Custom high-performance business websites, landing pages, corporate portals, and e-commerce solutions built for speed, SEO, and conversions.',
    description_hi: 'हाई-परफॉर्मेंस बिजनेस वेबसाइट, लैंडिंग पेज, कॉर्पोरेट पोर्टल और ई-कॉमर्स समाधान जो स्पीड, एसईओ और कन्वर्जन के लिए तैयार किए जाते हैं।',
    benefits: [
      'Mobile responsive & ultra-modern UI/UX',
      'Google SEO structured architecture',
      'Lightning-fast speed & enterprise SSL security',
      'Free domain & hosting setup assistance',
    ],
    commission_rules: 'Commission payable upon project milestone completion and receipt of client payment.',
    commission_rules_hi: 'क्लाइंट द्वारा प्रोजेक्ट पेमेंट प्राप्त होने के बाद कमीशन देय होता है।',
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's2',
    service_name: 'Graphic Design',
    service_name_hi: 'ग्राफिक डिजाइन',
    description: 'Professional corporate branding, social media creatives, flyers, brochures, menus, and brand identity kits that capture customer attention.',
    description_hi: 'प्रोफेशनल कॉर्पोरेट ब्रांडिंग, सोशल मीडिया क्रिएटिव, फ्लायर्स, ब्रोशर और ब्रांड आइडेंटिटी किट जो ग्राहकों का ध्यान आकर्षित करते हैं।',
    benefits: [
      'Premium brand identity packages',
      'Engaging social media post designs',
      'Print-ready high resolution vector files',
      'Fast delivery & unlimited review revisions',
    ],
    commission_rules: 'Flat commission per monthly creative package or project contract closed.',
    commission_rules_hi: 'प्रत्येक क्लोज्ड मंथली पैकेज या प्रोजेक्ट पर निश्चित कमीशन।',
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's3',
    service_name: 'Google Business Profile (GBP)',
    service_name_hi: 'गूगल बिजनेस प्रोफाइल (GBP)',
    description: 'Local SEO ranking, profile verification, review management, and 3-pack Google Maps optimization to drive real local walk-in clients and phone inquiries.',
    description_hi: 'लोकल एसईओ रैंकिंग, प्रोफाइल वेरिफिकेशन, रिव्यू मैनेजमेंट और गूगल मैप्स 3-पैक ऑप्टिमाइजेशन जिससे स्थानीय ग्राहक और कॉल्स मिलें।',
    benefits: [
      'Top 3 Google Maps local ranking boost',
      'Spam protection & profile reinstatement',
      'Automated review generation system',
      'Monthly keyword search insight reports',
    ],
    commission_rules: 'Commission paid upon successful profile optimization and fee receipt.',
    commission_rules_hi: 'प्रोफाइल ऑप्टिमाइज़ेशन और फीस रिसीव होने के बाद कमीशन दिया जाता है।',
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 's4',
    service_name: 'Meta Ads Management',
    service_name_hi: 'मेटा ऐड्स मैनेजमेंट',
    description: 'High-ROI Facebook and Instagram advertising campaigns designed for hyper-local lead generation, customer inquiries, and e-commerce sales.',
    description_hi: 'फेसबुक और इंस्टाग्राम पर हाई-आरओआई विज्ञापन अभियान, जो लोकल लीड जनरेशन, इनक्वायरी और सेल्स के लिए तैयार किए जाते हैं।',
    benefits: [
      'Precise audience & local area targeting',
      'High-converting ad copy and creatives',
      'Daily campaign monitoring & ROAS tracking',
      'WhatsApp direct lead campaigns',
    ],
    commission_rules: 'Recurring commission on monthly retainer contracts as long as client stays active.',
    commission_rules_hi: 'क्लाइंट के एक्टिव रहने तक मासिक रिटेनर अनुबंधों पर आवर्ती कमीशन।',
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_OFFERS: OfferItem[] = [
  {
    id: 'off-1',
    title: 'Quarterly Partner Milestone Bonus',
    title_hi: 'त्रैमासिक पार्टनर माइलस्टोन बोनस',
    description: 'Earn top-tier commissions on every confirmed client website and full-stack digital marketing contract.',
    description_hi: 'हर सफल क्लाइंट वेबसाइट और डिजिटल मार्केटिंग सेटअप पर आकर्षक कमीशन अर्जित करें।',
    service_id: 's1',
    commission_type: 'Percentage',
    commission_value: '10% - 15% Project Value',
    terms: 'Commission is payable only after the referred client completes the agreed order and the required payment is successfully received, subject to the applicable partnership terms.',
    terms_hi: 'कमीशन केवल तभी देय होता है जब संदर्भित ग्राहक सहमत ऑर्डर पूरा कर लेता है और आवश्यक भुगतान सफलतापूर्वक प्राप्त हो जाता है।',
    start_date: '2025-01-01',
    end_date: '2025-12-31',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'off-2',
    title: 'Local Retailer Growth Package',
    title_hi: 'स्थानीय व्यापारी ग्रोथ पैकेज',
    description: 'Special dual service incentive: Google Maps 3-Pack Optimization + Hyper-local Instagram Lead Campaign.',
    description_hi: 'स्थानीय खुदरा विक्रेताओं के लिए विशेष कॉम्बो पैकेज: गूगल मैप्स 3-पैक + लोकल सोशल मीडिया ऐड्स।',
    service_id: 's3',
    commission_type: 'Fixed',
    commission_value: '₹2,500 - ₹5,000 per Closed Onboarding',
    terms: 'Applicable when the business owner subscribes to minimum 3 months service contract.',
    terms_hi: 'ग्राहक को न्यूनतम 3 महीने के सेवा अनुबंध का विकल्प चुनना होगा।',
    start_date: '2025-01-01',
    end_date: '2025-12-31',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_GUIDELINES: GuidelineItem[] = [
  {
    id: 'g1',
    title: 'Referral Partner Status & Representation',
    title_hi: 'रेफरल पार्टनर की स्थिति एवं प्रतिनिधित्व',
    category: 'Role & Ethics',
    content: 'Partners are independent referral liaisons, not full-time employees, authorized agents, or corporate directors of DigWeb Expert. Partners are strictly not permitted to execute legal agreements, issue formal price quotes, or guarantee project delivery timelines independently.',
    content_hi: 'पार्टनर स्वतंत्र रेफरल पार्टनर हैं, वे डिगवेब एक्सपर्ट के पूर्णकालिक कर्मचारी या कानूनी प्रतिनिधि नहीं हैं। पार्टनर कंपनी की ओर से स्वतंत्र रूप से अनुबंध पर हस्ताक्षर या वादे नहीं कर सकते।',
    display_order: 1,
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'g2',
    title: 'Commission Eligibility & Payment Conditions',
    title_hi: 'कमीशन पात्रता और भुगतान शर्तें',
    category: 'Commission',
    content: 'Commission is payable only after the referred client completes the agreed order and the required payment is successfully received into DigWeb Expert bank accounts. No advance payments or commissions are issued for exploratory inquiries or unverified leads.',
    content_hi: 'कमीशन केवल तभी देय होता है जब संदर्भित ग्राहक सहमत ऑर्डर पूरा कर लेता है और डिगवेब एक्सपर्ट के खाते में भुगतान प्राप्त हो जाता है। अनपेड लीड्स पर कोई कमीशन नहीं दिया जाता।',
    display_order: 2,
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'g3',
    title: 'Prohibited Misrepresentation & Fake Leads Policy',
    title_hi: 'गलत बयानी और फर्जी लीड्स पर सख्त नीति',
    category: 'Compliance',
    content: 'Providing fabricated contact numbers, spam lists, or promising non-existent discounts is strictly prohibited. Engaging in unethical lead submission will result in immediate termination of the partner account and forfeiture of all pending claims.',
    content_hi: 'फर्जी नंबर, स्पैम डेटा या गलत जानकारी सबमिट करना सख्त वर्जित है। गलत लीड्स देने पर पार्टनर अकाउंट तत्काल स्थायी रूप से निलंबित कर दिया जाएगा।',
    display_order: 3,
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'g4',
    title: 'Official Brand Usage Guidelines',
    title_hi: 'आधिकारिक ब्रांड उपयोग दिशानिर्देश',
    category: 'Branding',
    content: 'Referral partners are authorized to use the marketing scripts, flyers, and promotional media available in the Marketing Resources section. Modifying logos, fonts, or producing unauthorized company collateral is not allowed without written consent from DigWeb Expert.',
    content_hi: 'पार्टनर मार्केटिंग रिसोर्सेज में दी गई सामग्री का उपयोग कर सकते हैं। डिगवेब एक्सपर्ट के लोगो में बदलाव न करें।',
    display_order: 4,
    is_active: true,
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'WhatsApp Business Introduction Pitch',
    title_hi: 'व्हाट्सएप बिजनेस परिचय संदेश',
    description: 'Quick pitch to share with shop owners, cafes, doctors, and retailers who do not have a website.',
    description_hi: 'स्थानीय व्यापार मालिकों को भेजने के लिए त्वरित संदेश जिन्हें वेबसाइट या गूगल मैप्स रैंकिंग की आवश्यकता है।',
    category: 'WhatsApp Introduction Scripts',
    resource_url: null,
    content_body: 'Hello Sir/Ma\'am! I came across your business listing on Google. In today\'s market, over 80% of local customers check websites before making a purchase. DigWeb Expert helps local brands build lightning-fast, high-converting websites and rank in Google Maps top 3. Would you be open to a quick 5-minute complimentary digital audit of your online visibility?',
    language: 'both',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'res-2',
    title: 'Instagram DM Outreach Script',
    title_hi: 'इंस्टाग्राम डायरेक्ट मैसेज आउटरीच स्क्रिप्ट',
    description: 'Direct message template for reaching out to fashion boutiques, cafes, gyms, and freelance professionals.',
    description_hi: 'इंस्टाग्राम पर लोकल ब्रांड्स, कैफे, सैलून और कंसल्टेंट्स से संपर्क करने के लिए।',
    category: 'Instagram Promotional Content',
    resource_url: null,
    content_body: 'Hi [Business Name]! Really impressed by your page and offerings. Are you currently accepting customer orders only via Instagram DMs, or do you have an automated website checkout? Having your own official website builds 10x trust and automates orders 24/7. DigWeb Expert specializes in premium corporate & e-commerce websites. Let me know if you would like me to connect you with our technical lead!',
    language: 'both',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'res-3',
    title: 'Google Maps 3-Pack Optimization Pitch',
    title_hi: 'गूगल मैप्स 3-पैक ऑप्टिमाइजेशन पिच',
    description: 'Message for business owners wanting to rank on top when people search "near me".',
    description_hi: 'व्यापार मालिकों के लिए संदेश जो "near me" सर्च में शीर्ष पर आना चाहते हैं।',
    category: 'Business Introduction Messages',
    resource_url: null,
    content_body: 'Namaste! When customers in your area search for your services on Google Maps, does your business appear in the top 3? The top 3 listings get 70% of all calls and visits. DigWeb Expert provides Google Business Profile verification, ranking boost, and review growth. Let me connect you with our specialist team for a free review of your profile.',
    language: 'both',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_SETTINGS: Record<string, string> = {
  whatsapp_support_number: '+91 98765 43210',
  business_email: 'contact@digwebexpert.com',
  instagram_handle: '@digwebexpert',
  founder_name: 'Harshadsinh Solanki',
  company_name: 'DIGWEB EXPERT',
  office_city: 'Gujarat, India',
};

// Local storage keys for state persistence
const STORAGE_KEYS = {
  PARTNERS: 'dwe_portal_partners_db',
  SERVICES: 'dwe_portal_services_db',
  OFFERS: 'dwe_portal_offers_db',
  GUIDELINES: 'dwe_portal_guidelines_db',
  RESOURCES: 'dwe_portal_resources_db',
  SETTINGS: 'dwe_portal_settings_db',
  LEADS: 'dwe_portal_leads_db',
  APPOINTMENTS: 'dwe_portal_appointments_db',
  ADMIN_USERS: 'dwe_portal_admin_users_db',
};

// Helper for local storage mock
function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Local storage write error', e);
  }
}

// Generate unique Partner ID: DWE-00001 format
export function generatePartnerCode(existingPartnersCount: number = 0): string {
  const nextNum = existingPartnersCount + 1;
  return `DWE-${String(nextNum).padStart(5, '0')}`;
}

export const DataService = {
  // Services
  async getServices(): Promise<ServiceItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch error for services, falling back:', err);
      }
    }
    const stored = getLocal<ServiceItem[]>(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
    return stored.filter((s) => s.is_active);
  },

  async getAllServicesAdmin(): Promise<ServiceItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data) return data;
      } catch (err) {
        console.warn(err);
      }
    }
    return getLocal<ServiceItem[]>(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
  },

  async updateService(service: ServiceItem): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('services')
          .upsert({ ...service, updated_at: new Date().toISOString() });
        if (!error) return true;
      } catch (err) {
        console.warn(err);
      }
    }
    const services = getLocal<ServiceItem[]>(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
    const idx = services.findIndex((s) => s.id === service.id);
    if (idx >= 0) {
      services[idx] = { ...service, updated_at: new Date().toISOString() };
    } else {
      services.push({ ...service, updated_at: new Date().toISOString() });
    }
    setLocal(STORAGE_KEYS.SERVICES, services);
    return true;
  },

  // Offers
  async getOffers(): Promise<OfferItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch error for offers, falling back:', err);
      }
    }
    const stored = getLocal<OfferItem[]>(STORAGE_KEYS.OFFERS, DEFAULT_OFFERS);
    return stored.filter((o) => o.is_active);
  },

  async getAllOffersAdmin(): Promise<OfferItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn(err);
      }
    }
    return getLocal<OfferItem[]>(STORAGE_KEYS.OFFERS, DEFAULT_OFFERS);
  },

  async saveOffer(offer: Partial<OfferItem>): Promise<boolean> {
    const newOffer: OfferItem = {
      id: offer.id || `off-${Date.now()}`,
      title: offer.title || '',
      title_hi: offer.title_hi || null,
      description: offer.description || '',
      description_hi: offer.description_hi || null,
      service_id: offer.service_id || null,
      commission_type: offer.commission_type || 'Percentage',
      commission_value: offer.commission_value || '',
      terms: offer.terms || null,
      terms_hi: offer.terms_hi || null,
      start_date: offer.start_date || null,
      end_date: offer.end_date || null,
      is_active: offer.is_active ?? true,
      created_at: offer.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('offers').upsert(newOffer);
        if (!error) return true;
      } catch (err) {
        console.warn(err);
      }
    }

    const offers = getLocal<OfferItem[]>(STORAGE_KEYS.OFFERS, DEFAULT_OFFERS);
    const idx = offers.findIndex((o) => o.id === newOffer.id);
    if (idx >= 0) {
      offers[idx] = newOffer;
    } else {
      offers.unshift(newOffer);
    }
    setLocal(STORAGE_KEYS.OFFERS, offers);
    return true;
  },

  async deleteOffer(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('offers').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn(err);
      }
    }
    const offers = getLocal<OfferItem[]>(STORAGE_KEYS.OFFERS, DEFAULT_OFFERS);
    setLocal(
      STORAGE_KEYS.OFFERS,
      offers.filter((o) => o.id !== id)
    );
    return true;
  },

  // Guidelines
  async getGuidelines(): Promise<GuidelineItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('guidelines')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        if (!error && data) return data;
      } catch (err) {
        console.warn(err);
      }
    }
    const stored = getLocal<GuidelineItem[]>(STORAGE_KEYS.GUIDELINES, DEFAULT_GUIDELINES);
    return stored.filter((g) => g.is_active);
  },

  async saveGuideline(guideline: Partial<GuidelineItem>): Promise<boolean> {
    const item: GuidelineItem = {
      id: guideline.id || `g-${Date.now()}`,
      title: guideline.title || '',
      title_hi: guideline.title_hi || null,
      category: guideline.category || 'General',
      content: guideline.content || '',
      content_hi: guideline.content_hi || null,
      display_order: guideline.display_order || 1,
      is_active: guideline.is_active ?? true,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('guidelines').upsert(item);
        if (!error) return true;
      } catch (err) {
        console.warn(err);
      }
    }

    const items = getLocal<GuidelineItem[]>(STORAGE_KEYS.GUIDELINES, DEFAULT_GUIDELINES);
    const idx = items.findIndex((g) => g.id === item.id);
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.push(item);
    }
    setLocal(STORAGE_KEYS.GUIDELINES, items);
    return true;
  },

  // Marketing Resources
  async getResources(): Promise<ResourceItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn(err);
      }
    }
    const stored = getLocal<ResourceItem[]>(STORAGE_KEYS.RESOURCES, DEFAULT_RESOURCES);
    return stored.filter((r) => r.is_active);
  },

  async saveResource(resource: Partial<ResourceItem>): Promise<boolean> {
    const item: ResourceItem = {
      id: resource.id || `res-${Date.now()}`,
      title: resource.title || '',
      title_hi: resource.title_hi || null,
      description: resource.description || null,
      description_hi: resource.description_hi || null,
      category: resource.category || 'WhatsApp Introduction Scripts',
      resource_url: resource.resource_url || null,
      content_body: resource.content_body || null,
      language: resource.language || 'both',
      is_active: resource.is_active ?? true,
      created_at: resource.created_at || new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('resources').upsert(item);
        if (!error) return true;
      } catch (err) {
        console.warn(err);
      }
    }

    const items = getLocal<ResourceItem[]>(STORAGE_KEYS.RESOURCES, DEFAULT_RESOURCES);
    const idx = items.findIndex((r) => r.id === item.id);
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.unshift(item);
    }
    setLocal(STORAGE_KEYS.RESOURCES, items);
    return true;
  },

  async deleteResource(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('resources').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn(err);
      }
    }
    const items = getLocal<ResourceItem[]>(STORAGE_KEYS.RESOURCES, DEFAULT_RESOURCES);
    setLocal(
      STORAGE_KEYS.RESOURCES,
      items.filter((r) => r.id !== id)
    );
    return true;
  },

  // App Settings
  async getSettings(): Promise<Record<string, string>> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('app_settings').select('*');
        if (!error && data && data.length > 0) {
          const map: Record<string, string> = {};
          data.forEach((row: AppSetting) => {
            map[row.setting_key] = row.setting_value;
          });
          return { ...DEFAULT_SETTINGS, ...map };
        }
      } catch (err) {
        console.warn(err);
      }
    }
    return getLocal<Record<string, string>>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  async updateSetting(key: string, value: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('app_settings')
          .upsert({ setting_key: key, setting_value: value, updated_at: new Date().toISOString() });
        if (!error) return true;
      } catch (err) {
        console.warn(err);
      }
    }
    const map = getLocal<Record<string, string>>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    map[key] = value;
    setLocal(STORAGE_KEYS.SETTINGS, map);
    return true;
  },

  // Partners Management
  async getPartnerByUserId(userId: string): Promise<Partner | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('user_id', userId)
          .single();
        if (!error && data) return data as Partner;
      } catch (err) {
        console.warn('Supabase fetch error for partner profile:', err);
      }
    }
    const partners = getLocal<Partner[]>(STORAGE_KEYS.PARTNERS, []);
    const match = partners.find((p) => p.user_id === userId);
    return match || null;
  },

  async getAllPartnersAdmin(): Promise<Partner[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .order('registered_at', { ascending: false });
        if (!error && data) return data as Partner[];
      } catch (err) {
        console.warn(err);
      }
    }
    return getLocal<Partner[]>(STORAGE_KEYS.PARTNERS, []);
  },

  async createPartnerProfile(partnerData: {
    user_id: string;
    full_name: string;
    mobile_number: string;
    email: string;
    instagram_username?: string | null;
    preferred_language?: Language;
  }): Promise<Partner> {
    const existing = getLocal<Partner[]>(STORAGE_KEYS.PARTNERS, []);
    const partnerCode = generatePartnerCode(existing.length);
    const now = new Date().toISOString();

    const record: Partner = {
      id: `p-${Date.now()}`,
      user_id: partnerData.user_id,
      partner_code: partnerCode,
      full_name: partnerData.full_name,
      mobile_number: partnerData.mobile_number,
      email: partnerData.email.toLowerCase().trim(),
      instagram_username: partnerData.instagram_username
        ? partnerData.instagram_username.trim().replace(/^@/, '')
        : null,
      preferred_language: partnerData.preferred_language || 'en',
      account_status: 'Active',
      terms_accepted: true,
      registered_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('partners')
          .insert({
            user_id: record.user_id,
            full_name: record.full_name,
            mobile_number: record.mobile_number,
            email: record.email,
            instagram_username: record.instagram_username,
            preferred_language: record.preferred_language,
            account_status: 'Active',
            terms_accepted: true,
          })
          .select()
          .single();

        if (!error && data) {
          // Keep local sync
          existing.unshift(data as Partner);
          setLocal(STORAGE_KEYS.PARTNERS, existing);
          return data as Partner;
        } else if (error) {
          console.error('Supabase partners table insert error:', error);
          throw error;
        }
      } catch (err) {
        console.warn('Falling back to local partner store:', err);
      }
    }

    existing.unshift(record);
    setLocal(STORAGE_KEYS.PARTNERS, existing);
    return record;
  },

  async updatePartnerStatus(partnerId: string, status: 'Active' | 'Suspended'): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('partners')
          .update({ account_status: status, updated_at: new Date().toISOString() })
          .eq('id', partnerId);
        if (!error) return true;
      } catch (err) {
        console.warn(err);
      }
    }

    const partners = getLocal<Partner[]>(STORAGE_KEYS.PARTNERS, []);
    const idx = partners.findIndex((p) => p.id === partnerId);
    if (idx >= 0) {
      partners[idx].account_status = status;
      partners[idx].updated_at = new Date().toISOString();
      setLocal(STORAGE_KEYS.PARTNERS, partners);
      return true;
    }
    return false;
  },

  async updatePartnerProfile(
    partnerId: string,
    updates: {
      mobile_number?: string;
      instagram_username?: string | null;
      preferred_language?: Language;
    }
  ): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('partners')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', partnerId);
        if (!error) return true;
      } catch (err) {
        console.warn(err);
      }
    }

    const partners = getLocal<Partner[]>(STORAGE_KEYS.PARTNERS, []);
    const idx = partners.findIndex((p) => p.id === partnerId);
    if (idx >= 0) {
      partners[idx] = {
        ...partners[idx],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      setLocal(STORAGE_KEYS.PARTNERS, partners);
      return true;
    }
    return false;
  },

  // Referral Leads Management
  async submitLead(lead: {
    partner_id: string;
    business_name: string;
    contact_person: string;
    contact_number: string;
    service_interested: string;
    city?: string | null;
    notes?: string | null;
  }): Promise<LeadItem> {
    const item: LeadItem = {
      id: `lead-${Date.now()}`,
      partner_id: lead.partner_id,
      business_name: lead.business_name,
      contact_person: lead.contact_person,
      contact_number: lead.contact_number,
      service_interested: lead.service_interested,
      city: lead.city || null,
      notes: lead.notes || null,
      status: 'Pending',
      commission_amount: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .insert({
            partner_id: item.partner_id,
            business_name: item.business_name,
            contact_person: item.contact_person,
            contact_number: item.contact_number,
            service_interested: item.service_interested,
            city: item.city,
            notes: item.notes,
            status: 'Pending',
            commission_amount: 0,
          })
          .select()
          .single();
        if (!error && data) return data as LeadItem;
      } catch (err) {
        console.warn(err);
      }
    }

    const leads = getLocal<LeadItem[]>(STORAGE_KEYS.LEADS, []);
    leads.unshift(item);
    setLocal(STORAGE_KEYS.LEADS, leads);
    return item;
  },

  async getLeadsByPartner(partnerId: string): Promise<LeadItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('partner_id', partnerId)
          .order('created_at', { ascending: false });
        if (!error && data) return data as LeadItem[];
      } catch (err) {
        console.warn(err);
      }
    }
    const leads = getLocal<LeadItem[]>(STORAGE_KEYS.LEADS, []);
    return leads.filter((l) => l.partner_id === partnerId);
  },

  async getAllLeadsAdmin(): Promise<LeadItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data as LeadItem[];
      } catch (err) {
        console.warn(err);
      }
    }
    return getLocal<LeadItem[]>(STORAGE_KEYS.LEADS, []);
  },

  async updateLeadStatus(
    leadId: string,
    status: LeadItem['status'],
    commissionAmount?: number
  ): Promise<boolean> {
    const updatePayload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (typeof commissionAmount === 'number') {
      updatePayload.commission_amount = commissionAmount;
    }

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('leads').update(updatePayload).eq('id', leadId);
        if (!error) return true;
      } catch (err) {
        console.warn(err);
      }
    }

    const leads = getLocal<LeadItem[]>(STORAGE_KEYS.LEADS, []);
    const idx = leads.findIndex((l) => l.id === leadId);
    if (idx >= 0) {
      leads[idx].status = status;
      if (typeof commissionAmount === 'number') {
        leads[idx].commission_amount = commissionAmount;
      }
      leads[idx].updated_at = new Date().toISOString();
      setLocal(STORAGE_KEYS.LEADS, leads);
      return true;
    }
    return false;
  },

  // Appointments Management (Direct Booking & Consultation Storage)
  async bookAppointment(appointment: {
    client_name: string;
    client_email: string;
    client_phone: string;
    service_needed: string;
    appointment_date: string;
    preferred_time: string;
    notes?: string | null;
    partner_code?: string | null;
    partner_id?: string | null;
  }): Promise<{ success: boolean; data?: AppointmentItem; error?: string }> {
    const item: AppointmentItem = {
      id: `apt-${Date.now()}`,
      client_name: appointment.client_name.trim(),
      client_email: appointment.client_email.trim().toLowerCase(),
      client_phone: appointment.client_phone.trim(),
      service_needed: appointment.service_needed,
      appointment_date: appointment.appointment_date,
      preferred_time: appointment.preferred_time,
      notes: appointment.notes?.trim() || null,
      partner_code: appointment.partner_code?.trim() || null,
      partner_id: appointment.partner_id || null,
      status: 'Confirmed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .insert({
            client_name: item.client_name,
            client_email: item.client_email,
            client_phone: item.client_phone,
            service_needed: item.service_needed,
            appointment_date: item.appointment_date,
            preferred_time: item.preferred_time,
            notes: item.notes,
            partner_code: item.partner_code,
            partner_id: item.partner_id,
            status: item.status,
          })
          .select()
          .single();

        if (!error && data) {
          const list = getLocal<AppointmentItem[]>(STORAGE_KEYS.APPOINTMENTS, []);
          list.unshift(data as AppointmentItem);
          setLocal(STORAGE_KEYS.APPOINTMENTS, list);
          return { success: true, data: data as AppointmentItem };
        } else if (error) {
          console.warn('Supabase appointments insert warning:', error);
          // If table not created in user db yet, fallback locally so user never gets blocked
        }
      } catch (err: unknown) {
        console.warn('Supabase bookAppointment error:', err);
      }
    }

    const list = getLocal<AppointmentItem[]>(STORAGE_KEYS.APPOINTMENTS, []);
    list.unshift(item);
    setLocal(STORAGE_KEYS.APPOINTMENTS, list);
    return { success: true, data: item };
  },

  async getAllAppointmentsAdmin(): Promise<AppointmentItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data as AppointmentItem[];
      } catch (err) {
        console.warn(err);
      }
    }
    return getLocal<AppointmentItem[]>(STORAGE_KEYS.APPOINTMENTS, []);
  },

  async updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentItem['status']
  ): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', appointmentId);
        if (!error) return true;
      } catch (err) {
        console.warn(err);
      }
    }

    const list = getLocal<AppointmentItem[]>(STORAGE_KEYS.APPOINTMENTS, []);
    const idx = list.findIndex((a) => a.id === appointmentId);
    if (idx >= 0) {
      list[idx].status = status;
      list[idx].updated_at = new Date().toISOString();
      setLocal(STORAGE_KEYS.APPOINTMENTS, list);
      return true;
    }
    return false;
  },

  // Admin Verification
  async checkIsAdmin(userId: string, userEmail?: string | null): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();
        if (!error && data) return true;
      } catch (err) {
        console.warn(err);
      }
    }

    // Local check / initial admin check
    const admins = getLocal<string[]>(STORAGE_KEYS.ADMIN_USERS, [
      'admin@digwebexpert.com',
      'harshad@digwebexpert.com',
    ]);
    if (userEmail && admins.includes(userEmail.toLowerCase().trim())) {
      return true;
    }
    return false;
  },
};
