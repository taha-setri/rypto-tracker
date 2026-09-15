import { useState } from 'react';
import { Award, Coins, Scale, ArrowLeftRight, Sparkles, Gem } from 'lucide-react';
import { FIAT_RATES } from '../data/initialMarket';

interface GoldKaratCalculatorProps {
  goldOuncePrice: number; // in USD
  currency: string;
}

export default function GoldKaratCalculator({
  goldOuncePrice,
  currency,
}: GoldKaratCalculatorProps) {
  const [grams, setGrams] = useState<number>(31.1035); // default 1 troy ounce = 31.1035g
  const [selectedKarat, setSelectedKarat] = useState<number>(24);

  const currentFiat = FIAT_RATES[currency] || FIAT_RATES.USD;

  // 1 Troy Ounce = 31.1034768 grams of 24K pure gold
  const gram24kUSD = goldOuncePrice / 31.1034768;
  const gram22kUSD = gram24kUSD * (22 / 24);
  const gram21kUSD = gram24kUSD * (21 / 24);
  const gram18kUSD = gram24kUSD * (18 / 24);

  const karats = [
    { karat: 24, nameAr: 'عيار 24 (ذهب نقي 999.9)', priceUSD: gram24kUSD, purity: '99.9%' },
    { karat: 22, nameAr: 'عيار 22 (مجوهرات)', priceUSD: gram22kUSD, purity: '91.6%' },
    { karat: 21, nameAr: 'عيار 21 (العيار الشائع)', priceUSD: gram21kUSD, purity: '87.5%' },
    { karat: 18, nameAr: 'عيار 18 (تصاميم راقية)', priceUSD: gram18kUSD, purity: '75.0%' },
  ];

  const currentSelectedPriceUSD = 
    selectedKarat === 24 ? gram24kUSD :
    selectedKarat === 22 ? gram22kUSD :
    selectedKarat === 21 ? gram21kUSD : gram18kUSD;

  const totalCalculated = grams * currentSelectedPriceUSD * currentFiat.rate;

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-amber-500/20 p-5 backdrop-blur-xl shadow-xl relative overflow-hidden">
      {/* Gold Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Gem className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>رادار ومحول عيارات الذهب اللحظي</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                XAU/USD
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              تسعير مباشر لجرام الذهب بالعيارات الرسمية العالمية والعملة المحلية
            </p>
          </div>
        </div>

        {/* Global Ounce Price Tag */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-amber-500/20">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-400">الأونصة عالمياً:</span>
          <span className="text-sm font-bold font-mono text-amber-300">
            ${goldOuncePrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Karat Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 relative z-10">
        {karats.map((k) => {
          const priceLocal = k.priceUSD * currentFiat.rate;
          const isSelected = selectedKarat === k.karat;

          return (
            <div
              key={k.karat}
              onClick={() => setSelectedKarat(k.karat)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-950/30 border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300">عيار {k.karat}</span>
                <span className="text-[10px] font-mono text-slate-400">{k.purity}</span>
              </div>
              <div className="mt-2 text-base font-black font-mono text-slate-100">
                {currentFiat.symbol} {priceLocal.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                ${k.priceUSD.toFixed(2)} / جرام
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Weight Calculator */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
        <div className="md:col-span-7 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs text-slate-400 block mb-1">الوزن بالجرام:</label>
            <div className="relative">
              <input
                id="gold-grams-input"
                type="number"
                min="0.1"
                step="any"
                value={grams || ''}
                onChange={(e) => setGrams(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-400"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                g
              </span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 self-end pb-0.5">
            {[
              { label: 'أونصة (31.1g)', val: 31.1035 },
              { label: 'جنيه ذهب (8g)', val: 8 },
              { label: 'سبيكة 10g', val: 10 },
              { label: 'سبيكة 50g', val: 50 },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => setGrams(p.val)}
                className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 font-mono transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Total Result */}
        <div className="md:col-span-5 bg-gradient-to-l from-amber-950/40 to-slate-950 p-3.5 rounded-xl border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">
              القيمة المقدرة ({grams} جرام عيار {selectedKarat}):
            </span>
            <div className="text-xl font-black font-mono text-amber-300 mt-0.5">
              {currentFiat.symbol} {totalCalculated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              ≈ ${(grams * currentSelectedPriceUSD).toFixed(2)} USD
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
