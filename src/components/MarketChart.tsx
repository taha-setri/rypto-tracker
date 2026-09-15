import { useState, useMemo } from 'react';
import { AssetData, Timeframe } from '../types';
import { 
  BarChart2, 
  TrendingUp, 
  Clock, 
  Sliders, 
  Maximize2, 
  Layers, 
  Compass, 
  Flame
} from 'lucide-react';
import { FIAT_RATES } from '../data/initialMarket';

interface MarketChartProps {
  asset: AssetData;
  currency: string;
}

export default function MarketChart({ asset, currency }: MarketChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('24H');
  const [chartType, setChartType] = useState<'area' | 'candles' | 'line'>('area');
  const [showMA, setShowMA] = useState<boolean>(true);
  const [showBollinger, setShowBollinger] = useState<boolean>(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const currentFiat = FIAT_RATES[currency] || FIAT_RATES.USD;

  // Generate extended chart data points according to timeframe
  const chartPoints = useMemo(() => {
    // Base multiplier according to timeframe
    const count = timeframe === '1M' ? 15 : timeframe === '15M' ? 24 : timeframe === '1H' ? 30 : timeframe === '24H' ? 36 : 42;
    const basePrice = asset.price;
    const volatility = asset.id === 'BTC' ? 0.015 : asset.id === 'ETH' ? 0.02 : asset.id === 'BNB' ? 0.018 : 0.006;
    
    // Seeded random walk anchored at asset.price at the end
    const points: { time: string; price: number; high: number; low: number; open: number; close: number }[] = [];
    let current = basePrice * (1 - (asset.change24h / 100) * 0.7);

    for (let i = 0; i < count; i++) {
      const delta = (Math.sin(i * 0.7) + (Math.sin(i * 1.5) * 0.5) + (i / count - 0.5)) * basePrice * volatility;
      const open = i === 0 ? current : points[i - 1].close;
      const close = i === count - 1 ? basePrice : open + delta * 0.4;
      const high = Math.max(open, close) + Math.abs(delta) * 0.5;
      const low = Math.min(open, close) - Math.abs(delta) * 0.5;

      let timeLabel = '';
      if (timeframe === '1M') timeLabel = `${15 - i} دقيقة مضت`;
      else if (timeframe === '15M') timeLabel = `${24 - i * 15} د`;
      else if (timeframe === '1H') timeLabel = `${i}:00`;
      else if (timeframe === '24H') timeLabel = `${(i * 40) % 60}:00`;
      else timeLabel = `يوم ${i + 1}`;

      points.push({
        time: timeLabel,
        price: close,
        open,
        close,
        high,
        low,
      });
    }
    return points;
  }, [asset.price, asset.change24h, asset.id, timeframe]);

  // Dimensions
  const svgWidth = 800;
  const svgHeight = 280;
  const paddingX = 40;
  const paddingY = 25;

  const prices = chartPoints.map((p) => p.price);
  const minPrice = Math.min(...chartPoints.map((p) => p.low)) * 0.998;
  const maxPrice = Math.max(...chartPoints.map((p) => p.high)) * 1.002;
  const priceRange = maxPrice - minPrice || 1;

  // Coordinate mapping
  const getX = (index: number) => paddingX + (index / (chartPoints.length - 1)) * (svgWidth - paddingX * 2);
  const getY = (price: number) => svgHeight - paddingY - ((price - minPrice) / priceRange) * (svgHeight - paddingY * 2);

  // Path strings
  const linePath = chartPoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.price)}`)
    .join(' ');

  const areaPath = `${linePath} L ${getX(chartPoints.length - 1)} ${svgHeight - paddingY} L ${getX(0)} ${svgHeight - paddingY} Z`;

  // Simple Moving Average (MA 5)
  const maPoints = useMemo(() => {
    const period = 5;
    return chartPoints.map((_, idx) => {
      if (idx < period - 1) return null;
      const slice = chartPoints.slice(idx - period + 1, idx + 1);
      const sum = slice.reduce((acc, curr) => acc + curr.price, 0);
      return sum / period;
    });
  }, [chartPoints]);

  const maPath = maPoints
    .map((ma, idx) => {
      if (ma === null) return '';
      const command = idx === 4 ? 'M' : 'L';
      return `${command} ${getX(idx)} ${getY(ma)}`;
    })
    .filter(Boolean)
    .join(' ');

  // Active hover point
  const activeIndex = hoverIndex !== null ? hoverIndex : chartPoints.length - 1;
  const activePoint = chartPoints[activeIndex] || chartPoints[chartPoints.length - 1];
  const convertedActivePrice = activePoint.price * currentFiat.rate;

  const isUp = asset.change24h >= 0;

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden">
      {/* Ambient background glow for active asset */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-10"
        style={{ background: asset.color }}
      />

      {/* Terminal Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-8 rounded-full shadow-lg"
            style={{ background: asset.color }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-1.5">
                <span>الرسم البياني المتقدم:</span>
                <span className="text-cyan-300 font-mono">{asset.symbol}</span>
                <span className="text-xs text-slate-400 font-normal">({asset.nameAr})</span>
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-0.5">
              <span>السعر المعروض:</span>
              <span className="text-emerald-400 font-bold text-sm">
                {currentFiat.symbol} {convertedActivePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">{activePoint.time}</span>
            </div>
          </div>
        </div>

        {/* Chart View Modes and Timeframes */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Chart Style Switcher */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-1">
            <button
              id="chart-mode-area"
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                chartType === 'area'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              مساحة متوهجة
            </button>
            <button
              id="chart-mode-candles"
              onClick={() => setChartType('candles')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                chartType === 'candles'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              شموع
            </button>
            <button
              id="chart-mode-line"
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                chartType === 'line'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              خط نقي
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-1 font-mono">
            {(['1M', '15M', '1H', '24H', '7D'] as const).map((tf) => (
              <button
                key={tf}
                id={`timeframe-btn-${tf}`}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  timeframe === tf
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicator Toggles */}
          <button
            id="toggle-ma-btn"
            onClick={() => setShowMA(!showMA)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1 ${
              showMA
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
            title="المتوسط المتحرك MA(5)"
          >
            <Layers className="w-3 h-3" />
            <span>MA (5)</span>
          </button>
        </div>
      </div>

      {/* Main SVG Interactive Chart Area */}
      <div 
        className="w-full relative select-none mt-2 cursor-crosshair"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-64 sm:h-72 overflow-visible"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const normalizedX = (x / rect.width) * svgWidth;
            const step = (svgWidth - paddingX * 2) / (chartPoints.length - 1);
            let closest = Math.round((normalizedX - paddingX) / step);
            closest = Math.max(0, Math.min(chartPoints.length - 1, closest));
            setHoverIndex(closest);
          }}
          onTouchMove={(e) => {
            if (!e.touches[0]) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const normalizedX = (x / rect.width) * svgWidth;
            const step = (svgWidth - paddingX * 2) / (chartPoints.length - 1);
            let closest = Math.round((normalizedX - paddingX) / step);
            closest = Math.max(0, Math.min(chartPoints.length - 1, closest));
            setHoverIndex(closest);
          }}
        >
          <defs>
            <linearGradient id={`main-chart-glow-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={asset.color} stopOpacity="0.4" />
              <stop offset="60%" stopColor={asset.color} stopOpacity="0.08" />
              <stop offset="100%" stopColor={asset.color} stopOpacity="0.0" />
            </linearGradient>

            <pattern id="chart-grid" width="80" height="40" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Background Grid Lines */}
          <rect x={paddingX} y={paddingY} width={svgWidth - paddingX * 2} height={svgHeight - paddingY * 2} fill="url(#chart-grid)" />

          {/* Horizontal Reference Price Levels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const priceLevel = minPrice + ratio * priceRange;
            const y = getY(priceLevel);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="rgba(148, 163, 184, 0.12)"
                  strokeDasharray="4 4"
                />
                <text
                  x={svgWidth - paddingX + 6}
                  y={y + 3}
                  fill="#64748B"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  ${priceLevel.toFixed(asset.id === 'BTC' ? 0 : 2)}
                </text>
              </g>
            );
          })}

          {/* Area / Candlestick / Line Rendering */}
          {chartType === 'area' && (
            <>
              <path d={areaPath} fill={`url(#main-chart-glow-${asset.id})`} />
              <path
                d={linePath}
                fill="none"
                stroke={asset.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 6px ${asset.color})` }}
              />
            </>
          )}

          {chartType === 'line' && (
            <path
              d={linePath}
              fill="none"
              stroke={asset.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 0 8px ${asset.color})` }}
            />
          )}

          {chartType === 'candles' &&
            chartPoints.map((p, idx) => {
              const x = getX(idx);
              const isGreen = p.close >= p.open;
              const candleColor = isGreen ? '#10B981' : '#F43F5E';
              const openY = getY(p.open);
              const closeY = getY(p.close);
              const highY = getY(p.high);
              const lowY = getY(p.low);
              const candleTop = Math.min(openY, closeY);
              const candleHeight = Math.max(3, Math.abs(openY - closeY));
              const candleWidth = Math.max(4, (svgWidth - paddingX * 2) / chartPoints.length * 0.65);

              return (
                <g key={idx}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={candleColor}
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={candleTop}
                    width={candleWidth}
                    height={candleHeight}
                    rx="1.5"
                    fill={candleColor}
                    stroke={candleColor}
                    strokeWidth="1"
                    opacity="0.9"
                  />
                </g>
              );
            })}

          {/* Moving Average Line */}
          {showMA && maPath && (
            <path
              d={maPath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.7"
              strokeDasharray="3 3"
              strokeLinecap="round"
              opacity="0.85"
            />
          )}

          {/* Crosshair Overlay on Hover */}
          {hoverIndex !== null && (
            <g>
              {/* Vertical Crosshair Line */}
              <line
                x1={getX(hoverIndex)}
                y1={paddingY}
                x2={getX(hoverIndex)}
                y2={svgHeight - paddingY}
                stroke="#06B6D4"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {/* Horizontal Crosshair Line */}
              <line
                x1={paddingX}
                y1={getY(activePoint.price)}
                x2={svgWidth - paddingX}
                y2={getY(activePoint.price)}
                stroke="#06B6D4"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {/* Glowing Indicator Dot */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(activePoint.price)}
                r="6"
                fill="#06B6D4"
                style={{ filter: 'drop-shadow(0 0 8px #06B6D4)' }}
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(activePoint.price)}
                r="2.5"
                fill="#FFFFFF"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Chart Footer: Technical Status and Range Gauge */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>أدنى 24س: <strong className="text-slate-200 font-mono">${asset.low24h.toLocaleString()}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>أعلى 24س: <strong className="text-slate-200 font-mono">${asset.high24h.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* 24h Range Bar */}
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <span>نطاق التذبذب اليومي:</span>
          <div className="w-32 sm:w-44 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
            {(() => {
              const pct = Math.min(100, Math.max(0, ((asset.price - asset.low24h) / (asset.high24h - asset.low24h || 1)) * 100));
              return (
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              );
            })()}
          </div>
          <span className="font-mono text-cyan-300 text-[11px]">
            {(((asset.price - asset.low24h) / (asset.high24h - asset.low24h || 1)) * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
