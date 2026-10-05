export default function Placeholder({title, subtitle="This frontend screen is ready for backend integration."}) {
  return <div><div className="page-header"><div><h1>{title}</h1><p>{subtitle}</p></div></div><div className="welcome-card"><h2>Module ready</h2><p>The current Jeevanta backend does not expose a dedicated frontend action for this area yet.</p></div></div>;
}
