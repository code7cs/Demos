import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './home/Home';
import CryptoConverter from './crypto-converter/CryptoConverter';
import MemoryGame from './memory-game/MemoryGame';
import UndoableCounter from './undoable-counter/UndoableCounter';
import Wordle from './wordle/Wordle';
import BankSystemDemo from './bank-system/BankSystemDemo';
import OfferExplorer from './money-lion-offer-explorer/offer-explorer';
import AccountActivity from './money-lion-account-activity/account-activity';
import SearchDemo from './search/SearchDemo';
import ShipmentExceptionQueue from './shipment-exception-queue/ShipmentExceptionQueue';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/memory-game" element={<MemoryGame />} />
      <Route path="/undoable-counter" element={<UndoableCounter />} />
      <Route path="/crypto-converter" element={<CryptoConverter />} />
      <Route path="/wordle" element={<Wordle />} />
      <Route path="/bank-system" element={<BankSystemDemo />} />
      <Route path="/offer-explorer" element={<OfferExplorer />} />
      <Route path="/account-activity" element={<AccountActivity />} />
      <Route path="/search" element={<SearchDemo />} />
      <Route path="/shipment-exception-queue" element={<ShipmentExceptionQueue />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
