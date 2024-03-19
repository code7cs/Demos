import { Component } from '@angular/core';
import { I18nSelectPipe } from '@angular/common';
import { Observable, fromEvent } from 'rxjs';
import { DataService } from './datareceiving/data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'RxJS Subjects';
}


