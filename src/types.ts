export type AssetId = 'BTC' | 'ETH' | 'BNB' | 'XAU';

export interface AssetData {
  id: AssetId;
  name: string;
  nameAr: string;
  symbol: string;
  unit: string;
  unitAr: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  marketCap: string;
  history: number[];
  color: string;
  glowColor: string;
  accentColor: string;
  iconType: 'bitcoin' | 'ethereum' | 'binance' | 'gold';
  lastTickDirection?: 'up' | 'down' | 'neutral';
  lastTickTimestamp?: number;
}

export type Timeframe = '1M' | '15M' | '1H' | '24H' | '7D';

export type PositionType = 'LONG' | 'SHORT';

export interface PnLCalculation {
  assetId: AssetId;
  positionType: PositionType;
  investmentAmount: number; // in USD
  entryPrice: number;
  exitPrice: number;
  leverage: number;
  feePercentage: number;
  
  // Computed values
  positionSize: number; // investment * leverage
  quantity: number; // positionSize / entryPrice
  grossPnL: number;
  feesPaid: number;
  netPnL: number;
  roiPercentage: number;
  liquidationPrice: number | null;
  totalExitValue: number;
}

export interface TradeOrder {
  id: string;
  timestamp: Date;
  assetId: AssetId;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
}

export interface MarketMetrics {
  totalMarketCap: string;
  volume24h: string;
  btcDominance: number;
  fearAndGreedIndex: number;
  fearAndGreedSentiment: string;
  goldOunceUSD: number;
}
