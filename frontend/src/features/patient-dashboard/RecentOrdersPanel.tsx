import { formatDate } from "./format";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";
import {
  orderStatusLabel,
  orderStatusTone
} from "./status";
import type { LabOrder } from "./types";

interface RecentOrdersPanelProps {
  readonly orders: readonly LabOrder[];
}

export function RecentOrdersPanel({
  orders
}: RecentOrdersPanelProps): JSX.Element {
  return (
    <section className="panel">
      <SectionHeader eyebrow="Orders" title="Recent lab orders" />
      <div className="table-list">
        {orders.map((order) => (
          <article className="table-row" key={order.id}>
            <div>
              <strong>{order.panelName}</strong>
              <span>{order.labName} · {formatDate(order.orderedAt)}</span>
            </div>
            <div className="row-meta">
              <span>{order.accessionNumber ?? "No accession yet"}</span>
              <StatusBadge
                label={orderStatusLabel(order.status)}
                tone={orderStatusTone(order.status)}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
