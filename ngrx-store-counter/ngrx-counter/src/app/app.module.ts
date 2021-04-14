import { FormsModule } from '@angular/forms';
import { CounterOutputComponent } from './my-counter/counter-output/counter-output.component';
import { CounterButtonComponent } from './my-counter/counter-buttons/counter-buttons.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { CounterComponent } from './my-counter/counter/counter.component';
import { counterReducer } from './my-counter/state/counter.reducers';
import { CounterCustomInputComponent } from './my-counter/counter-custom-input/counter-custom-input.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { PostsListComponent } from './posts/posts-list/posts-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent,
    CounterButtonComponent,
    CounterOutputComponent,
    CounterCustomInputComponent,
    HomeComponent,
    HeaderComponent,
    PostsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot({ counter: counterReducer })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
