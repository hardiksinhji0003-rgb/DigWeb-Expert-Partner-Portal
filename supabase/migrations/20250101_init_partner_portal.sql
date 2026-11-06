-- ====================================================================
-- DIGWEB EXPERT – PARTNER PORTAL DATABASE SCHEMA & MIGRATION
-- Project: DigWeb Expert Referral Partner Portal V1
-- PostgreSQL / Supabase
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PARTNER CODE SEQUENCE
CREATE SEQUENCE IF NOT EXISTS partner_code_seq START WITH 1 INCREMENT BY 1;

-- 3. PARTNERS TABLE
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    partner_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    instagram_username TEXT,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi')),
    account_status TEXT DEFAULT 'Active' CHECK (account_status IN ('Active', 'Suspended', 'Pending')),
    terms_accepted BOOLEAN DEFAULT true NOT NULL,
    registered_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for fast lookups
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON public.partners(user_id);
CREATE INDEX IF NOT EXISTS idx_partners_partner_code ON public.partners(partner_code);
CREATE INDEX IF NOT EXISTS idx_partners_email ON public.partners(email);
CREATE INDEX IF NOT EXISTS idx_partners_mobile ON public.partners(mobile_number);

-- 4. AUTO-GENERATE PARTNER CODE TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.set_partner_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.partner_code IS NULL OR NEW.partner_code = '' THEN
        NEW.partner_code := 'DWE-' || LPAD(nextval('partner_code_seq')::TEXT, 5, '0');
    END IF;
    NEW.registered_at := timezone('utc'::text, now());
    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_set_partner_code ON public.partners;
CREATE TRIGGER trigger_set_partner_code
    BEFORE INSERT ON public.partners
    FOR EACH ROW
    EXECUTE FUNCTION public.set_partner_code();

-- 5. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);

