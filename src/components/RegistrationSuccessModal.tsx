import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight, ShieldCheck, Clock, Calendar, User, Hash } from 'lucide-react';
import { Partner } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { formatDateTimeIST } from '../utils/date';

interface Props {
  isOpen: boolean;
  partner: Partner | null;
  onGoToDashboard: () => void;
}

export const RegistrationSuccessModal: React.FC<Props> = ({
  isOpen,
  partner,
  onGoToDashboard,
}) => {
  const { t } = useLanguage();

  if (!isOpen || !partner) return null;

  const { date, time } = formatDateTimeIST(partner.registered_at);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1630]/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header banner with navy & gold accent */}
          <div className="bg-[#0B1630] px-6 py-6 text-white text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D4AF57]/15 rounded-full blur-xl pointer-events-none" />
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#D4AF57]/20 border border-[#D4AF57]/40 text-[#D4AF57] mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
              {t.successModal.heading}
            </h2>
            <p className="text-[#D4AF57] font-semibold text-sm sm:text-base">
              {t.successModal.mainMessage}
            </p>
          </div>

          {/* Modal body */}
          <div className="p-6 sm:p-7 space-y-5">
            <p className="text-sm text-slate-600 text-center leading-relaxed">
              {t.successModal.supportingMessage}
            </p>

            {/* Official Credentials Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4.5 space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  {t.successModal.partnerName}
                </span>
                <span className="font-semibold text-slate-900 text-sm">{partner.full_name}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#D4AF57]" />
                  {t.successModal.partnerId}
                </span>
                <span className="font-mono font-bold text-[#0B1630] text-sm bg-[#D4AF57]/15 text-[#856318] px-2.5 py-0.5 rounded border border-[#D4AF57]/30">
                  {partner.partner_code}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {t.successModal.registrationDate}
                </span>
                <span className="font-medium text-slate-800">{date}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {t.successModal.registrationTime}
                </span>
                <span className="font-medium text-slate-800 tabular-nums">{time}</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {t.successModal.accountStatus}
                </span>
                <span className="inline-flex items-center text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-xs">
                  {t.successModal.activeStatus}
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onGoToDashboard}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 text-sm font-semibold text-white bg-[#0B1630] hover:bg-[#102A56] rounded-xl shadow-md transition-all active:scale-[0.99]"
              >
                <span>{t.successModal.dashboardBtn}</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF57]" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
