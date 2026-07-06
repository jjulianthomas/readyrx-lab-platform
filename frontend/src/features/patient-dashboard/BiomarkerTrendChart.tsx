import { flagLabel, formatDate, formatShortDate, formatValue } from "./format";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";
import { flagTone } from "./status";
import type { BiomarkerTrend } from "./types";

interface BiomarkerTrendChartProps {
  readonly trend: BiomarkerTrend;
}

const width = 720;
const height = 260;
const padding = 34;

export function BiomarkerTrendChart({
  trend
}: BiomarkerTrendChartProps): JSX.Element {
  const points = trend.points;

  if (points.length === 0) {
    return <section className="panel">No trend data available.</section>;
  }

  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const chartPoints = points.map((point, index) => ({
    x: xPosition(index, points.length),
    y: yPosition(point.value, min, span),
    point
  }));
  const latest = chartPoints[chartPoints.length - 1];

  return (
    <section className="panel trend-panel">
      <SectionHeader
        eyebrow="Trend"
        title={trend.name}
        aside={
          latest !== undefined ? (
            <StatusBadge
              label={flagLabel(latest.point.flag)}
              tone={flagTone(latest.point.flag)}
            />
          ) : undefined
        }
      />
      <svg viewBox={`0 0 ${width} ${height}`} role="img">
        <title>{trend.name} trend</title>
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          className="axis"
        />
        <polyline
          points={chartPoints.map((item) => `${item.x},${item.y}`).join(" ")}
          className="trend-line"
        />
        {chartPoints.map((item) => (
          <g key={item.point.id}>
            <line
              x1={item.x}
              y1={height - padding}
              x2={item.x}
              y2={height - padding + 7}
              className="axis"
            />
            <circle cx={item.x} cy={item.y} r="6" className="trend-dot" />
            <text x={item.x} y={item.y - 14} textAnchor="middle">
              {item.point.value}
            </text>
            <text
              x={item.x}
              y={height - 8}
              textAnchor="middle"
              className="axis-label"
            >
              {formatShortDate(item.point.observedAt)}
            </text>
          </g>
        ))}
      </svg>
      <div className="trend-footer">
        {latest !== undefined ? (
          <strong>{formatValue(latest.point.value, latest.point.unit)}</strong>
        ) : null}
        <span>Reference {trend.referenceRange}</span>
        {points.map((point) => (
          <span key={point.id}>
            {formatDate(point.observedAt)} · {flagLabel(point.flag)}
          </span>
        ))}
      </div>
    </section>
  );
}

function xPosition(index: number, count: number): number {
  if (count === 1) {
    return width / 2;
  }

  return padding + (index / (count - 1)) * (width - padding * 2);
}

function yPosition(value: number, min: number, span: number): number {
  const usableHeight = height - padding * 2;
  return height - padding - ((value - min) / span) * usableHeight;
}
