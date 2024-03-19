import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login.service';
@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) { }
  canActivate(): boolean {
    if (this.loginService.isUserLoggedIn()) {
      console.log("yes, logged in");
      return true;
    }
    console.log("no, not logged in");
    this.router.navigate(['/login']);
    return false;
  }
}


