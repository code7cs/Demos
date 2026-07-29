export type TransactionStatus = 'posted' | 'pending';
export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  status: TransactionStatus;
  amountCents: number;
}
export interface FlatAccount {
  id: string;
  parentId: string | null;
  name: string;
}
export interface AccountNode extends FlatAccount {
  children: AccountNode[];
}
export const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    merchant: 'Greenway Market',
    category: 'Groceries',
    status: 'posted',
    amountCents: 8421,
  },
  { id: '2', merchant: 'Metro Transit', category: 'Travel', status: 'pending', amountCents: 275 },
  {
    id: '3',
    merchant: 'City Electric',
    category: 'Utilities',
    status: 'posted',
    amountCents: 12950,
  },
  { id: '4', merchant: 'Corner Books', category: 'Shopping', status: 'pending', amountCents: 4599 },
  { id: '5', merchant: 'Fresh Grocer', category: 'Groceries', status: 'posted', amountCents: 6334 },
];
export const FLAT_ACCOUNTS: FlatAccount[] = [
  { id: 'checking', parentId: null, name: 'Checking' },
  { id: 'daily', parentId: 'checking', name: 'Daily spending' },
  { id: 'bills', parentId: 'checking', name: 'Bills' },
  { id: 'savings', parentId: null, name: 'Savings' },
  { id: 'emergency', parentId: 'savings', name: 'Emergency fund' },
  { id: 'travel', parentId: 'savings', name: 'Travel fund' },
];
