import { BrowserModule  } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms"
import { comp1 } from './comp1';
import { comp2 } from './comp2';

@NgModule({
  declarations: [
    comp1 , comp2
  ],
  imports: [
    BrowserModule , FormsModule
  ],
  providers: [],
  bootstrap: [comp1]
})
export class AppModule { }
