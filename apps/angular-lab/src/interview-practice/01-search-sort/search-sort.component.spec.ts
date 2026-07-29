import { TRANSACTIONS } from '../shared/models';
import { SearchSortComponent } from './search-sort.component';

describe('SearchSortComponent', () => {
  let component: SearchSortComponent;

  beforeEach(() => {
    component = new SearchSortComponent();
  });

  it('returns all transactions when filters are empty', () => {
    expect(component.getVisibleTransactions()).toHaveLength(TRANSACTIONS.length);
  });

  it('searches merchants case-insensitively', () => {
    component.query = 'market';

    expect(component.getVisibleTransactions().map(({ merchant }) => merchant)).toEqual([
      'Greenway Market',
    ]);
  });

  it('filters by status', () => {
    component.status = 'pending';

    expect(component.getVisibleTransactions().every(({ status }) => status === 'pending')).toBe(
      true,
    );
  });

  it('sorts by amount in both directions without mutating the fixtures', () => {
    const originalOrder = TRANSACTIONS.map(({ id }) => id);

    component.sortDirection = 'asc';
    const ascending = component.getVisibleTransactions().map(({ amountCents }) => amountCents);
    component.sortDirection = 'desc';
    const descending = component.getVisibleTransactions().map(({ amountCents }) => amountCents);

    expect(ascending).toEqual([...ascending].sort((a, b) => a - b));
    expect(descending).toEqual([...descending].sort((a, b) => b - a));
    expect(TRANSACTIONS.map(({ id }) => id)).toEqual(originalOrder);
  });
});
