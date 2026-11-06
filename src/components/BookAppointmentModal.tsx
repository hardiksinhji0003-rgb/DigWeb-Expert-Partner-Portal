import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, User, Mail, Phone, X, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { DataService } from '../services/dataService';
import { useLanguage } from '../contexts/LanguageContext';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPartnerCode?: string | null;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  defaultPartnerCode = null,
}) => {
  const { language } = useLanguage();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceNeeded, setServiceNeeded] = useState('Website Development');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    // default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('11:00 AM - 12:00 PM');
  const [notes, setNotes] = useState('');
  const [partnerCode, setPartnerCode] = useState(defaultPartnerCode || '');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim() || !appointmentDate) {
      setErrorMessage(
        language === 'gu'
          ? 'કૃપા કરીને બધી જરૂરી માહિતી ભરો.'
          : language === 'hi'
          ? 'कृपया सभी आवश्यक फ़ील्ड भरें।'
          : 'Please fill in all required fields.'
      );
      return;
    }

    setLoading(true);

    try {
      const res = await DataService.bookAppointment({
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        service_needed: serviceNeeded,
        appointment_date: appointmentDate,
        preferred_time: preferredTime,
        notes,
        partner_code: partnerCode || null,
      });

      if (res.success && res.data) {
        setSuccessData({ id: res.data.id });
      } else {
        setErrorMessage(
          res.error ||
            (language === 'gu'
              ? 'એપોઇન્ટમેન્ટ બુક કરવામાં નિષ્ફળતા. કૃપા કરીને ફરી પ્રયાસ કરો.'
              : language === 'hi'
              ? 'अपॉइंटमेंट बुक करने में विफलता। कृपया पुनः प्रयास करें।'
              : 'Failed to book appointment. Please try again.')
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1630]/80 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-[#0B1630] px-6 py-5 text-white flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF57] mb-0.5">
                {language === 'gu'
                  ? 'ડિગવેબ એક્સપર્ટ કન્સલ્ટેશન'
                  : language === 'hi'
                  ? 'डिगवेब एक्सपर्ट कंसल्टेशन'
                  : 'DIGWEB EXPERT CONSULTATION'}
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {language === 'gu'
                  ? 'એપોઇન્ટમેન્ટ બુક કરો'
                  : language === 'hi'
                  ? 'अपॉइंटमेंट बुक करें'
                  : 'Book a Consultation Appointment'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {successData ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#0B1630]">
                  {language === 'gu'
                    ? 'એપોઇન્ટમેન્ટ સફળતાપૂર્વક નોંધાઈ ગઈ!'
                    : language === 'hi'
                    ? 'अपॉइंटमेंट सफलतापूर्वक दर्ज की गई!'
                    : 'Appointment Confirmed & Saved to Database!'}
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {language === 'gu'
                    ? 'તમારી એપોઇન્ટમેન્ટ વિગતો સીધી અમારા સુપાબેઝ (Supabase) ડેટાબેઝમાં સુરક્ષિત રીતે સચવાઈ ગઈ છે. અમારી ટેકનિકલ ટીમ ટૂંક સમયમાં તમારો સંપર્ક કરશે.'
                    : language === 'hi'
                    ? 'आपकी अपॉइंटमेंट विवरण सीधे हमारे सुपाबेस (Supabase) डेटाबेस में सुरक्षित रूप से सेव हो चुके हैं। हमारी टीम जल्द ही आपसे संपर्क करेगी।'
                    : 'Your appointment booking details have been securely recorded in our Supabase database. Our specialist technical team will connect with you at the scheduled time.'}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessData(null);
                      onClose();
                    }}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#0B1630] hover:bg-[#102A56] rounded-xl"
                  >
                    {language === 'gu' ? 'પૂર્ણ' : language === 'hi' ? 'पूर्ण' : 'Done'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Client Name */}
                <div>
                  <label className="block font-semibold text-slate-900 mb-1">
                    {language === 'gu' ? 'તમારું પૂરું નામ' : language === 'hi' ? 'आपका नाम' : 'Full Name'} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder={language === 'gu' ? 'દા.ત. વિક્રમાદિત્ય શર્મા' : language === 'hi' ? 'उदा. विक्रमादित्य शर्मा' : 'e.g. Vikramaditya Sharma'}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-900 mb-1">
                      {language === 'gu' ? 'ઇમેઇલ એડ્રેસ' : language === 'hi' ? 'ईमेल' : 'Email Address'} *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="client@example.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-900 mb-1">
                      {language === 'gu' ? 'મોબાઇલ નંબર' : language === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'} *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder={language === 'gu' ? '૧૦ અંકનો નંબર' : language === 'hi' ? '10-अंकों का नंबर' : '10-digit number'}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Needed */}
                <div>
                  <label className="block font-semibold text-slate-900 mb-1">
                    {language === 'gu' ? 'જરૂરી સેવા' : language === 'hi' ? 'आवश्यक सेवा' : 'Service Needed'}
                  </label>
                  <select
                    value={serviceNeeded}
                    onChange={(e) => setServiceNeeded(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8] bg-white"
                  >
                    <option value="Website Development">
                      {language === 'gu' ? 'વેબસાઇટ ડેવલપમેન્ટ' : language === 'hi' ? 'वेबसाइट डेवलपमेंट' : 'Website Development'}
                    </option>
                    <option value="Graphic Design">
                      {language === 'gu' ? 'ગ્રાફિક ડિઝાઇન' : language === 'hi' ? 'ग्राफिक डिजाइन' : 'Graphic Design'}
                    </option>
                    <option value="Google Business Profile">
                      {language === 'gu' ? 'ગૂગલ બિઝનેસ પ્રોફાઇલ (GBP)' : language === 'hi' ? 'गूगल बिजनेस प्रोफाइल (GBP)' : 'Google Business Profile (GBP)'}
                    </option>
                    <option value="Meta Ads Management">
                      {language === 'gu' ? 'મેટા એડ્સ મેનેજમેન્ટ' : language === 'hi' ? 'मेटा विज्ञापन प्रबंधन' : 'Meta Ads Management'}
                    </option>
                    <option value="Comprehensive Digital Consultation">
                      {language === 'gu' ? 'સંપૂર્ણ ડિજિટલ કન્સલ્ટેશન' : language === 'hi' ? 'व्यापक डिजिटल परामर्श' : 'Comprehensive Digital Consultation'}
                    </option>
                  </select>
                </div>

                {/* Date & Preferred Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-900 mb-1">
                      {language === 'gu' ? 'તારીખ' : language === 'hi' ? 'तारीख' : 'Appointment Date'} *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="date"
                        required
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-900 mb-1">
                      {language === 'gu' ? 'સમય સ્લોટ' : language === 'hi' ? 'समय' : 'Preferred Slot'}
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8] bg-white"
                      >
                        <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                        <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                        <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                        <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                        <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Partner Code (optional) */}
                <div>
                  <label className="block font-semibold text-slate-900 mb-1">
                    {language === 'gu'
                      ? 'રેફરલ પાર્ટનર કોડ (વૈકલ્પિક)'
                      : language === 'hi'
                      ? 'रेफरल पार्टनर कोड (यदि लागू हो)'
                      : 'Referral Partner Code (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={partnerCode}
                    onChange={(e) => setPartnerCode(e.target.value)}
                    placeholder="e.g. DWE-00001"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8] font-mono text-[#856318]"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block font-semibold text-slate-900 mb-1">
                    {language === 'gu'
                      ? 'પ્રોજેક્ટ વિગતો અથવા નોંધ'
                      : language === 'hi'
                      ? 'विवरण या आवश्यकताएं'
                      : 'Project Requirements / Notes'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      language === 'gu'
                        ? 'તમારા વ્યવસાય લક્ષ્યો વિશે ટૂંકમાં જણાવો...'
                        : language === 'hi'
                        ? 'अपने व्यावसायिक लक्ष्यों के बारे में संक्षेप में बताएं...'
                        : 'Tell us briefly about your business goals...'
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1D4ED8]"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 font-bold text-white bg-[#0B1630] hover:bg-[#102A56] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>
                      {loading
                        ? language === 'gu'
                          ? 'ડેટાબેઝમાં સેવ થઈ રહ્યું છે...'
                          : language === 'hi'
                          ? 'डेटाबेस में सेव हो रहा है...'
                          : 'Saving in Database...'
                        : language === 'gu'
                        ? 'એપોઇન્ટમેન્ટ બુકિંગ કન્ફર્મ કરો'
                        : language === 'hi'
                        ? 'अपॉइंटमेंट बुकिंग कन्फर्म करें'
                        : 'Confirm Appointment Booking'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF57]" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
