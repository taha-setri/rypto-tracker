import { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCw, 
  Sparkles, 
  TrendingUp, 
  Coins, 
  Gauge, 
  Info,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { MarketMetrics } from '../types';

interface HeaderProps {
  metrics: MarketMetrics;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  onRefresh: () => void;
  onOpenInfoModal: () => void;
  onOpenDisclaimerModal: () => void;
}

export default function Header({
  metrics,
  isSimulating,
  setIsSimulating,
  soundEnabled,
  setSoundEnabled,
  selectedCurrency,
  setSelectedCurrency,
  onRefresh,
  onOpenInfoModal,
  onOpenDisclaimerModal,
}: HeaderProps) {
  const [isRotating, setIsRotating] = useState(false);

  const handleManualRefresh = () => {
    setIsRotating(true);
    onRefresh();
    setTimeout(() => setIsRotating(false), 600);
  };

  return (
    <div className="w-full bg-[#090D1A]/80 border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Main Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Logo and App Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 via-cyan-500/10 to-emerald-500/20 border border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-l from-amber-200 via-yellow-100 to-cyan-200">
                  لوحة متابعة أسواق العملات الرقمية والذهب
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  AURUM & CRYPTO V3.5
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-cyan-950/70 text-cyan-300 border border-cyan-500/30">
                  <UserCheck className="w-3 h-3 text-cyan-400" />
                  <span>المؤسس: <strong className="font-semibold text-white">Taha setri</strong></span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-2">
                <span>تحديثات حية لحظية</span>
                <span className="text-slate-600">•</span>
                <span>إضاءة محيطية تفاعلية</span>
                <span className="text-slate-600">•</span>
                <span>حاسبة أرباح وخسائر ذكية</span>
              </p>
            </div>
          </div>

          {/* Interactive Controls & Currency Switcher */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-lg p-1">
              <Coins className="w-3.5 h-3.5 text-slate-400 mx-1.5" />
              {(['USD', 'SAR', 'AED', 'EGP', 'KWD'] as const).map((curr) => (
                <button
                  key={curr}
                  id={`currency-btn-${curr}`}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`px-2 py-1 rounded text-xs font-medium font-mono transition-all ${
                    selectedCurrency === curr
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Live Simulation Toggle */}
            <button
              id="live-simulation-toggle"
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                isSimulating
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-300'
              }`}
              title={isSimulating ? 'إيقاف البث الحي' : 'تشغيل البث الحي'}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-400" />
                  <span>محاكاة: نشطة</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-slate-400" />
                  <span>محاكاة: متوقفة</span>
                </>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              id="sound-toggle"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border text-xs transition-all ${
                soundEnabled
                  ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={soundEnabled ? 'كتم النبضات الصوتية' : 'تفعيل النبضات الصوتية'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Manual Sync Button */}
            <button
              id="manual-refresh-btn"
              onClick={handleManualRefresh}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
              title="تحديث البيانات فورياً"
            >
              <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {/* Disclaimer Modal trigger */}
            <button
              id="disclaimer-modal-btn"
              onClick={onOpenDisclaimerModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/50 border border-red-500/30 hover:border-red-500/50 text-red-300 text-xs font-semibold transition-all"
              title="إخلاء المسؤولية القانونية والمالية"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">إخلاء المسؤولية</span>
            </button>

            {/* Info modal */}
            <button
              id="terminal-info-btn"
              onClick={onOpenInfoModal}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              title="دليل المؤشرات ومصادر البيانات"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Global Market Metrics Strip */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/60 flex items-center justify-between">
            <span className="text-slate-400">القيمة السوقية الإجمالية:</span>
            <span className="font-mono font-bold text-slate-200">{metrics.totalMarketCap}</span>
          </div>

          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/60 flex items-center justify-between">
            <span className="text-slate-400">حجم التداول 24س:</span>
            <span className="font-mono font-bold text-cyan-300">{metrics.volume24h}</span>
          </div>

          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/60 flex items-center justify-between">
            <span className="text-slate-400">هيمنة البيتكوين:</span>
            <span className="font-mono font-bold text-amber-400">{metrics.btcDominance}%</span>
          </div>

          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/60 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-emerald-400" />
              <span>مؤشر الخوف/الطمع:</span>
            </span>
            <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
              <span>{metrics.fearAndGreedIndex}</span>
              <span className="text-[10px] text-emerald-400/80">(طمع)</span>
            </span>
          </div>

          <div className="hidden lg:flex bg-slate-950/50 p-2 rounded-lg border border-slate-800/60 items-center justify-between col-span-1">
            <span className="text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-yellow-400" />
              <span>أوقية الذهب العالمية:</span>
            </span>
            <span className="font-mono font-bold text-amber-300">${metrics.goldOunceUSD.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
