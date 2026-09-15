import { AssetData, MarketMetrics } from '../types';

export const INITIAL_ASSETS: AssetData[] = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    nameAr: 'بيتكوين',
    symbol: 'BTC/USDT',
    unit: 'BTC',
    unitAr: 'بيتكوين',
    price: 64820.5,
    change24h: 3.42,
    high24h: 65450.0,
    low24h: 62710.0,
    volume24h: '$38.4B',
    marketCap: '$1.28T',
    history: [
      62710, 63100, 62950, 63400, 63200, 63800, 63650, 64100, 63900, 64300,
      64150, 64600, 64400, 64750, 64500, 64900, 64700, 65200, 64950, 65450,
      65100, 64820.5
    ],
    color: '#F7931A',
    glowColor: 'rgba(247, 147, 26, 0.4)',
    accentColor: 'from-amber-500/20 to-orange-500/5',
    iconType: 'bitcoin',
    lastTickDirection: 'up',
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    nameAr: 'إيثريوم',
    symbol: 'ETH/USDT',
    unit: 'ETH',
    unitAr: 'إيثريوم',
    price: 3485.2,
    change24h: 2.18,
    high24h: 3540.0,
    low24h: 3380.0,
    volume24h: '$19.2B',
    marketCap: '$419.6B',
    history: [
      3380, 3395, 3410, 3400, 3425, 3440, 3430, 3460, 3445, 3470, 3460,
      3480, 3470, 3505, 3490, 3520, 3500, 3540, 3515, 3495, 3475, 3485.2
    ],
    color: '#627EEA',
    glowColor: 'rgba(98, 126, 234, 0.4)',
    accentColor: 'from-cyan-500/20 to-blue-500/5',
    iconType: 'ethereum',
    lastTickDirection: 'up',
  },
  {
    id: 'BNB',
    name: 'BNB Chain',
    nameAr: 'عملة بينانس',
    symbol: 'BNB/USDT',
    unit: 'BNB',
    unitAr: 'بي إن بي',
    price: 592.4,
    change24h: -0.85,
    high24h: 604.5,
    low24h: 586.0,
    volume24h: '$1.45B',
    marketCap: '$86.2B',
    history: [
      602, 604.5, 601, 599, 597, 595, 598, 594, 592, 590, 588, 586, 589,
      591, 588, 590, 593, 591, 594, 590, 593, 592.4
    ],
    color: '#F3BA2F',
    glowColor: 'rgba(243, 186, 47, 0.4)',
    accentColor: 'from-yellow-500/20 to-amber-600/5',
    iconType: 'binance',
    lastTickDirection: 'down',
  },
  {
    id: 'XAU',
    name: 'Gold Ounce',
    nameAr: 'أوقية الذهب',
    symbol: 'XAU/USD',
    unit: 'oz',
    unitAr: 'أونصة',
    price: 2658.8,
    change24h: 0.94,
    high24h: 2664.2,
    low24h: 2631.0,
    volume24h: '$142B',
    marketCap: '$17.8T',
    history: [
      2631, 2634, 2638, 2636, 2640, 2645, 2642, 2648, 2650, 2647, 2652,
      2655, 2653, 2658, 2661, 2659, 2664.2, 2662, 2660, 2657, 2661, 2658.8
    ],
    color: '#E6C657',
    glowColor: 'rgba(230, 198, 87, 0.45)',
    accentColor: 'from-amber-400/25 to-yellow-600/5',
    iconType: 'gold',
    lastTickDirection: 'up',
  },
];

export const INITIAL_METRICS: MarketMetrics = {
  totalMarketCap: '$2.48T',
  volume24h: '$84.6B',
  btcDominance: 54.6,
  fearAndGreedIndex: 72,
  fearAndGreedSentiment: 'طمع متفائل (Greed)',
  goldOunceUSD: 2658.8,
};

// Rates relative to USD for regional currencies
export const FIAT_RATES: Record<string, { rate: number; nameAr: string; symbol: string }> = {
  USD: { rate: 1, nameAr: 'دولار أمريكي', symbol: '$' },
  SAR: { rate: 3.75, nameAr: 'ريال سعودي', symbol: 'ر.س' },
  AED: { rate: 3.67, nameAr: 'درهم إماراتي', symbol: 'د.إ' },
  KWD: { rate: 0.31, nameAr: 'دينار كويتي', symbol: 'د.ك' },
  EGP: { rate: 48.5, nameAr: 'جنيه مصري', symbol: 'ج.م' },
};
