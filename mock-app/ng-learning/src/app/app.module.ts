import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RepeatDirective } from './repeat.directive';
import { MessageDirective } from './message.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseFormComponent } from './course-form/course-form.component';
import { TimerComponent } from './timer/timer.component';
import { ColorDirective } from './color.directive';
import { CustomPipesComponent } from './custom-pipes/custom-pipes.component';
import { SortPipe } from './custom-pipes/sort.pipe';
import { LoginComponent } from './login/login.component';
import { BooksComponent } from './books/books.component';
// import { LoginRoutingModule } from './login/login-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    RepeatDirective,
    MessageDirective,
    CourseFormComponent,
    TimerComponent,
    ColorDirective,
    CustomPipesComponent,
    SortPipe,
    LoginComponent,
    BooksComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // LoginRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
