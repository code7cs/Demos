import { BooksComponent } from './books/books.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CustomPipesComponent } from './custom-pipes/custom-pipes.component';
import { LoginGuardService } from './login/login-guard.service';

const routes: Routes = [
  { path: 'custom-pipes-component', component: CustomPipesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'books', component: BooksComponent, canActivate: [LoginGuardService] },
  // { path: '**', component:  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
