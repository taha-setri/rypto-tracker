import { useState, useEffect } from 'react';
import { AssetData, AssetId, MarketMetrics, TradeOrder } from './types';
import { INITIAL_ASSETS, INITIAL_METRICS } from './data/initialMarket';
import NetworkBar from './components/NetworkBar';
import Header from './components/Header';
import AssetCards from './components/AssetCards';
import MarketChart from './components/MarketChart';
import ProfitLossCalculator from './components/ProfitLossCalculator';
import GoldKaratCalculator from './components/GoldKaratCalculator';
import LiveOrderTape from './components/LiveOrderTape';
import LegalAndFounderSection from './components/LegalAndFounderSection';
import DisclaimerModal from './components/DisclaimerModal';
import CookieBanner from './components/CookieBanner';
import InfoModal from './components/InfoModal';
import { playTickSound } from './utils/audio';
import { ShieldAlert, Cookie, UserCheck, Heart } from 'lucide-react';

export default function App() {
  const [assets, setAssets] = useState<AssetData[]>(INITIAL_ASSETS);
  const [metrics, setMetrics] = useState<MarketMetrics>(INITIAL_METRICS);
  const [selectedAssetId, setSelectedAssetId] = useState<AssetId>('BTC');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState<boolean>(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const goldAsset = assets.find((a) => a.id === 'XAU') || assets[3];

  // Seed initial trades
  useEffect(() => {
    const initialTrades: TradeOrder[] = [];
    const now = Date.now();
    for (let i = 0; i < 15; i++) {
      const asset = INITIAL_ASSETS[i % INITIAL_ASSETS.length];
      const isBuy = Math.random() > 0.45;
      const priceOffset = (Math.random() - 0.5) * (asset.price * 0.002);
      const price = Number((asset.price + priceOffset).toFixed(2));
      const amount = Number((Math.random() * (asset.id === 'BTC' ? 0.8 : asset.id === 'ETH' ? 4 : 12)).toFixed(4));
      initialTrades.push({
        id: `trade-init-${i}`,
        timestamp: new Date(now - (15 - i) * 3000),
        assetId: asset.id,
        type: isBuy ? 'buy' : 'sell',
        price,
        amount,
        total: Math.round(price * amount),
      });
    }
    setOrders(initialTrades);
  }, []);

  // Live simulation ticker
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setAssets((prevAssets) => {
        // Pick one or two random assets to fluctuate per tick
        const updated = prevAssets.map((asset) => {
          // 70% chance of updating in each tick
          if (Math.random() > 0.7) return asset;

          const volatility = asset.id === 'BTC' ? 0.0008 : asset.id === 'ETH' ? 0.0012 : asset.id === 'BNB' ? 0.001 : 0.0004;
          const delta = (Math.random() - 0.49) * asset.price * volatility;
          const newPrice = Number(Math.max(1, asset.price + delta).toFixed(asset.id === 'BTC' ? 1 : 2));
          const direction: 'up' | 'down' = newPrice >= asset.price ? 'up' : 'down';

          if (soundEnabled && asset.id === selectedAssetId) {
            playTickSound(direction);
          }

          // New 24h high/low
          const high24h = Math.max(asset.high24h, newPrice);
          const low24h = Math.min(asset.low24h, newPrice);

          // Update sparkline history
          const newHistory = [...asset.history.slice(1), newPrice];

          return {
            ...asset,
            price: newPrice,
            high24h,
            low24h,
            history: newHistory,
            lastTickDirection: direction,
            lastTickTimestamp: Date.now(),
          };
        });

        return updated;
      });

      // Generate a simulated live trade matching this tick
      setOrders((prevOrders) => {
        const randomAsset = INITIAL_ASSETS[Math.floor(Math.random() * INITIAL_ASSETS.length)];
        const isBuy = Math.random() > 0.46;
        const priceOffset = (Math.random() - 0.5) * (randomAsset.price * 0.001);
        const price = Number((randomAsset.price + priceOffset).toFixed(2));
        const amount = Number(
          (Math.random() * (randomAsset.id === 'BTC' ? 0.45 : randomAsset.id === 'ETH' ? 2.5 : 8) + 0.01).toFixed(4)
        );

        const newOrder: TradeOrder = {
          id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date(),
          assetId: randomAsset.id,
          type: isBuy ? 'buy' : 'sell',
          price,
          amount,
          total: Math.round(price * amount),
        };

        return [newOrder, ...prevOrders.slice(0, 24)];
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isSimulating, soundEnabled, selectedAssetId]);

  // Manual refresh trigger
  const handleManualRefresh = () => {
    setAssets((prev) =>
      prev.map((a) => {
        const delta = (Math.random() - 0.48) * (a.price * 0.003);
        const newPrice = Number((a.price + delta).toFixed(2));
        return {
          ...a,
          price: newPrice,
          history: [...a.history.slice(1), newPrice],
          lastTickDirection: delta >= 0 ? 'up' : 'down',
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Required Top Network Bar with link to https://tech-calculators.vercel.app/ */}
      <NetworkBar networkUrl="https://tech-calculators.vercel.app/" />

      {/* 2. Main Futuristic Terminal Header */}
      <Header
        metrics={{
          ...metrics,
          goldOunceUSD: goldAsset.price,
        }}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        onRefresh={handleManualRefresh}
        onOpenDisclaimerModal={() => setIsDisclaimerModalOpen(true)}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
      />

      {/* 3. Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Core Tracked Assets Grid (BTC, ETH, BNB, Gold) */}
        <section aria-label="الأصول المالية الرئيسية">
          <AssetCards
            assets={assets}
            selectedAssetId={selectedAssetId}
            onSelectAsset={(id) => setSelectedAssetId(id)}
            currency={selectedCurrency}
          />
        </section>

        {/* Detailed Chart & Live Order Stream Split View */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" aria-label="الرسم البياني وتدفق الصفقات">
          <div className="lg:col-span-8">
            <MarketChart asset={selectedAsset} currency={selectedCurrency} />
          </div>
          <div className="lg:col-span-4 h-full">
            <LiveOrderTape orders={orders} selectedAssetId={selectedAssetId} />
          </div>
        </section>

        {/* Gold Karat Radar & Converter (Spotlight for Gold) */}
        <section aria-label="عيارات الذهب العالمية والمحلية">
          <GoldKaratCalculator goldOuncePrice={goldAsset.price} currency={selectedCurrency} />
        </section>

        {/* Interactive Profit & Loss Calculator */}
        <section aria-label="حاسبة الأرباح والخسائر">
          <ProfitLossCalculator
            assets={assets}
            selectedAssetId={selectedAssetId}
            onSelectAsset={(id) => setSelectedAssetId(id)}
            currency={selectedCurrency}
            soundEnabled={soundEnabled}
          />
        </section>

        {/* 4. Required Disclaimer, Cookies, & Founder Section */}
        <LegalAndFounderSection
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
          onOpenCookies={() => setIsCookieModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#070A12] py-8 px-4 sm:px-6 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Founder Credit */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-center md:text-right">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#06B6D4]"></span>
            <span className="text-slate-200 font-bold text-sm">
              لوحة متابعة أسواق العملات الرقمية والذهب
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-slate-200 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>المؤسس: <strong className="text-cyan-300 font-bold font-mono">Taha setri</strong></span>
            </div>
          </div>

          {/* Legal, Cookies & Network Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <a
              href="https://tech-calculators.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors flex items-center gap-1 font-sans"
            >
              <span>← شبكة حواسب التقنية</span>
            </a>

            <span className="text-slate-700 hidden sm:inline">•</span>

            <button
              id="footer-disclaimer-btn"
              onClick={() => setIsDisclaimerModalOpen(true)}
              className="text-red-400 hover:text-red-300 hover:underline transition-colors flex items-center gap-1 font-sans"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>إخلاء المسؤولية</span>
            </button>

            <span className="text-slate-700 hidden sm:inline">•</span>

            <button
              id="footer-cookies-btn"
              onClick={() => setIsCookieModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 hover:underline transition-colors flex items-center gap-1 font-sans"
            >
              <Cookie className="w-3.5 h-3.5" />
              <span>الكوكيز والخصوصية</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لـ <strong>Taha setri</strong> • للأغراض التعليمية والاسترشادية فقط.</p>
          <p className="font-mono text-slate-600">Secure Client State • Local Storage Compliance</p>
        </div>
      </footer>

      {/* Modals & Consent Components */}
      <DisclaimerModal isOpen={isDisclaimerModalOpen} onClose={() => setIsDisclaimerModalOpen(false)} />
      <CookieBanner forceOpenModal={isCookieModalOpen} onCloseModal={() => setIsCookieModalOpen(false)} />
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
}
