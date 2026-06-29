export type TransactionStatus = 'pending' | 'posted' | 'failed';

export type SortField = 'postedAt' | 'amountCents' | 'merchant';
export type SortDirection = 'asc' | 'desc';

export interface Transaction {
  id: string;
  merchant: string;
  description: string;
  status: TransactionStatus;
  postedAt: string;
  amountCents: number;
}

export interface TransactionQuery {
  search: string;
  status: 'all' | TransactionStatus;
  sortField: SortField;
  sortDirection: SortDirection;
  pageIndex: number;
  pageSize: number;
}

export interface TransactionPage {
  items: Transaction[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}
