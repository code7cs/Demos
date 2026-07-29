import type { ReactNode } from 'react';
import OfferExplorer from '../experiments/architecture/offer-explorer/offer-explorer';
import NestedCommentsDemo from '../experiments/architecture/nested-comments/NestedCommentsDemo';
import CryptoConverter from '../experiments/async-workflows/crypto-converter/CryptoConverter';
import SearchDemo from '../experiments/async-workflows/search/SearchDemo';
import ShipmentExceptionQueue from '../experiments/async-workflows/shipment-exception-queue/ShipmentExceptionQueue';
import AccountActivity from '../experiments/state-and-data-flow/account-activity/account-activity';
import BankSystemDemo from '../experiments/state-and-data-flow/bank-system/BankSystemDemo';
import UndoableCounter from '../experiments/state-and-data-flow/undoable-counter/UndoableCounter';
import MemoryGame from '../experiments/ux-and-quality/memory-game/MemoryGame';
import Wordle from '../experiments/ux-and-quality/wordle/Wordle';
import { experiments } from './experiment.registry';
import type { ExperimentDefinition } from './experiment.types';

export type ExperimentRoute = { path: ExperimentDefinition['route']; element: ReactNode };
const experimentElements: Record<ExperimentDefinition['slug'], ReactNode> = { 'nested-comments': <NestedCommentsDemo />, 'shipment-exception-queue': <ShipmentExceptionQueue />, search: <SearchDemo />, 'offer-explorer': <OfferExplorer />, 'account-activity': <AccountActivity />, 'undoable-counter': <UndoableCounter />, 'bank-system': <BankSystemDemo />, 'crypto-converter': <CryptoConverter />, 'memory-game': <MemoryGame />, wordle: <Wordle /> };
export const experimentRoutes: ExperimentRoute[] = experiments.map(({ route, slug }) => ({ path: route, element: experimentElements[slug] }));
