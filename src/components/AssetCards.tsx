import { AssetData, AssetId } from '../types';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Award, Zap, Shield } from 'lucide-react';
import { FIAT_RATES } from '../data/initialMarket';

interface AssetCardsProps {
  assets: AssetData[];
  selectedAssetId: AssetId;
  onSelectAsset: (id: AssetId) => void;
  currency: string;
}

export default function AssetCards({
  assets,
  selectedAssetId,
  onSelectAsset,
  currency,
}: AssetCardsProps) {
  const currentFiat = FIAT_RATES[currency] || FIAT_RATES.USD;

  const formatPrice = (usdPrice: number, assetId: AssetId) => {
    const converted = usdPrice * currentFiat.rate;
    if (assetId === 'BTC') {
      return `${currentFiat.symbol} ${converted.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
    }
    if (assetId === 'ETH' || assetId === 'XAU') {
      return `${currentFiat.symbol} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${currentFiat.symbol} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getAssetIcon = (type: AssetData['iconType']) => {
    switch (type) {
      case 'bitcoin':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono text-lg shadow-[0_0_15px_rgba(247,147,26,0.3)]">
            ₿
          </div>
        );
      case 'ethereum':
        return (
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono text-lg shadow-[0_0_15px_rgba(98,126,234,0.3)]">
            Ξ
          </div>
        );
      case 'binance':
        return (
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold font-mono text-base shadow-[0_0_15px_rgba(243,186,47,0.3)]">
            BNB
          </div>
        );
      case 'gold':
        return (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-300/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold font-mono text-sm shadow-[0_0_20px_rgba(230,198,87,0.4)]">
            <Award className="w-5 h-5 text-amber-300" />
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {assets.map((asset) => {
        const isSelected = asset.id === selectedAssetId;
        const isPositive = asset.change24h >= 0;
        const tickUp = asset.lastTickDirection === 'up';

        // Sparkline calculations
        const minVal = Math.min(...asset.history);
        const maxVal = Math.max(...asset.history);
        const range = maxVal - minVal || 1;
        const width = 160;
        const height = 44;
        const points = asset.history
          .map((val, idx) => {
            const x = (idx / (asset.history.length - 1)) * width;
            const y = height - ((val - minVal) / range) * (height - 8) - 4;
            return `${x},${y}`;
          })
          .join(' ');

        return (
          <div
            key={asset.id}
            id={`asset-card-${asset.id.toLowerCase()}`}
            onClick={() => onSelectAsset(asset.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectAsset(asset.id);
              }
            }}
            className={`group relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
              isSelected
                ? 'bg-slate-900/90 border-2 shadow-2xl scale-[1.01]'
                : 'bg-slate-900/50 hover:bg-slate-900/80 border hover:scale-[1.005]'
            }`}
            style={{
              borderColor: isSelected ? asset.color : 'rgba(51, 65, 85, 0.4)',
              boxShadow: isSelected
                ? `0 0 35px ${asset.glowColor}, inset 0 0 20px ${asset.glowColor}`
                : '0 4px 20px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Ambient Radial Spotlight inside the card */}
            <div
              className="absolute -top-16 -right-16 w-36 h-36 rounded-full pointer-events-none transition-opacity duration-500 blur-2xl"
              style={{
                background: asset.color,
                opacity: isSelected ? 0.18 : 0.08,
              }}
            />

            {/* Header: Icon, Name, Symbol, and Selected Indicator */}
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                {getAssetIcon(asset.iconType)}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-white">
                      {asset.nameAr}
                    </h3>
                    {asset.id === 'XAU' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        24K
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {asset.symbol}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
                  isPositive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {asset.change24h.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Price Display with Glowing Tick Transition */}
            <div className="mt-4 relative z-10">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>السعر اللحظي:</span>
                {isSelected && (
                  <span className="text-cyan-400 text-[10px] font-mono flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>محدد للرسم والحاسبة</span>
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-2xl font-black font-mono tracking-tight transition-colors duration-300 ${
                    tickUp ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {formatPrice(asset.price, asset.id)}
                </span>
              </div>
            </div>

            {/* Glowing Mini Sparkline */}
            <div className="mt-3 pt-2 relative z-10">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>اتجاه 24 ساعة</span>
                <span className="text-[10px]">
                  أدنى: {formatPrice(asset.low24h, asset.id)}
                </span>
              </div>
              <div className="w-full h-11 flex items-center">
                <svg
                  viewBox={`0 0 ${width} ${height}`}
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient
                      id={`gradient-${asset.id}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={isPositive ? '#10B981' : '#F43F5E'}
                        stopOpacity="0.35"
                      />
                      <stop
                        offset="100%"
                        stopColor={isPositive ? '#10B981' : '#F43F5E'}
                        stopOpacity="0.0"
                      />
                    </linearGradient>
                  </defs>
                  {/* Fill below line */}
                  <polygon
                    points={`0,${height} ${points} ${width},${height}`}
                    fill={`url(#gradient-${asset.id})`}
                  />
                  {/* Glowing Stroke */}
                  <polyline
                    fill="none"
                    stroke={isPositive ? '#10B981' : '#F43F5E'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    style={{
                      filter: `drop-shadow(0 0 4px ${isPositive ? '#10B981' : '#F43F5E'})`,
                    }}
                  />
                </svg>
              </div>
            </div>

            {/* Footer metrics: High & Volume */}
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <div>
                <span>أعلى: </span>
                <span className="text-slate-300 font-semibold">
                  {formatPrice(asset.high24h, asset.id)}
                </span>
              </div>
              <div>
                <span>الحجم: </span>
                <span className="text-slate-300 font-semibold">{asset.volume24h}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
