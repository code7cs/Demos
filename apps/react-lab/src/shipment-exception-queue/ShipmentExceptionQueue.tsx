import { useMemo, useState } from 'react';
import { ShipmentExceptionDetail } from './ShipmentExceptionDetail';
import { ShipmentExceptionList } from './ShipmentExceptionList';
import { ShipmentQueueFilters } from './ShipmentQueueFilters';
import {
  SHIPMENT_EXCEPTIONS,
  type ExceptionStatus,
  type StatusFilter,
  filterShipmentExceptions,
  updateShipmentExceptionStatus,
} from './shipmentExceptionModel';
import './ShipmentExceptionQueue.css';

type PendingAction = {
  exceptionId: string;
  nextStatus: ExceptionStatus;
} | null;

export default function ShipmentExceptionQueue() {
  // Lifting state up: filters, list selection, and detail actions all depend on
  // the same shipment exception source of truth, so the parent owns shared state
  // and passes values + callbacks down to focused child components.
  const [exceptions, setExceptions] = useState(SHIPMENT_EXCEPTIONS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState(SHIPMENT_EXCEPTIONS[0].id);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredExceptions = useMemo(
    () => filterShipmentExceptions(exceptions, query, statusFilter),
    [exceptions, query, statusFilter],
  );

  const selectedException =
    exceptions.find((exception) => exception.id === selectedId) ?? filteredExceptions[0] ?? null;

  function handleSelect(exceptionId: string) {
    setSelectedId(exceptionId);
    setError(null);
  }

  async function handleStatusChange(nextStatus: ExceptionStatus) {
    if (!selectedException || pendingAction) return;

    setPendingAction({ exceptionId: selectedException.id, nextStatus });
    setError(null);
    await new Promise((resolve) => window.setTimeout(resolve, 450));

    if (selectedException.id === 'ex-1003' && nextStatus === 'resolved') {
      setPendingAction(null);
      setError('Augie needs reefer logs before this exception can be resolved.');
      return;
    }

    setExceptions((currentExceptions) =>
      updateShipmentExceptionStatus(currentExceptions, selectedException.id, nextStatus),
    );
    setPendingAction(null);
  }

  return (
    <section className="shipment-queue" aria-labelledby="shipment-queue-title">
      <div className="shipment-queue__header">
        <p className="shipment-queue__eyebrow">July 8 baseline mock</p>
        <h1 id="shipment-queue-title">Shipment Exception Queue</h1>
        <p>
          Practice the likely Augment coding-round shape: list rendering, derived filters, selected
          detail state, async actions, empty/error states, and UX narration.
        </p>
      </div>

      <ShipmentQueueFilters
        query={query}
        statusFilter={statusFilter}
        onQueryChange={setQuery}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="shipment-queue__layout">
        <ShipmentExceptionList
          exceptions={filteredExceptions}
          selectedId={selectedException?.id ?? null}
          onSelectException={handleSelect}
        />
        <ShipmentExceptionDetail
          exception={selectedException}
          pendingAction={pendingAction}
          error={error}
          onApproveResolution={() => handleStatusChange('resolved')}
          onEscalateToHuman={() => handleStatusChange('escalated')}
        />
      </div>
    </section>
  );
}
