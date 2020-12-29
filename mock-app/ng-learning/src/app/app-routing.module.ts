import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CustomPipesComponent } from './custom-pipes/custom-pipes.component';

const routes: Routes = [
  { path: 'custom-pipes-component', component: CustomPipesComponent },
  // { path: '**', component:  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
