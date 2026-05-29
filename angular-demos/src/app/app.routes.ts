import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CryptoConverterComponent } from '../crypto-converter/crypto-converter.component';
import { MemoryGameComponent } from '../memory-game/memory-game.component';
import { UndoableCounterComponent } from '../undoable-counter/undoable-counter.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'memory-game', component: MemoryGameComponent },
  { path: 'undoable-counter', component: UndoableCounterComponent },
  { path: 'crypto-converter', component: CryptoConverterComponent },
  { path: '**', redirectTo: '' },
];
