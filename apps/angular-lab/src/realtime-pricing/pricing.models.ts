export interface PriceQuote {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  dailyChange: number;
  updatedAt: string;
}
export interface PriceSnapshot {
  type: 'snapshot';
  sequence: number;
  quotes: PriceQuote[];
}
export interface PriceDelta {
  type: 'delta';
  sequence: number;
  quote: PriceQuote;
}
export type FeedMessage = PriceSnapshot | PriceDelta;
export type ConnectionState = 'connected' | 'reconnecting' | 'stale';
