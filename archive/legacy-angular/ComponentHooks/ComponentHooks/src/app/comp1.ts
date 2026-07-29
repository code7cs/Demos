import { Component, ViewChild, ElementRef, Input, ViewChildren, QueryList, ContentChild } from '@angular/core';
import {comp2} from "./comp2"
import {Observable,timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './comp1.html',
  styleUrls: ['./app.component.css']
})
export class comp1 {
  SomeData:string="test123";
  

}

