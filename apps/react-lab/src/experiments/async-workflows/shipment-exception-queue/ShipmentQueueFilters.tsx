import { STATUS_LABELS, type StatusFilter } from './shipmentExceptionModel';

const STATUS_FILTERS: StatusFilter[] = [
  'all',
  'open',
  'investigating',
  'awaiting-approval',
  'resolved',
  'escalated',
];

type ShipmentQueueFiltersProps = {
  query: string;
  statusFilter: StatusFilter;
  onQueryChange: (query: string) => void;
  onStatusFilterChange: (statusFilter: StatusFilter) => void;
};

function getStatusLabel(status: StatusFilter) {
  return status === 'all' ? 'All' : STATUS_LABELS[status];
}

export function ShipmentQueueFilters({
  query,
  statusFilter,
  onQueryChange,
  onStatusFilterChange,
}: ShipmentQueueFiltersProps) {
  return (
    <div className="shipment-queue__controls" aria-label="Shipment exception filters">
      <label>
        Search
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search load, carrier, lane, or issue"
        />
      </label>

      <label>
        Status
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)}
        >
          {STATUS_FILTERS.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
