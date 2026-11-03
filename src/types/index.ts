export type Language = 'en' | 'hi';

export interface Partner {
  id: string;
  user_id: string;
  partner_code: string;
  full_name: string;
  mobile_number: string;
  email: string;
  instagram_username: string | null;
  preferred_language: Language;
  account_status: 'Active' | 'Suspended' | 'Pending';
  terms_accepted: boolean;
  registered_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string | null;
  created_at: string;
}

export interface ServiceItem {
  id: string;
  service_name: string;
  service_name_hi: string | null;
  description: string;
  description_hi: string | null;
  benefits: string[];
  commission_rules: string | null;
  commission_rules_hi: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OfferItem {
  id: string;
  title: string;
  title_hi: string | null;
  description: string;
  description_hi: string | null;
  service_id: string | null;
  commission_type: 'Percentage' | 'Fixed' | 'Custom';
  commission_value: string;
  terms: string | null;
  terms_hi: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GuidelineItem {
  id: string;
  title: string;
  title_hi: string | null;
  category: string;
  content: string;
  content_hi: string | null;
  display_order: number;
  is_active: boolean;
  updated_at: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  title_hi: string | null;
  description: string | null;
  description_hi: string | null;
  category: string;
  resource_url: string | null;
  content_body: string | null;
  language: 'en' | 'hi' | 'both';
  is_active: boolean;
  created_at: string;
}

export interface AppSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  updated_at: string;
}

export interface LeadItem {
  id: string;
  partner_id: string;
  business_name: string;
  contact_person: string;
  contact_number: string;
  service_interested: string;
  city: string | null;
  notes: string | null;
  status: 'Pending' | 'In Discussion' | 'Closed - Won' | 'Commission Paid' | 'Rejected';
  commission_amount: number;
  created_at: string;
  updated_at: string;
}
