import { ShieldAlert, Cookie, UserCheck, ExternalLink, ChevronLeft, Award } from 'lucide-react';

interface LegalAndFounderSectionProps {
  onOpenDisclaimer: () => void;
  onOpenCookies: () => void;
}

export default function LegalAndFounderSection({
  onOpenDisclaimer,
  onOpenCookies,
}: LegalAndFounderSectionProps) {
  return (
    <section 
      id="legal-and-founder-section"
      aria-label="إخلاء المسؤولية وسياسة الكوكيز ومعلومات المؤسس"
      className="rounded-2xl bg-[#090D1A]/90 border border-slate-800/80 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden"
    >
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 1. Founder Card (Taha setri) */}
        <div 
          id="founder-info-card"
          className="lg:col-span-4 rounded-xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/20 border border-cyan-500/30 p-5 sm:p-6 flex flex-col justify-between shadow-[0_0_20px_rgba(6,182,212,0.08)]"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-cyan-300 font-mono font-black text-lg">
                      TS
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#090D1A] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    المؤسس والمطور
                  </span>
                  <h3 className="text-xl font-black text-slate-100 font-mono tracking-tight">
                    Taha setri
                  </h3>
                </div>
              </div>
              <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Founder
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              تم تأسيس وتطوير هذه المنصة المالية الذكية بواسطة <strong>Taha setri</strong> لتوفير تجربة مراقبة لحظية ومحاكاة متقدمة للعملات الرقمية وأسواق الذهب والعيارات، مع حاسبات دقيقة وتصميم تفاعلي فائق.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>إشراف وتطوير حصري</span>
            </div>
            <span className="font-mono text-[11px] text-cyan-400 font-medium">
              setritaha@gmail.com
            </span>
          </div>
        </div>

        {/* 2. Disclaimer Summary Card */}
        <div 
          id="disclaimer-summary-card"
          className="lg:col-span-4 rounded-xl bg-slate-900/60 border border-red-500/25 p-5 sm:p-6 flex flex-col justify-between shadow-[0_0_20px_rgba(239,68,68,0.05)]"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-red-300 font-bold text-sm sm:text-base">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>إخلاء المسؤولية المالية</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30 font-semibold">
                تحذير هام
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              التداول والاستثمار في الأصول الرقمية والسلع ينطوي على تقلبات ومخاطر حقيقية. المحتوى والبيانات والمحاكاة المعروضة في المنصة هي لأغراض الاسترشاد والمتابعة المعرفية فقط، ولا تمثل بأي وجه استشارة استثمارية أو مالية معتمدة.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              مسؤولية المستخدم كاملة
            </span>
            <button
              id="open-disclaimer-detail-btn"
              onClick={onOpenDisclaimer}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              <span>قراءة النص القانوني الكامل</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Cookies & LocalStorage Card */}
        <div 
          id="cookies-summary-card"
          className="lg:col-span-4 rounded-xl bg-slate-900/60 border border-slate-800 p-5 sm:p-6 flex flex-col justify-between shadow-[0_0_20px_rgba(15,23,42,0.3)]"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm sm:text-base">
                <Cookie className="w-4 h-4 text-amber-400" />
                <span>الكوكيز وتخزين البيانات</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                الخصوصية
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              نحن نستخدم ملفات تعريف الارتباط وتقنيات التخزين المحلي الآمنة لحفظ خيارات العملة، وتفضيلات النبضات الصوتية، وحالة الجلسة لتحسين تجربة استخدام المنصة دون تعقب هويتك الشخصية.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              تحكم دائم بالتفضيلات
            </span>
            <button
              id="open-cookies-settings-btn"
              onClick={onOpenCookies}
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>إدارة خيارات الكوكيز</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
