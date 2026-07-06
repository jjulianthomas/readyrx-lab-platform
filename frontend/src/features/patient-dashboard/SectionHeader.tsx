interface SectionHeaderProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly aside?: JSX.Element | undefined;
}

export function SectionHeader({
  eyebrow,
  title,
  aside
}: SectionHeaderProps): JSX.Element {
  return (
    <div className="section-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {aside}
    </div>
  );
}
