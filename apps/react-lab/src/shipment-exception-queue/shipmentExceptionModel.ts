export type ExceptionStatus = 'open' | 'investigating' | 'awaiting-approval' | 'resolved' | 'escalated';

export type ShipmentException = {
  id: string;
  loadId: string;
  customer: string;
  carrier: string;
  lane: string;
  status: ExceptionStatus;
  priority: 'low' | 'medium' | 'high';
  issue: string;
  suggestedResolution: string;
  lastUpdated: string;
};

export type StatusFilter = 'all' | ExceptionStatus;

export const STATUS_LABELS: Record<ExceptionStatus, string> = {
  open: 'Open',
  investigating: 'Investigating',
  'awaiting-approval': 'Awaiting approval',
  resolved: 'Resolved',
  escalated: 'Escalated',
};

export const SHIPMENT_EXCEPTIONS: ShipmentException[] = [
  {
    id: 'ex-1001',
    loadId: 'AUG-1842',
    customer: 'Northstar Foods',
    carrier: 'Hudson Freight',
    lane: 'Chicago, IL → Newark, NJ',
    status: 'open',
    priority: 'high',
    issue: 'Driver reported a six-hour delay after a warehouse appointment moved.',
    suggestedResolution: 'Call the receiving facility and request the next available dock slot.',
    lastUpdated: '12 min ago',
  },
  {
    id: 'ex-1002',
    loadId: 'AUG-1857',
    customer: 'Beacon Retail',
    carrier: 'MetroLine Logistics',
    lane: 'Dallas, TX → Phoenix, AZ',
    status: 'awaiting-approval',
    priority: 'medium',
    issue: 'Carrier requested approval for a $250 detention fee.',
    suggestedResolution: 'Approve the fee if the signed check-in timestamp matches the portal record.',
    lastUpdated: '26 min ago',
  },
  {
    id: 'ex-1003',
    loadId: 'AUG-1874',
    customer: 'Evergreen Medical',
    carrier: 'Summit Express',
    lane: 'Atlanta, GA → Miami, FL',
    status: 'investigating',
    priority: 'high',
    issue: 'Temperature alert triggered while the refrigerated trailer was stopped.',
    suggestedResolution: 'Ask carrier for reefer logs and escalate if the temperature exceeded tolerance.',
    lastUpdated: '41 min ago',
  },
  {
    id: 'ex-1004',
    loadId: 'AUG-1888',
    customer: 'Cobalt Supply',
    carrier: 'Longhaul Partners',
    lane: 'Seattle, WA → Boise, ID',
    status: 'resolved',
    priority: 'low',
    issue: 'Missing proof of delivery document.',
    suggestedResolution: 'Document was collected through carrier portal and attached to the shipment.',
    lastUpdated: '1 hr ago',
  },
];

export function filterShipmentExceptions(
  exceptions: ShipmentException[],
  query: string,
  statusFilter: StatusFilter,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return exceptions.filter((exception) => {
    const matchesStatus = statusFilter === 'all' || exception.status === statusFilter;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        exception.loadId,
        exception.customer,
        exception.carrier,
        exception.lane,
        exception.issue,
        exception.suggestedResolution,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));

    return matchesStatus && matchesQuery;
  });
}

export function updateShipmentExceptionStatus(
  exceptions: ShipmentException[],
  exceptionId: string,
  status: ExceptionStatus,
) {
  return exceptions.map((exception) =>
    exception.id === exceptionId
      ? {
          ...exception,
          status,
          lastUpdated: 'just now',
        }
      : exception,
  );
}
