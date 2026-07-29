import { Link, Outlet } from 'react-router-dom';
import './LabShell.css';

export default function LabShell() {
  return (
    <div className="lab-shell">
      <header className="lab-shell__header">
        <div className="lab-shell__bar">
          <Link className="lab-shell__brand" to="/" aria-label="Engineering Lab home">
            Engineering Lab
          </Link>
          <Link className="lab-shell__catalog-link" to="/#experiments">
            All experiments
          </Link>
        </div>
      </header>
      <main className="lab-shell__main">
        <Outlet />
      </main>
    </div>
  );
}
