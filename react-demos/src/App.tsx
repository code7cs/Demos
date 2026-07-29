import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import './App.css';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="navbar">
        <NavLink to="/" className="navbar-brand" end>
          React Demos
        </NavLink>

        <button
          className="navbar-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="demo-navigation"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span className="navbar-toggle-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav
          id="demo-navigation"
          className={`navbar-links${isMenuOpen ? ' is-open' : ''}`}
          aria-label="Demo navigation"
        >
          <NavLink to="/memory-game">Memory Game</NavLink>
          <NavLink to="/undoable-counter">Undoable Counter</NavLink>
          <NavLink to="/crypto-converter">Crypto Converter</NavLink>
          <NavLink to="/wordle">Wordle</NavLink>
          <NavLink to="/bank-system">Bank System</NavLink>
          <NavLink to="/offer-explorer">Offer Explorer</NavLink>
          <NavLink to="/account-activity">Account Activity</NavLink>
          <NavLink to="/search">Search</NavLink>
          <NavLink to="/shipment-exception-queue">Shipment Queue</NavLink>
          <NavLink to="/nested-comments">Nested Comments</NavLink>
        </nav>
      </header>

      <main className="app-main">
        <AppRoutes />
      </main>
    </>
  );
}
