import { Component, ViewChild, ElementRef } from '@angular/core';
import { TimerComponent } from './timer/timer.component';
import { ColorDirective } from './color.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-learning';

  myColorName = 'yellow';
  myColor = 'red';
  myFontWeight = 'bold';
  myBorderStyle = '1px solid green';

  myMessage = "I am from attribute directive";

  // viewChild
  // example 1
  @ViewChild(TimerComponent) timerComponent: TimerComponent;
  startTimer() { this.timerComponent.begin() }
  stopTimer() { this.timerComponent.end() }

  // example 2
  @ViewChild(ColorDirective) colorDirective: ColorDirective;
  modifyColor(color: string) {
    this.colorDirective.modify(color);
  }

  // example 3
  @ViewChild('empname') empName: ElementRef;
  @ViewChild('empnumber') empNumber: ElementRef;

  ngAfterViewInit() {
    this.empName.nativeElement.style.color = 'blue';
    this.empNumber.nativeElement.style.color = 'red';
  }


}
