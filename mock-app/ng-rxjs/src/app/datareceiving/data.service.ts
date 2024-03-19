import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  // myMessage = new BehaviorSubject<string>("Default value with BehaviorSubject");
  myMessage = new ReplaySubject<string>(2);
  constructor() {
    this.myMessage.next("Value 1");
    this.myMessage.next("Value 2");
    this.myMessage.next("Value 3");
   }
  getMessage(): Observable<string> {
    return this.myMessage.asObservable();
  }
  updateMessage(message: string) {
    this.myMessage.next(message);
  }
}


