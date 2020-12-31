import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  myMessage = new Subject<string>();
  constructor() { }
  getMessage(): Observable<string> {
    return this.myMessage.asObservable();
  }
  updateMessage(message: string) {
    this.myMessage.next(message);
  }
}


