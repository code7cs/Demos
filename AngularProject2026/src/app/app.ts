import { Component } from '@angular/core';
import { UndoableCounterComponent } from '../undoable-counter/undoable-counter.component';

@Component({
  selector: 'app-root',
  imports: [UndoableCounterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