-- Helper function to verify admin access
CREATE OR REPLACE FUNCTION public.is_admin(check_uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users WHERE user_id = check_uid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    service_name_hi TEXT,
    description TEXT NOT NULL,
    description_hi TEXT,
    benefits JSONB DEFAULT '[]'::jsonb,
    commission_rules TEXT,
    commission_rules_hi TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_hi TEXT,
    description TEXT NOT NULL,
    description_hi TEXT,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    commission_type TEXT DEFAULT 'Percentage' CHECK (commission_type IN ('Percentage', 'Fixed', 'Custom')),
    commission_value TEXT NOT NULL,
    terms TEXT,
    terms_hi TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. GUIDELINES TABLE
CREATE TABLE IF NOT EXISTS public.guidelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_hi TEXT,
    category TEXT DEFAULT 'General',
    content TEXT NOT NULL,
    content_hi TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. MARKETING RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_hi TEXT,
    description TEXT,
    description_hi TEXT,
    category TEXT NOT NULL,
    resource_url TEXT,
    content_body TEXT,
    language TEXT DEFAULT 'both',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. APP SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. REFERRAL LEADS TABLE (Client Introductions)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
    business_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    service_interested TEXT NOT NULL,
    city TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Discussion', 'Closed - Won', 'Commission Paid', 'Rejected')),
    commission_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_partner_id ON public.leads(partner_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- PARTNERS POLICIES
CREATE POLICY "Partners can read own record" ON public.partners
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Partners can insert own record" ON public.partners
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Partners can update own details" ON public.partners
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
    WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- ADMIN POLICIES
CREATE POLICY "Admins can view admin list" ON public.admin_users
    FOR SELECT TO authenticated
    USING (public.is_admin(auth.uid()));

-- SERVICES, OFFERS, GUIDELINES, RESOURCES, SETTINGS (Public Read, Admin Write)
CREATE POLICY "Public read services" ON public.services FOR SELECT TO public USING (true);
CREATE POLICY "Admin write services" ON public.services FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Public read offers" ON public.offers FOR SELECT TO public USING (true);
CREATE POLICY "Admin write offers" ON public.offers FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Public read guidelines" ON public.guidelines FOR SELECT TO public USING (true);
CREATE POLICY "Admin write guidelines" ON public.guidelines FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Public read resources" ON public.resources FOR SELECT TO public USING (true);
CREATE POLICY "Admin write resources" ON public.resources FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Public read settings" ON public.app_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admin write settings" ON public.app_settings FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 12. APPOINTMENTS TABLE (Consultation Bookings)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    service_needed TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    notes TEXT,
    partner_code TEXT,
    partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Confirmed' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_appointments_client_email ON public.appointments(client_email);
CREATE INDEX IF NOT EXISTS idx_appointments_partner_id ON public.appointments(partner_id);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert appointments" ON public.appointments
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow partners to view own referred appointments" ON public.appointments
    FOR SELECT TO authenticated
    USING (
        partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid()) 
        OR public.is_admin(auth.uid())
    );

CREATE POLICY "Allow admins full access to appointments" ON public.appointments
    FOR ALL TO authenticated
    USING (public.is_admin(auth.uid()));

-- ====================================================================
-- SEED INITIAL DATA
-- ====================================================================

-- 1. Services
INSERT INTO public.services (service_name, service_name_hi, description, description_hi, benefits, commission_rules, commission_rules_hi, display_order)
VALUES 
(
    'Website Development',
    'वेबसाइट डेवलपमेंट',
    'Custom high-performance business websites, landing pages, corporate portals, and e-commerce solutions built for speed, SEO, and conversions.',
    'हाई-परफॉर्मेंस बिजनेस वेबसाइट, लैंडिंग पेज, कॉर्पोरेट पोर्टल और ई-कॉमर्स समाधान जो स्पीड, एसईओ और कन्वर्जन के लिए डिज़ाइन किए जाते हैं।',
    '["Mobile responsive & modern UI/UX", "Google SEO optimized structure", "Fast loading & SSL security", "Free domain & hosting setup assistance"]'::jsonb,
    'Commission payable upon project milestone completion and receipt of client payment.',
    'क्लाइंट द्वारा प्रोजेक्ट पेमेंट प्राप्त होने के बाद कमीशन देय होता है।',
    1
),
(
    'Graphic Design',
    'ग्राफिक डिजाइन',
    'Professional corporate branding, social media creatives, flyers, brochures, menus, and brand identity kits that capture customer attention.',
    'प्रोफेशनल कॉर्पोरेट ब्रांडिंग, सोशल मीडिया क्रिएटिव, फ्लायर्स, ब्रोशर और ब्रांड आइडेंटिटी किट जो ग्राहकों का ध्यान आकर्षित करते हैं।',
    '["Premium brand identity packages", "Engaging social media post designs", "Print-ready high resolution files", "Fast delivery & revisions"]'::jsonb,
    'Flat commission per monthly creative package or project contract closed.',
    'प्रत्येक क्लोज्ड मंथली पैकेज या प्रोजेक्ट पर निश्चित कमीशन।',
    2
),
(
    'Google Business Profile (GBP)',
    'गूगल बिजनेस प्रोफाइल (GBP)',
    'Local SEO ranking, profile verification, review management, and 3-pack Google Maps optimization to drive real local walk-in clients and phone inquiries.',
    'लोकल एसईओ रैंकिंग, प्रोफाइल वेरिफिकेशन, रिव्यू मैनेजमेंट और गूगल मैप्स 3-पैक ऑप्टिमाइजेशन जिससे स्थानीय ग्राहक और कॉल्स मिलें।',
    '["Top 3 Google Maps local ranking boost", "Spam protection & profile reinstatement", "Review automation setup", "Monthly keyword search insight reports"]'::jsonb,
    'Commission paid upon successful profile optimization and fee receipt.',
    'प्रोफाइल ऑप्टिमाइज़ेशन और फीस रिसीव होने के बाद कमीशन दिया जाता है।',
    3
),
(
    'Meta Ads Management',
    'मेटा ऐड्स मैनेजमेंट',
    'High-ROI Facebook and Instagram advertising campaigns designed for hyper-local lead generation, customer inquiries, and e-commerce sales.',
    'फेसबुक और इंस्टाग्राम पर हाई-आरओआई विज्ञापन अभियान, जो लोकल लीड जनरेशन, इनक्वायरी और सेल्स के लिए तैयार किए जाते हैं।',
    '["Precise audience & local area targeting", "High-converting ad copy and creatives", "Daily campaign monitoring & ROAS tracking", "WhatsApp direct lead campaigns"]'::jsonb,
    'Recurring commission on monthly retainer contracts as long as client stays active.',
    'क्लाइंट के एक्टिव रहने तक मासिक रिटेनर अनुबंधों पर आवर्ती कमीशन।',
    4
)
ON CONFLICT DO NOTHING;

-- 2. Initial Sample Offers
INSERT INTO public.offers (title, title_hi, description, description_hi, commission_type, commission_value, terms, terms_hi, is_active)
VALUES 
(
    'Quarterly Partner Milestone Bonus',
    'त्रैमासिक पार्टनर माइलस्टोन बोनस',
    'Earn competitive commissions on every confirmed client website and digital marketing setup.',
    'हर सफल क्लाइंट वेबसाइट और डिजिटल मार्केटिंग सेटअप पर आकर्षक कमीशन अर्जित करें।',
    'Percentage',
    '10% - 15% Project Value',
    'Commission is payable only after the referred client completes the agreed order and the required payment is successfully received, subject to the applicable partnership terms.',
    'कमीशन केवल तभी देय होता है जब संदर्भित ग्राहक सहमत ऑर्डर पूरा कर लेता है और आवश्यक भुगतान सफलतापूर्वक प्राप्त हो जाता है।',
    true
),
(
    'Local Business Booster Offer',
    'लोकल बिजनेस बूस्टर ऑफर',
    'Special combined package for local retailers: Google Maps 3-Pack + Local Social Media Ads.',
    'स्थानीय खुदरा विक्रेताओं के लिए विशेष कॉम्बो पैकेज: गूगल मैप्स 3-पैक + लोकल सोशल मीडिया ऐड्स।',
    'Fixed',
    'Fixed Incentive per Client Deal',
    'Client must opt for minimum 3 months service contract.',
    'ग्राहक को न्यूनतम 3 महीने के सेवा अनुबंध का विकल्प चुनना होगा।',
    true
)
ON CONFLICT DO NOTHING;

-- 3. Guidelines
INSERT INTO public.guidelines (title, title_hi, category, content, content_hi, display_order)
VALUES
(
    'Referral Partner Status',
    'रेफरल पार्टनर की स्थिति',
    'Role & Ethics',
    'Partners are independent referral partners, not full-time employees, agents, or legal representatives of DigWeb Expert. Partners may not sign contracts, execute guarantees, or promise custom project timelines independently on behalf of DigWeb Expert.',
    'पार्टनर स्वतंत्र रेफरल पार्टनर हैं, वे डिगवेब एक्सपर्ट के पूर्णकालिक कर्मचारी या कानूनी प्रतिनिधि नहीं हैं। पार्टनर कंपनी की ओर से स्वतंत्र रूप से अनुबंध पर हस्ताक्षर या वादे नहीं कर सकते।',
    1
),
(
    'Commission Eligibility & Payout Policy',
    'कमीशन पात्रता और भुगतान नीति',
    'Commission',
    'Commission is strictly payable only after the referred client completes the agreed order, contract is signed, and the agreed project payment is successfully received in DigWeb Expert accounts. No advances or commission on non-paying leads.',
    'कमीशन केवल तभी देय होता है जब संदर्भित ग्राहक सहमत ऑर्डर पूरा कर लेता है और डिगवेब एक्सपर्ट के खाते में भुगतान प्राप्त हो जाता है। अनपेड लीड्स पर कोई कमीशन नहीं दिया जाता।',
    2
),
(
    'Prohibited Misrepresentation & Fake Leads',
    'गलत बयानी और फर्जी लीड्स पर प्रतिबंध',
    'Compliance',
    'Submitting fake phone numbers, unqualified spam, or pretending to represent other corporate entities is strictly prohibited. Submitting fraudulent leads will lead to immediate permanent suspension of the partner account and forfeiture of pending claims.',
    'फर्जी नंबर, स्पैम डेटा या गलत जानकारी सबमिट करना सख्त वर्जित है। गलत लीड्स देने पर पार्टनर अकाउंट तत्काल निलंबित कर दिया जाएगा।',
    3
),
(
    'Brand Usage Guidelines',
    'ब्रांड उपयोग दिशानिर्देश',
    'Branding',
    'Partners may use approved marketing scripts, flyers, and promotional graphics provided in the Marketing Resources section. Do not alter DigWeb Expert logos or create unauthorized sub-brands without written approval.',
    'पार्टनर मार्केटिंग रिसोर्सेज में दी गई सामग्री का उपयोग कर सकते हैं। डिगवेब एक्सपर्ट के लोगो में बदलाव न करें।',
    4
)
ON CONFLICT DO NOTHING;

-- 4. Initial Marketing Resources
INSERT INTO public.resources (title, title_hi, description, description_hi, category, content_body, language)
VALUES
(
    'WhatsApp Business Introduction Pitch',
    'व्हाट्सएप बिजनेस परिचय पिच',
    'Quick message to send to local business owners who need a website or Google Maps ranking.',
    'स्थानीय व्यापार मालिकों को भेजने के लिए त्वरित संदेश जिन्हें वेबसाइट या गूगल मैप्स रैंकिंग की आवश्यकता है।',
    'WhatsApp Introduction Scripts',
    'Hello Sir/Ma''am, I noticed your business profile on Google. Did you know that 80% of local customers search online before visiting? DigWeb Expert is helping local businesses build high-converting websites and rank in Google Maps top 3 results. Would you like a free 5-minute digital audit for your business?',
    'both'
),
(
    'Instagram DM Outreach Template',
    'इंस्टाग्राम डीएम आउटरीच टेम्पलेट',
    'For reaching out to local clothing brands, cafes, salons, and consultants on Instagram.',
    'इंस्टाग्राम पर लोकल ब्रांड्स, कैफे, सैलून और कंसल्टेंट्स से संपर्क करने के लिए।',
    'Instagram Promotional Content',
    'Hey [Business Name] team! Love your page and products. Are you currently taking orders via your own branded website, or just through DMs? Having a dedicated website can automate your bookings and double trust. DigWeb Expert specializes in fast, high-end websites. Happy to connect you with our technical team!',
    'both'
),
(
    'Quick Service Overview Pitch (Hindi & English)',
    'क्विक सर्विस ओवरव्यू पिच (हिंदी और अंग्रेजी)',
    'Short pitch explaining the 4 core services of DigWeb Expert.',
    'डिगवेब एक्सपर्ट की 4 मुख्य सेवाओं को समझाने वाली संक्षिप्त पिच।',
    'Business Introduction Messages',
    'डिगवेब एक्सपर्ट (DigWeb Expert) आपके बिजनेस को ऑनलाइन ग्रो करने के लिए कम्प्लीट डिजिटल सोल्यूशन प्रदान करता है: 1. प्रोफेशनल वेबसाइट डेवलपमेंट 2. सोशल मीडिया और ग्राफिक डिजाइन 3. गूगल बिजनेस प्रोफाइल रैंकिंग 4. मेटा (फेसबुक/इंस्टा) लीड जनरेशन ऐड्स। आज ही अपने बिजनेस को ऑनलाइन ले जाएं!',
    'both'
)
ON CONFLICT DO NOTHING;

-- 5. Default App Settings
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES
('whatsapp_support_number', '+91 98765 43210'),
('business_email', 'contact@digwebexpert.com'),
('instagram_handle', '@digwebexpert'),
('founder_name', 'Harshadsinh Solanki'),
('company_name', 'DIGWEB EXPERT'),
('office_city', 'Gujarat, India')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;
