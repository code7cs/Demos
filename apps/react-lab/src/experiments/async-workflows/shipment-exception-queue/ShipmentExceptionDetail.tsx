import {
  STATUS_LABELS,
  type ExceptionStatus,
  type ShipmentException,
} from './shipmentExceptionModel';

type PendingAction = {
  exceptionId: string;
  nextStatus: ExceptionStatus;
} | null;

type ShipmentExceptionDetailProps = {
  exception: ShipmentException | null;
  pendingAction: PendingAction;
  error: string | null;
  onApproveResolution: () => void;
  onEscalateToHuman: () => void;
};

export function ShipmentExceptionDetail({
  exception,
  pendingAction,
  error,
  onApproveResolution,
  onEscalateToHuman,
}: ShipmentExceptionDetailProps) {
  return (
    <aside className="shipment-detail" aria-live="polite">
      {exception ? (
        <>
          <div className="shipment-detail__header">
            <div>
              <p className="shipment-queue__eyebrow">Selected exception</p>
              <h2>{exception.loadId}</h2>
            </div>
            <span className="shipment-detail__status">{STATUS_LABELS[exception.status]}</span>
          </div>

          <dl className="shipment-detail__facts">
            <div>
              <dt>Customer</dt>
              <dd>{exception.customer}</dd>
            </div>
            <div>
              <dt>Carrier</dt>
              <dd>{exception.carrier}</dd>
            </div>
            <div>
              <dt>Lane</dt>
              <dd>{exception.lane}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{exception.lastUpdated}</dd>
            </div>
          </dl>

          <section>
            <h3>Issue</h3>
            <p>{exception.issue}</p>
          </section>
          <section>
            <h3>Augie suggestion</h3>
            <p>{exception.suggestedResolution}</p>
          </section>

          {error && (
            <p className="shipment-detail__error" role="alert">
              {error}
            </p>
          )}

          <div className="shipment-detail__actions">
            <button
              disabled={pendingAction !== null || exception.status === 'resolved'}
              onClick={onApproveResolution}
              type="button"
            >
              {pendingAction?.nextStatus === 'resolved' ? 'Approving…' : 'Approve resolution'}
            </button>
            <button
              disabled={pendingAction !== null || exception.status === 'escalated'}
              onClick={onEscalateToHuman}
              type="button"
            >
              {pendingAction?.nextStatus === 'escalated' ? 'Escalating…' : 'Escalate to human'}
            </button>
          </div>
        </>
      ) : (
        <div className="shipment-queue__empty" role="status">
          Select an exception to review Augie’s suggested next step.
        </div>
      )}
    </aside>
  );
}
