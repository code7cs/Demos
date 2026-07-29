import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { OrdersModule } from './orders/orders.module';
import { FormsModule } from '@angular/forms';
import { SiteFrameworkModule } from './site-framework/site-framework.module';

@NgModule({
  declarations: [
    AppComponent
  ],  // application's components
  imports: [
    AppRoutingModule,
    HttpClientModule,
    OrdersModule,
    SiteFrameworkModule,
    FormsModule,
    BrowserModule
  ],  // modules
  providers: [],  // services
  bootstrap: [AppComponent] // root component
})
export class AppModule { }
