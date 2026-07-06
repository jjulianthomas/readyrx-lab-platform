# Backend API Architecture

This backend implements lab order, result ingestion, patient history, and
dashboard APIs for a healthcare lab testing platform. It uses JSON files as the
local data source and keeps persistence behind repository interfaces.

## API Surface

| Workflow | Endpoint | Design Decision |
| --- | --- | --- |
| Create Lab Order | `POST /api/lab-orders` | Creates a draft order from validated DTO input and an idempotency key. |
| Get Lab Order | `GET /api/lab-orders/:orderId` | Reads by order id through the repository port. |
| Get Patient History | `GET /api/patients/:patientId/history` | Returns lab orders plus recent lab results for a patient. |
| Get Patient Dashboard | `GET /api/patients/:patientId/dashboard` | Returns patient, recent orders, recent results, and one biomarker trend for the React dashboard. |
| Receive Lab Result | `POST /api/labs/:labId/results` | Direct API alias for result ingestion. |
| Receive Lab Result Webhook | `POST /api/webhooks/labs/:labId/results` | Uses the same ingestion path and can be secured with signature verification. |

## Layer Decisions

### Controllers

Controllers live in `interfaces/http/controllers`.

Controllers parse HTTP input, call application services, and map results to HTTP
responses. They do not know how FHIR, HL7, or repositories work.

### DTOs and Validation

DTO schemas live in `interfaces/http/dtos` and use Zod.

Request validation happens before application services run. Invalid HTTP
payloads fail at the boundary, so application code can work with typed input.

### Result Object

Application services return `Result<T>`.

Success response:

```json
{ "ok": true, "data": {} }
```

Failure response:

```json
{ "ok": false, "error": { "code": "validation", "message": "..." } }
```

Services normalize workflow output into a Result object so controllers can map
success and failure consistently.

### Service Layer

Services live in `application/services`.

Services orchestrate use cases and translate expected exceptions into Result
objects. This creates a stable API-facing application boundary while preserving
small use cases for individual workflows.

### Use Cases

Use cases live in `application/orders`, `application/results`, and
`application/dashboard`.

Each use case represents one business workflow. Dashboard composition is kept in
the application layer so React does not duplicate lab, panel, or biomarker
mapping rules.

### Repository Layer

Repository ports live in `ports/repositories`.

Use cases depend on repository interfaces, not JSON files. A future Firestore
adapter should not require rewriting application workflows.

### JSON, No Disk Persistence

JSON seed files live in `infrastructure/persistence/json-firestore/data`.

Repositories load JSON seed data and keep writes in memory only. Create order
and receive result work during the running process, but no data is written back
to disk.

### Lab Adapter Abstraction

The lab adapter port lives in `ports/integrations/LabIntegrationPort.ts`.

Lab-specific protocols are hidden behind a common adapter interface. Quest and
LabCorp have different integration formats, but application services only care
about submitting orders and parsing results.

### Webhook Signature Verification

The future webhook signature boundary is represented by
`ports/integrations/WebhookSignatureVerifier.ts`.

Signature verification is modeled as a port, but not wired into the runtime yet.
Real lab webhooks need authentication, timestamp validation, and replay
protection.

### Quest Adapter

Quest uses the HL7 adapter in `infrastructure/integrations/quest-hl7`.

Quest-specific HL7 message parsing and formatting stay outside the application
layer. This keeps HL7 segment details from leaking into core business rules.

### LabCorp Adapter

LabCorp uses the FHIR adapter in `infrastructure/integrations/labcorp-fhir`.

LabCorp order and result translation is implemented through FHIR mapper
interfaces. FHIR resources are interoperability contracts, not internal domain
models.

### FHIR Mapper

The FHIR mapper converts:

- `LabOrder` to FHIR-style `ServiceRequest`
- FHIR-style `DiagnosticReport` plus observations to normalized `LabResult`

FHIR payloads are mapped at the infrastructure edge so the domain model remains
stable if a lab changes resource shape or version.

### HL7 Mapper

The HL7 mapper converts:

- `LabOrder` to HL7 ORM-style order messages
- HL7 ORU messages to normalized `LabResult`

HL7 pipe-delimited parsing is isolated in the Quest mapper. Segment details such
as `MSH`, `PID`, `ORC`, `OBR`, and `OBX` do not appear in controllers or use
cases.

### Error Handling

Centralized error handling lives in `interfaces/http/middleware/errorHandler.ts`.

Known application errors map to stable HTTP status codes and Result error
bodies. Unexpected errors remain sanitized.

### DTO Mapping

Presenters live in `interfaces/http/presenters`.

Domain objects are mapped to response DTOs before returning JSON. API contracts
can evolve independently from internal domain models.

## Clean Architecture Dependency Rule

Dependencies point inward:

```text
HTTP controllers -> services -> use cases -> ports -> domain
Infrastructure adapters -> ports/domain
```

No domain model imports Express, Zod, FHIR adapters, HL7 adapters, or JSON
repository implementations.
