export default function StatusBadge({ value }) {
  const text = String(value || "—").replaceAll("_", " ");
  const cls = String(value || "").toLowerCase().replaceAll("_", "-");
  return <span className={`status-badge ${cls}`}>{text}</span>;
}
