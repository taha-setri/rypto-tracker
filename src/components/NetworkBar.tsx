import { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink, Globe, Wifi, Activity, ShieldCheck } from 'lucide-react';

interface NetworkBarProps {
  networkUrl?: string;
}

export default function NetworkBar({
  networkUrl = 'https://tech-calculators.vercel.app/',
}: NetworkBarProps) {
  const [timeStr, setTimeStr] = useState<string>('');
  const [ping] = useState<number>(19);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header id="network-bar" className="w-full bg-[#070A12]/95 border-b border-cyan-500/20 backdrop-blur-md sticky top-0 z-50 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-11 flex items-center justify-between gap-3">
        {/* Network Identity & Back Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <a
            id="network-back-link"
            href={networkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-100 transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)] shrink-0"
            title="الانتقال إلى الموقع السابق في شبكة الحواسب التقنية"
          >
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium tracking-wide">العودة للموقع السابق في الشبكة</span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

          {/* Network Hub Info */}
          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-300 font-medium">شبكة الحواسب والأنظمة التقنية</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800/80 text-cyan-400 border border-slate-700 font-mono">
              TECH-CALCULATORS
            </span>
          </div>
        </div>

        {/* Live Network Telemetry */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] font-semibold tracking-wider">LIVE FEED</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>{ping}ms</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-300 font-mono bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span className="text-[11px]">{timeStr || '00:00:00'}</span>
          </div>

          <div className="hidden xl:flex items-center gap-1 text-slate-500 text-[10px]">
            <ShieldCheck className="w-3 h-3 text-emerald-400/80" />
            <span>نظام مشفر ومؤمن</span>
          </div>
        </div>
      </div>
    </header>
  );
}
