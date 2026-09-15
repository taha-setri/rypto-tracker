import { X, ShieldCheck, HelpCircle, Activity, Sparkles, Award } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              دليل لوحة متابعة أسواق العملات الرقمية والذهب
            </h3>
            <p className="text-xs text-slate-400">
              منصة متابعة مالية مستقبلية فائقة التطور
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>محاكاة الأسعار اللحظية (Live Engine)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              تعتمد اللوحة على خوارزمية محاكاة عشوائية دقيقة (Geometric Brownian Motion) لضخ تقلبات دقيقة في أسعار البيتكوين، الإيثريوم، BNB، وأونصة الذهب، مع تتبع اتجاهات الـ 24 ساعة وتحديث الرسوم التفاعلية والشمعات فورياً.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>شريط الشبكة العلوي (Network Bar)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              يربط هذا الموقع بشبكة حواسب الأدوات التقنية، ويمكنك النقر على الزر في أعلى الصفحة للرجوع إلى الموقع السابق في الشبكة (tech-calculators.vercel.app).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>حاسبة الأرباح والخسائر التفاعلية (PnL)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              تدعم صفقات الشراء (Long) والبيع (Short)، مع إمكانية ضبط الرافعة المالية (1x إلى 50x)، واحتساب رسوم التداول ونسب التصفية مع ردود بصرية وألوان ديناميكية متوهجة فور كتابة أي رقم.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">مؤسس ومطور المنصة:</span>
              <span className="text-sm font-bold font-mono text-cyan-300">Taha setri</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
              Founder & Creator
            </span>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
