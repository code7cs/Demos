import { NavLink } from 'react-router-dom';
import AppRoutes from './routes';
import './App.css';

export default function App() {
  return (
    <>
      <header className="navbar">
        <NavLink to="/" className="navbar-brand" end>
          React Demos
        </NavLink>

        <nav className="navbar-links" aria-label="Demo navigation">
          <NavLink to="/memory-game">Memory Game</NavLink>
          <NavLink to="/undoable-counter">Undoable Counter</NavLink>
          <NavLink to="/crypto-converter">Crypto Converter</NavLink>
          <NavLink to="/wordle">Wordle</NavLink>
          <NavLink to="/bank-system">Bank System</NavLink>
          <NavLink to="/offer-explorer">Offer Explorer</NavLink>
        </nav>
      </header>

      <main className="app-main">
        <AppRoutes />
      </main>
    </>
  );
}
