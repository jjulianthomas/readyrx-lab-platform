import type { IsoDateTimeString } from "./Time";

export interface FirestoreDocumentMetadata {
  /** Firestore document id; duplicated in the JSON body for exportability. */
  readonly id: string;
  /** Shape version for migrations when the TypeScript model evolves. */
  readonly schemaVersion?: number;
  /** Monotonic document version for optimistic concurrency and audit diffs. */
  readonly recordVersion?: number;
  /** ISO timestamp when the document was first created. */
  readonly createdAt: IsoDateTimeString;
  /** ISO timestamp when the document was last changed. */
  readonly updatedAt: IsoDateTimeString;
  /** ISO timestamp for soft deletion; absent means active document. */
  readonly deletedAt?: IsoDateTimeString;
}
