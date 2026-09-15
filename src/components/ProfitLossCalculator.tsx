import { useState, useMemo, useEffect } from 'react';
import { AssetData, AssetId, PositionType } from '../types';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Percent, 
  ShieldAlert, 
  DollarSign, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw,
  Scale,
  Award
} from 'lucide-react';
import { FIAT_RATES } from '../data/initialMarket';
import { playSuccessSound } from '../utils/audio';

interface ProfitLossCalculatorProps {
  assets: AssetData[];
  selectedAssetId: AssetId;
  onSelectAsset: (id: AssetId) => void;
  currency: string;
  soundEnabled: boolean;
}

export default function ProfitLossCalculator({
  assets,
  selectedAssetId,
  onSelectAsset,
  currency,
  soundEnabled,
}: ProfitLossCalculatorProps) {
  const currentAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const currentFiat = FIAT_RATES[currency] || FIAT_RATES.USD;

  // Form states
  const [positionType, setPositionType] = useState<PositionType>('LONG');
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000);
  const [entryPrice, setEntryPrice] = useState<number>(currentAsset.price);
  const [exitPrice, setExitPrice] = useState<number>(() => {
    return Number((currentAsset.price * 1.08).toFixed(2));
  });
  const [leverage, setLeverage] = useState<number>(1);
  const [feeRate, setFeeRate] = useState<number>(0.08); // 0.08%
  const [copied, setCopied] = useState(false);

  // Update entry price when user changes asset
  useEffect(() => {
    setEntryPrice(currentAsset.price);
    setExitPrice(Number((currentAsset.price * (positionType === 'LONG' ? 1.08 : 0.92)).toFixed(2)));
  }, [currentAsset.id]);

  // Calculations
  const results = useMemo(() => {
    const safeEntry = entryPrice > 0 ? entryPrice : 1;
    const safeExit = exitPrice > 0 ? exitPrice : 1;
    const safeInvest = investmentAmount > 0 ? investmentAmount : 0;
    const positionSize = safeInvest * leverage;
    const quantity = positionSize / safeEntry;

    // Gross PnL
    let priceDelta = safeExit - safeEntry;
    if (positionType === 'SHORT') {
      priceDelta = safeEntry - safeExit;
    }

    const priceChangePct = (priceDelta / safeEntry) * 100;
    const grossPnL = quantity * priceDelta;

    // Fees: Applied on both entry & exit position size
    const exitPositionSize = quantity * safeExit;
    const totalFees = (positionSize + exitPositionSize) * (feeRate / 100);

    const netPnL = grossPnL - totalFees;
    const roi = safeInvest > 0 ? (netPnL / safeInvest) * 100 : 0;
    const totalExitValue = safeInvest + netPnL;

    // Estimated liquidation price
    let liquidationPrice: number | null = null;
    if (leverage > 1) {
      const maintenanceMargin = 0.005; // 0.5%
      if (positionType === 'LONG') {
        liquidationPrice = safeEntry * (1 - 1 / leverage + maintenanceMargin);
      } else {
        liquidationPrice = safeEntry * (1 + 1 / leverage - maintenanceMargin);
      }
    }

    return {
      positionSize,
      quantity,
      priceChangePct,
      grossPnL,
      totalFees,
      netPnL,
      roi,
      totalExitValue,
      liquidationPrice,
      isProfit: netPnL >= 0,
    };
  }, [investmentAmount, entryPrice, exitPrice, leverage, feeRate, positionType]);

  // Sync entry price with live market price
  const handleSyncCurrentPrice = () => {
    setEntryPrice(currentAsset.price);
  };

  // Quick exit percentage presets
  const handleApplyPreset = (pct: number) => {
    const mult = positionType === 'LONG' ? 1 + pct / 100 : 1 - pct / 100;
    const newExit = Number((entryPrice * mult).toFixed(2));
    setExitPrice(newExit);
    if (pct > 0 && soundEnabled) {
      playSuccessSound();
    }
  };

  const handleCopySummary = () => {
    const summary = `📊 تقرير حاسبة الأرباح والخسائر:
• الأصل: ${currentAsset.nameAr} (${currentAsset.symbol})
• نوع الصفقة: ${positionType === 'LONG' ? 'شراء / صعود (Long)' : 'بيع / هبوط (Short)'}
• رأس المال: $${investmentAmount.toLocaleString()} (${(investmentAmount * currentFiat.rate).toLocaleString()} ${currentFiat.symbol})
• الرافعة المالية: ${leverage}x
• سعر الدخول: $${entryPrice.toLocaleString()}
• سعر الخروج: $${exitPrice.toLocaleString()}
• صافي النتيجة: ${results.netPnL >= 0 ? '+' : ''}$${results.netPnL.toFixed(2)} (${results.roi.toFixed(2)}%)
• إجمالي العائد: $${Math.max(0, results.totalExitValue).toFixed(2)}`;

    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="pnl-calculator-section"
      className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden"
    >
      {/* Dynamic ambient rim glow based on profit or loss */}
      <div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full pointer-events-none blur-3xl transition-all duration-700 opacity-20"
        style={{
          background: results.isProfit ? '#10B981' : '#F43F5E',
        }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>حاسبة الأرباح والخسائر الذكية</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ردود بصرية فورية
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              احسب عائد الصفقات، الرافعة المالية، ونسب التصفية بدقة رياضية لحظية
            </p>
          </div>
        </div>

        {/* Position Type Selector: Long vs Short */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            id="position-long-btn"
            onClick={() => setPositionType('LONG')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              positionType === 'LONG'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>صعود (Long)</span>
          </button>
          <button
            id="position-short-btn"
            onClick={() => setPositionType('SHORT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              positionType === 'SHORT'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>هبوط (Short)</span>
          </button>
        </div>
      </div>

      {/* Calculator Grid: Inputs on Right (in RTL), Immediate Visual Feedback on Left */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 relative z-10">
        {/* INPUTS COLUMN (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Asset Picker Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              الأصل الاستثماري المراد حسابه:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  id={`calc-asset-tab-${asset.id}`}
                  onClick={() => onSelectAsset(asset.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                    asset.id === selectedAssetId
                      ? 'bg-slate-800 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="font-mono">{asset.id}</span>
                  <span className="text-[10px] text-slate-400">{asset.nameAr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Investment Capital ($) */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>رأس المال المستثمر:</span>
              <span className="text-slate-400 font-mono">
                ≈ {(investmentAmount * currentFiat.rate).toLocaleString('en-US', { maximumFractionDigits: 1 })}{' '}
                {currentFiat.symbol}
              </span>
            </div>
            <div className="relative">
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                $
              </span>
              <input
                id="calc-investment-input"
                type="number"
                min="10"
                step="50"
                value={investmentAmount || ''}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pr-9 pl-4 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                placeholder="1000"
              />
            </div>
            {/* Quick Capital Presets */}
            <div className="flex items-center gap-2 mt-2">
              {[250, 500, 1000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setInvestmentAmount(amt)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                    investmentAmount === amt
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* Entry Price & Exit Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Entry Price */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>سعر الدخول:</span>
                <button
                  id="calc-sync-price-btn"
                  onClick={handleSyncCurrentPrice}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono underline"
                  title="استخدم سعر السوق المحدث الآن"
                >
                  <Zap className="w-3 h-3" />
                  <span>السعر اللحظي</span>
                </button>
              </div>
              <div className="relative">
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  $
                </span>
                <input
                  id="calc-entry-price-input"
                  type="number"
                  step="any"
                  value={entryPrice || ''}
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pr-9 pl-4 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>

            {/* Exit Price */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>سعر الخروج المستهدف:</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {results.priceChangePct >= 0 ? '+' : ''}
                  {results.priceChangePct.toFixed(2)}%
                </span>
              </div>
              <div className="relative">
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  $
                </span>
                <input
                  id="calc-exit-price-input"
                  type="number"
                  step="any"
                  value={exitPrice || ''}
                  onChange={(e) => setExitPrice(Number(e.target.value))}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pr-9 pl-4 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Quick Exit Target Presets */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5">أهداف سريعة للربح والخسارة:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[5, 10, 20, 35, 50].map((pct) => (
                <button
                  key={`plus-${pct}`}
                  onClick={() => handleApplyPreset(pct)}
                  className="px-2 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/30 transition-all"
                >
                  +{pct}% ربح
                </button>
              ))}
              {[-5, -10, -20].map((pct) => (
                <button
                  key={`minus-${pct}`}
                  onClick={() => handleApplyPreset(pct)}
                  className="px-2 py-1 rounded-lg text-xs font-mono font-medium bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 transition-all"
                >
                  {pct}% وقف
                </button>
              ))}
            </div>
          </div>

          {/* Leverage Slider */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <div className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>الرافعة المالية (Leverage):</span>
              </div>
              <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                {leverage}x {leverage === 1 ? '(تداول فوري بدون رافعة)' : ''}
              </span>
            </div>

            <input
              id="calc-leverage-slider"
              type="range"
              min="1"
              max="50"
              step="1"
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>1x (Spot)</span>
              <span>5x</span>
              <span>10x</span>
              <span>25x</span>
              <span>50x (مخاطرة عالية)</span>
            </div>
          </div>
        </div>

        {/* FEEDBACK & RESULTS COLUMN (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div
            className={`rounded-2xl p-5 border transition-all duration-500 ${
              results.isProfit
                ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                : 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.2)]'
            }`}
          >
            {/* Profit/Loss Top Visual Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                النتيجة الصافية المقدرة
              </span>
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  results.isProfit
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {results.isProfit ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{results.isProfit ? 'ربح صافي' : 'خسارة محققة'}</span>
              </div>
            </div>

            {/* Huge Net PnL Number */}
            <div className="mt-4">
              <div
                className={`text-3xl sm:text-4xl font-black font-mono tracking-tight transition-all duration-300 ${
                  results.isProfit ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                }`}
              >
                {results.netPnL >= 0 ? '+' : ''}${results.netPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">
                ≈ {(results.netPnL * currentFiat.rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                {currentFiat.symbol}
              </div>
            </div>

            {/* ROI & Visual Meter */}
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">العائد على الاستثمار (ROI):</span>
                <span
                  className={`font-mono font-bold text-base ${
                    results.isProfit ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {results.roi >= 0 ? '+' : ''}
                  {results.roi.toFixed(2)}%
                </span>
              </div>

              {/* Glowing Dynamic Gauge */}
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
                <div
                  className={`h-full transition-all duration-500 ${
                    results.isProfit
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-300 shadow-[0_0_10px_#10B981]'
                      : 'bg-gradient-to-r from-rose-600 to-red-400 shadow-[0_0_10px_#F43F5E]'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(5, Math.abs(results.roi)))}%`,
                  }}
                />
              </div>
            </div>

            {/* Detailed Stats Matrix */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>حجم المركز الكلي (Position Size):</span>
                <span className="font-mono font-semibold text-slate-200">
                  ${results.positionSize.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>كمية الأصول ({currentAsset.unit}):</span>
                <span className="font-mono font-semibold text-cyan-300">
                  {results.quantity.toFixed(4)} {currentAsset.unit}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>إجمالي الرسوم المقدرة:</span>
                <span className="font-mono text-slate-300">${results.totalFees.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span>إجمالي القيمة عند الخروج:</span>
                <span className="font-mono font-bold text-slate-100 text-sm">
                  ${Math.max(0, results.totalExitValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Liquidation warning if leverage > 1 */}
              {results.liquidationPrice && (
                <div className="mt-2 p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-amber-300 text-xs">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>سعر التصفية المقدر:</span>
                  </div>
                  <span className="font-mono font-bold text-amber-200">
                    ${results.liquidationPrice.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Commentary Feedback */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {results.isProfit ? (
                <p className="flex items-start gap-1.5 text-emerald-300">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span>
                    سيناريو إيجابي: الصفقة تحقق عائداً قدره <strong>{results.roi.toFixed(1)}%</strong> بربح صافٍ يتجاوز تكلفة الرسوم.
                  </span>
                </p>
              ) : (
                <p className="flex items-start gap-1.5 text-rose-300">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>
                    تنبيه: حركة السعر الحالية تعكس خسارة بنسبة <strong>{Math.abs(results.roi).toFixed(1)}%</strong>. يرجى مراجعة إدارة المخاطر وأمر وقف الخسارة.
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-3">
            <button
              id="calc-copy-summary-btn"
              onClick={handleCopySummary}
              className="flex-1 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>تم نسخ التقرير بنجاح!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-cyan-400" />
                  <span>نسخ ملخص الصفقة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
