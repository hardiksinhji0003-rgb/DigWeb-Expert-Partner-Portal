# DigWeb Expert – Partner Portal (V1)

Official Referral Partnership Registration and Information Portal for **DigWeb Expert**, founded by **Harshadsinh Solanki**.

This application enables business promoters, Instagram influencers, local business contacts, and professional networkers to register as official referral partners, access approved marketing pitches, submit client referrals, and review live service offers and commission guidelines.

---

## 1. Technology Stack

- **Frontend**: React.js (TypeScript) + Vite
- **Styling**: Tailwind CSS (Corporate Navy `#0B1630`, Secondary Navy `#102A56`, Royal Blue `#1D4ED8`, Gold Accent `#D4AF57`)
- **Icons**: Lucide React
- **Animations**: Motion
- **Backend & Database**: Supabase (PostgreSQL with Row-Level Security, Database Triggers & Functions)
- **Authentication**: Supabase Auth (Email & Password, Password Recovery)
- **Hosting**: Netlify (configured via `netlify.toml` with SPA route fallback)
- **Version Control**: GitHub

---

## 2. Key Architecture & Features

1. **Brand Identity & Executive Design**:
   - Clean 80–85% light surface hierarchy with deep navy accents and gold highlights.
   - Strictly conforms to zero-pill metadata rules, single-elevation depth, and accessible typography.
2. **Dual-Language System (English & Hindi)**:
   - Instant language switching across all navigation, form validation, error banners, dashboard tabs, and legal disclaimers.
   - Preference saved automatically to the partner's profile and browser storage.
3. **Automated Partner Registration**:
   - Validates Indian 10-digit mobile numbers, clean email formats, and flexible Instagram handles (`@username` or `username`).
   - Generates unique Partner IDs automatically at the database level (`DWE-00001` sequence).
   - Auto-activates partner accounts immediately without requiring manual admin approval.
   - Displays official registration celebration modal with exact IST (Asia/Kolkata) date and time.
4. **Partner Dashboard (8 Functional Zones)**:
   - **Overview**: Real-time stats, referral lead submission form, and submission history table.
   - **How It Works**: 5-step client introduction workflow and liaison ethics.
   - **Services & Offers**: 4 core services (Website Development, Graphic Design, GBP, Meta Ads) + dynamic promotional commission offers fetched from Supabase.
   - **Partnership Guidelines**: Detailed policy on misrepresentation, prohibited fake leads, and brand usage.
   - **Marketing Resources**: 1-click copy-to-clipboard WhatsApp pitches, Instagram outreach copy, and business introduction scripts.
   - **Contact & Support**: Direct WhatsApp chat links, email, and Instagram.
   - **Profile**: Permanent Partner ID verification, editable mobile and handle.
5. **Secure Admin Management Console (`/admin`)**:
   - Access verified against the `admin_users` table in Supabase.
   - Search partners by Name, Email, Mobile number, or Partner ID.
   - Suspend or reactivate partner accounts with safety confirmation dialogs.
   - Create, edit, toggle, and delete promotional offers.
   - Update core service descriptions and commission rules.
   - Manage application contact numbers and settings.
   - Review incoming client referrals and record commission payouts.

---

## 3. Supabase Database Setup

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Note your **Project URL** and **anon public API key** from **Project Settings → API**.

### Step 2: Run the Database Migration
1. In the Supabase Dashboard, open **SQL Editor**.
2. Click **New query**.
3. Copy the entire contents of `supabase/migrations/20250101_init_partner_portal.sql` into the editor.
4. Click **Run**.
5. The script automatically sets up:
   - `partners` table with auto-incrementing `DWE-00001` trigger.
   - `admin_users`, `services`, `offers`, `guidelines`, `resources`, `app_settings`, and `leads` tables.
   - Row Level Security (RLS) policies protecting partner records so partners can only read/write their own data.
   - Pre-seeded initial services, offers, guidelines, marketing resources, and settings.

### Step 3: Create Your First Admin Account Securely
1. Go to **Authentication → Users** in your Supabase dashboard and click **Add user** (or sign up via the app with your admin email).
2. Note the generated `user_id` UUID of this user.
3. In **SQL Editor**, run:
   ```sql
   INSERT INTO public.admin_users (user_id, email)
   VALUES ('<YOUR_USER_UUID>', 'admin@digwebexpert.com');
   ```
4. This user now has full administrative privileges to access `/admin`.

---

## 4. Environment Variables

Create a `.env` file locally, or configure in Netlify **Site configuration → Environment variables**:

```bash
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

*Note: Never expose the Supabase `service_role` secret key in the frontend environment.*

---

## 5. Netlify Deployment Instructions

### Method A: Deploy via GitHub & Netlify (Recommended)
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete DigWeb Expert Partner Portal v1"
   git branch -M main
   git remote add origin https://github.com/<your-username>/digweb-expert-partner-portal.git
   git push -u origin main
   ```
2. Log in to [Netlify](https://app.netlify.com).
3. Click **Add new site → Import an existing project**.
4. Select **GitHub** and choose your repository.
5. Netlify will auto-detect settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Under **Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click **Deploy DigWeb Expert Partner Portal**.

### Method B: Manual CLI Deploy
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

The included `netlify.toml` automatically configures SPA fallback rules (`/* -> /index.html 200`), ensuring direct page refreshes on `/dashboard`, `/admin`, and `/register` never trigger 404 errors.

---

## 6. Official Contact

- **Founder**: Harshadsinh Solanki
- **Brand**: DIGWEB EXPERT
- **Portal**: DigWeb Expert Partner Portal
