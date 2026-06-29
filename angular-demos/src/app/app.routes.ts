import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CryptoConverterComponent } from '../crypto-converter/crypto-converter.component';
import { MemoryGameComponent } from '../memory-game/memory-game.component';
import { TicTacToeComponent } from '../tic-tac-toe/tic-tac-toe.component';
import { UndoableCounterComponent } from '../undoable-counter/undoable-counter.component';
import { BankSystemComponent } from '../bank-system/bank-system.component';
import { TransactionSearchComponent } from '../coding-round/transaction-search.component';
import { RxjsPaymentFormComponent } from '../coding-round/rxjs-banking/rxjs-payment-form.component';
import { RxjsTransactionSearchComponent } from '../coding-round/rxjs-banking/rxjs-transaction-search.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'memory-game', component: MemoryGameComponent },
  { path: 'tic-tac-toe', component: TicTacToeComponent },
  { path: 'undoable-counter', component: UndoableCounterComponent },
  { path: 'crypto-converter', component: CryptoConverterComponent },
  { path: 'bank-system', component: BankSystemComponent },
  { path: 'coding-round/transaction-search', component: TransactionSearchComponent },
  { path: 'coding-round/rxjs-transactions', component: RxjsTransactionSearchComponent },
  { path: 'coding-round/rxjs-payment', component: RxjsPaymentFormComponent },
  { path: '**', redirectTo: '' },
];
