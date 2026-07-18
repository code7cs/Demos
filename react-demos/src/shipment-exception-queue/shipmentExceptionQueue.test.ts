import { describe, expect, it } from 'vitest';
import {
  SHIPMENT_EXCEPTIONS,
  filterShipmentExceptions,
  updateShipmentExceptionStatus,
} from './shipmentExceptionModel';

describe('shipment exception queue helpers', () => {
  it('filters shipment exceptions by status and query without mutating source data', () => {
    const results = filterShipmentExceptions(SHIPMENT_EXCEPTIONS, 'detention', 'awaiting-approval');

    expect(results).toHaveLength(1);
    expect(results[0].loadId).toBe('AUG-1857');
    expect(SHIPMENT_EXCEPTIONS.find((exception) => exception.id === 'ex-1002')?.lastUpdated).toBe(
      '26 min ago',
    );
  });

  it('returns an empty list when no shipment exception matches', () => {
    expect(filterShipmentExceptions(SHIPMENT_EXCEPTIONS, 'customs hold', 'open')).toEqual([]);
  });

  it('updates one shipment exception status immutably', () => {
    const updated = updateShipmentExceptionStatus(SHIPMENT_EXCEPTIONS, 'ex-1002', 'resolved');

    expect(updated).not.toBe(SHIPMENT_EXCEPTIONS);
    expect(updated.find((exception) => exception.id === 'ex-1002')?.status).toBe('resolved');
    expect(SHIPMENT_EXCEPTIONS.find((exception) => exception.id === 'ex-1002')?.status).toBe(
      'awaiting-approval',
    );
  });
});
