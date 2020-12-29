import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RepeatDirective } from './repeat.directive';
import { MessageDirective } from './message.directive';
import { FormsModule } from '@angular/forms';
import { CourseFormComponent } from './course-form/course-form.component';
import { TimerComponent } from './timer/timer.component';
import { ColorDirective } from './color.directive';
import { CustomPipesComponent } from './custom-pipes/custom-pipes.component';
import { SortPipe } from './custom-pipes/sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RepeatDirective,
    MessageDirective,
    CourseFormComponent,
    TimerComponent,
    ColorDirective,
    CustomPipesComponent,
    SortPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
