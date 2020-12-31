import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { DatareceivingComponent } from './datareceiving/datareceiving.component';
import { DatasendingComponent } from './datasending/datasending.component';

@NgModule({
  declarations: [
    AppComponent,
    DatareceivingComponent,
    DatasendingComponent
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
