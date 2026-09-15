import { useState, useEffect } from 'react';
import { Cookie, Check, ShieldCheck, Settings, X, Info } from 'lucide-react';

interface CookieBannerProps {
  forceOpenModal?: boolean;
  onCloseModal?: () => void;
}

export default function CookieBanner({ forceOpenModal = false, onCloseModal }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    preferences: true,
    analytics: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('aurum_cookie_consent');
    if (!consent && !forceOpenModal) {
      // Delay slightly for smoother entrance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [forceOpenModal]);

  useEffect(() => {
    if (forceOpenModal) {
      setIsDetailsOpen(true);
    }
  }, [forceOpenModal]);

  const handleAcceptAll = () => {
    localStorage.setItem('aurum_cookie_consent', JSON.stringify({ necessary: true, preferences: true, analytics: true }));
    setIsVisible(false);
    setIsDetailsOpen(false);
    if (onCloseModal) onCloseModal();
  };

  const handleSaveCustom = () => {
    localStorage.setItem('aurum_cookie_consent', JSON.stringify(preferences));
    setIsVisible(false);
    setIsDetailsOpen(false);
    if (onCloseModal) onCloseModal();
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem('aurum_cookie_consent', JSON.stringify({ necessary: true, preferences: false, analytics: false }));
    setIsVisible(false);
    setIsDetailsOpen(false);
    if (onCloseModal) onCloseModal();
  };

  return (
    <>
      {/* Bottom Floating Cookie Consent Banner */}
      {isVisible && !isDetailsOpen && (
        <aside
          id="cookie-consent-banner"
          aria-label="إشعار ملفات تعريف الارتباط والكوكيز"
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-40 bg-[#0B0F19]/95 border border-cyan-500/30 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.15)] text-right animate-slide-up"
          dir="rtl"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <span>إشعار ملفات تعريف الارتباط (Cookies)</span>
                </h3>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-slate-500 hover:text-slate-300 p-1"
                  aria-label="إغلاق التنبيه مؤقتاً"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400 mt-1.5">
                نستخدم الكوكيز وتخزين المتصفح المحلي (LocalStorage) لحفظ تفضيلات العملة، وإعدادات المؤثرات الصوتية، وبيانات المحاكاة لتوفير تجربة تداول سلسة ومخصصة.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <button
              id="cookie-customize-btn"
              onClick={() => setIsDetailsOpen(true)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              تخصيص الإعدادات
            </button>

            <div className="flex items-center gap-2">
              <button
                id="cookie-reject-btn"
                onClick={handleRejectNonEssential}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
              >
                الأساسية فقط
              </button>
              <button
                id="cookie-accept-all-btn"
                onClick={handleAcceptAll}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-bold shadow-[0_0_12px_rgba(6,182,212,0.35)] transition-all flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>قبول الكل</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Detailed Cookie Settings & Privacy Policy Modal */}
      {isDetailsOpen && (
        <div 
          id="cookie-policy-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
          onClick={() => {
            setIsDetailsOpen(false);
            if (onCloseModal) onCloseModal();
          }}
        >
          <div
            id="cookie-policy-modal-dialog"
            className="bg-[#0B0F19] border border-cyan-500/30 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative text-right"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Close Button */}
            <button
              id="close-cookie-modal-btn"
              onClick={() => {
                setIsDetailsOpen(false);
                if (onCloseModal) onCloseModal();
              }}
              className="absolute top-5 left-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="إغلاق إعدادات الكوكيز"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cookie className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>سياسة ملفات تعريف الارتباط (Cookies & LocalStorage)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  لوحة متابعة أسواق العملات الرقمية والذهب • تحكّم كامل في خصوصيتك
                </p>
              </div>
            </div>

            {/* Content List */}
            <div className="space-y-3.5 text-xs text-slate-300">
              {/* Category 1: Essential */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>ملفات تعريف الارتباط والتخزين الضرورية (Essential)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      إلزامية
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    ضرورية لتمكين الوظائف الأساسية للوحة، وتأمين تدفق الجلسة، وتخزين موافقتك على الشروط القانونية ومفتاح حالة الاتصال. لا يمكن إيقافها.
                  </p>
                </div>
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="rounded border-slate-700 text-emerald-500 cursor-not-allowed opacity-75"
                  />
                </div>
              </div>

              {/* Category 2: Preferences */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                    <Settings className="w-4 h-4 text-cyan-400" />
                    <span>تفضيلات المستخدم والواجهة (Preferences)</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    تتيح حفظ العملة المفضلة (USD, EUR, SAR, AED)، حالة تشغيل أو كتم النبضات الصوتية، وحفظ الأصول المفضلة في حاسبة الأرباح والخسائر.
                  </p>
                </div>
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={preferences.preferences}
                    onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 cursor-pointer w-4 h-4"
                  />
                </div>
              </div>

              {/* Category 3: Analytics */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                    <Info className="w-4 h-4 text-amber-400" />
                    <span>تحسين أداء التفاعل والمحاكاة (Analytics)</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    تساعدنا على قياس سرعة استجابة المحرك التفاعلي ورصد أي أخطاء برمجية لتحسين تجربة جميع زوار المنصة باستمرار دون جمع أي بيانات شخصية حساسة.
                  </p>
                </div>
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 cursor-pointer w-4 h-4"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              <button
                id="cookie-reject-all-btn"
                onClick={handleRejectNonEssential}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                رفض غير الأساسية
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="cookie-save-preferences-btn"
                  onClick={handleSaveCustom}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors"
                >
                  حفظ اختياراتي
                </button>
                <button
                  id="cookie-accept-all-modal-btn"
                  onClick={handleAcceptAll}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                >
                  قبول الكل
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
