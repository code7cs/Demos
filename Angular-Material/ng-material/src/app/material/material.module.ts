import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

const material = [
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule
]

@NgModule({
  // declarations: [],
  imports: [
    // CommonModule
    material
  ],
  exports: [
    material
  ]
})
export class MaterialModule { }

