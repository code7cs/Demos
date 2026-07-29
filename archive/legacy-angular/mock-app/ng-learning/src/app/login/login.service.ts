import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user';
const USERS = [
  new User(1, 'user1', 'user1'),
  new User(2, 'user2', 'user2')
];
const usersObservable = of(USERS);
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private isloggedIn = false;
  getAllUsers(): Observable<User[]> {
    return usersObservable;
  }
  isUserAuthenticated(username: string, password: string): Observable<boolean> {
    return this.getAllUsers().pipe(
      map(users => {
        const userData = users.find(user => (user.username === username) && (user.password === password));
        if (userData) {
          this.isloggedIn = true;
        } else {
          this.isloggedIn = false;
        }
        return this.isloggedIn;
      }));
  }
  isUserLoggedIn(): boolean {
    return this.isloggedIn;
  }
}


