import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';

interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
];

interface LanguageSelectorProps {
  variant?: 'header' | 'mobile' | 'footer';
  onLanguageChange?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  onLanguageChange,
}) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange();
    }
  };

  if (variant === 'mobile') {
    return (
      <div className="space-y-1.5 w-full">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 px-1">
          <Globe className="w-3.5 h-3.5 text-[#D4AF57]" />
          <span>Language / ભાષા / भाषा:</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          {LANGUAGES.map((item) => {
            const isActive = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelect(item.code)}
                className={`py-2 px-2 text-xs font-medium rounded-lg text-center transition-all ${
                  isActive
                    ? 'bg-[#1D4ED8] text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.nativeLabel}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select Language"
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700/90 text-slate-100 border border-slate-700 hover:border-[#D4AF57]/40 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 group focus:outline-none focus:ring-2 focus:ring-[#D4AF57]/30"
      >
        <Globe className="w-3.5 h-3.5 text-[#D4AF57] transition-transform duration-200 group-hover:rotate-12" />
        <span className="font-medium tracking-wide">{currentOption.nativeLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#D4AF57]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#0B1630] border border-slate-700/90 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF57]">
              Select Language
            </span>
          </div>

          <div className="p-1 space-y-0.5" role="menu" aria-orientation="vertical">
            {LANGUAGES.map((item) => {
              const isActive = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  role="menuitem"
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1D4ED8] text-white font-semibold'
                      : 'text-slate-200 hover:bg-slate-800/90 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{item.nativeLabel}</span>
                    <span
                      className={`text-[10px] ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {isActive && (
                    <Check className="w-4 h-4 text-[#D4AF57] shrink-0 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
