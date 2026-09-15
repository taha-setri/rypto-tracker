import { X, ShieldAlert, AlertTriangle, Scale, Lock, Info, CheckCircle2, UserCheck } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      id="disclaimer-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="disclaimer-modal-dialog"
        className="bg-[#0B0F19] border border-red-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.15)] relative text-right"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Close Button */}
        <button
          id="close-disclaimer-btn"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          aria-label="إغلاق إخلاء المسؤولية"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-800/80">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>إخلاء المسؤولية القانونية والمالية</span>
              <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/30">
                إشعار هام
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              يرجى قراءة هذه الشروط والتحذيرات بعناية قبل التفاعل مع منصة الأسواق
            </p>
          </div>
        </div>

        {/* Disclaimer Points */}
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          {/* Warning Banner */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              <strong>تحذير المخاطر العالية:</strong> تداول واستثمار العملات الرقمية المشفرة (Cryptocurrency) والمعادن الثمينة كالذهب (Gold/XAU) ينطوي على مخاطر مالية جسيمة وتقلبات حادة في الأسعار قد تؤدي إلى خسارة كامل رأس المال المستثمر.
            </p>
          </div>

          {/* Point 1: Not Financial Advice */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Scale className="w-4 h-4 text-amber-400" />
              <h4>ليست استشارة مالية أو توصية استثمارية</h4>
            </div>
            <p className="text-slate-400">
              جميع الأسعار، المؤشرات، التحليلات، وحاسبات الأرباح والخسائر (PnL) المعروضة على هذه اللوحة مقدّمة لأغراض <strong>الاسترشاد التعليمي، المحاكاة التفاعلية، والمتابعة المعرفية اللحظية فقط</strong>. لا تشكل أي معلومة مقدمة هنا استشارة استثمارية، قانونية، ضريبية أو مالية، ولا تعتبر عرضاً أو طلباً لشراء أو بيع أي أصل رقمي أو سلعة.
            </p>
          </div>

          {/* Point 2: Market Simulation & Accuracy */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Info className="w-4 h-4 text-cyan-400" />
              <h4>دقة البيانات ومحاكاة التقلبات</h4>
            </div>
            <p className="text-slate-400">
              تعتمد اللوحة على خوارزميات محاكاة تذبذب حركية متقدمة لتوفير ردود بصرية فورية ومؤشرات تدفق صفقات مستمرة. على الرغم من بذل أقصى جهد لتقديم بيانات تقريبية متوافقة مع نبض السوق، فإن إدارة المنصة والمؤسس لا يقدمون أي ضمانات صريحة أو ضمنية بشأن دقة أو اكتمال أو حداثة أو ملاءمة هذه البيانات لأي قرار تداول حي.
            </p>
          </div>

          {/* Point 3: User Responsibility */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h4>المسؤولية الحصرية للمستخدم</h4>
            </div>
            <p className="text-slate-400">
              يتحمل المستخدم منفرداً كامل المسؤولية عن أي أفعال أو قرارات مالية يتم اتخاذها استناداً إلى المحتوى المعروض. ننصح دائماً بالرجوع إلى مستشار مالي مستقل ومرخص رسمياً قبل الانخراط في أي معاملات تداول حقيقية في الأسواق المالية العالمية.
            </p>
          </div>

          {/* Founder Credit Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 via-slate-900 to-amber-950/20 border border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-cyan-300">
                TS
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>المؤسس والمطور:</span>
                  <span className="text-cyan-300 font-mono font-bold text-sm">Taha setri</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  لوحة متابعة أسواق العملات الرقمية والذهب • جميع الحقوق محفوظة
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Verified Founder
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>باستخدامك لهذه اللوحة، فإنك تقر وتوافق على ما ورد أعلاه</span>
          </div>
          <button
            id="acknowledge-disclaimer-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs transition-all shadow-[0_0_15px_rgba(239,68,68,0.25)]"
          >
            فهمت وموافق
          </button>
        </div>
      </div>
    </div>
  );
}
