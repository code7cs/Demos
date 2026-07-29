import type { ReactNode } from 'react';
import BankSystemDemo from '../bank-system/BankSystemDemo';
import CryptoConverter from '../crypto-converter/CryptoConverter';
import MemoryGame from '../memory-game/MemoryGame';
import AccountActivity from '../money-lion-account-activity/account-activity';
import OfferExplorer from '../money-lion-offer-explorer/offer-explorer';
import NestedCommentsDemo from '../nested-comments/NestedCommentsDemo';
import SearchDemo from '../search/SearchDemo';
import ShipmentExceptionQueue from '../shipment-exception-queue/ShipmentExceptionQueue';
import UndoableCounter from '../undoable-counter/UndoableCounter';
import Wordle from '../wordle/Wordle';
import { experiments } from './experiment.registry';
import type { ExperimentDefinition } from './experiment.types';

export type ExperimentRoute = {
  path: ExperimentDefinition['route'];
  element: ReactNode;
};

const experimentElements: Record<ExperimentDefinition['slug'], ReactNode> = {
  'nested-comments': <NestedCommentsDemo />,
  'shipment-exception-queue': <ShipmentExceptionQueue />,
  search: <SearchDemo />,
  'offer-explorer': <OfferExplorer />,
  'account-activity': <AccountActivity />,
  'undoable-counter': <UndoableCounter />,
  'bank-system': <BankSystemDemo />,
  'crypto-converter': <CryptoConverter />,
  'memory-game': <MemoryGame />,
  wordle: <Wordle />,
};

export const experimentRoutes: ExperimentRoute[] = experiments.map(({ route, slug }) => ({
  path: route,
  element: experimentElements[slug],
}));
