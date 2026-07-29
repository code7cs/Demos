import { STATUS_LABELS, type ShipmentException } from './shipmentExceptionModel';

type ShipmentExceptionListProps = {
  exceptions: ShipmentException[];
  selectedId: string | null;
  onSelectException: (exceptionId: string) => void;
};

export function ShipmentExceptionList({
  exceptions,
  selectedId,
  onSelectException,
}: ShipmentExceptionListProps) {
  return (
    <div className="shipment-queue__list" aria-label="Shipment exceptions">
      <div className="shipment-queue__list-header">
        <h2>Exceptions</h2>
        <span>{exceptions.length} shown</span>
      </div>

      {exceptions.length === 0 ? (
        <div className="shipment-queue__empty" role="status">
          No exceptions match these filters. Try clearing search or choosing another status.
        </div>
      ) : (
        exceptions.map((exception) => (
          <button
            className="shipment-card"
            data-selected={exception.id === selectedId}
            key={exception.id}
            onClick={() => onSelectException(exception.id)}
            type="button"
          >
            <span className="shipment-card__topline">
              <strong>{exception.loadId}</strong>
              <span className={`priority priority--${exception.priority}`}>
                {exception.priority}
              </span>
            </span>
            <span>{exception.customer}</span>
            <span>{exception.lane}</span>
            <span className="shipment-card__status">{STATUS_LABELS[exception.status]}</span>
          </button>
        ))
      )}
    </div>
  );
}
