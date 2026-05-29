import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './home/Home';
import CryptoConverter from './crypto-converter/CryptoConverter';
import MemoryGame from './memory-game/MemoryGame';
import UndoableCounter from './undoable-counter/UndoableCounter';
import Wordle from './wordle/Wordle';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/memory-game" element={<MemoryGame />} />
      <Route path="/undoable-counter" element={<UndoableCounter />} />
      <Route path="/crypto-converter" element={<CryptoConverter />} />
      <Route path="/wordle" element={<Wordle />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
