# Banking Portal Angular Demo

This folder is a local teaching app for the Capital One Lead Frontend system design interview.
It is not meant to implement real banking. It is meant to make the architecture concrete.

## Interview Mapping

```text
View layer
  app-shell/
  pages/
  components/

State layer
  state/banking.store.ts
  state/banking.models.ts

Data access layer
  data-access/banking-bff.service.ts
  data-access/banking-api.service.ts
  data-access/api-error.mapper.ts
  data-access/idempotency-key.ts

Security
  security/auth-session.service.ts
  security/csrf-token.service.ts
  security/route-guard.example.ts

Backend simulation
  data-access/mock-backend.service.ts

Observability
  telemetry/telemetry.service.ts
```

## How To Explain It In The Interview

Say:

> I would keep the view layer focused on rendering and user interaction. State is explicit:
> selected account, transaction filters, transfer draft, and request status. API calls are
> centralized in a data access layer, so components do not scatter fetch, retry, error mapping,
> and telemetry logic everywhere.

Say:

> The BFF is the frontend-friendly API layer. It composes account summary, recent transactions,
> and request status for the portal. The API gateway is the general front door for routing,
> auth enforcement, rate limiting, and logging. Backend domain services still own the real
> account, transaction, payment, risk, and audit logic.

Say:

> For money movement, the frontend should not optimistically mark the transfer as completed.
> It submits once with an idempotency key, then checks the backend request status. That avoids
> duplicate submits and protects user trust.

## Files To Read First

1. `app-shell/bank-shell.component.html`
2. `components/architecture-map/architecture-map.component.html`
3. `state/banking.store.ts`
4. `data-access/banking-bff.service.ts`
5. `data-access/mock-backend.service.ts`

## What Is Intentionally Mocked

- No real login.
- No real backend.
- No real card network, settlement, ledger, or PCI implementation.
- No real CSRF cookie. The token service is a teaching stub.

The point is to understand the frontend architecture and the API/data flow.
