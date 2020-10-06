import { Component, Injectable, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { increment, decrement, reset } from '../counter.actions';

@Component({
  selector: 'app-my-counter',
  templateUrl: './my-counter.component.html',
  styleUrls: ['./my-counter.component.css'],
})
export class MyCounterComponent  {
  count$: Observable<number>;

  constructor(private store: Store<{ count: number }>) {
    this.count$ = store.select('count');
  }

  increment() {
    //TODO: Dispatch an increment action
    this.store.dispatch(increment());
  }
  decrement() {
    this.store.dispatch(decrement());

  }
  reset() {
    this.store.dispatch(reset());
  }
}
