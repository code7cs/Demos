import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {

  flag = false;
  count = 1;
  begin() {
    this.flag = true;
    const start = setInterval(() => {
      if (this.flag === false) {
        clearInterval(start);
      }
      this.count += 1;
    }, 1000)
  }

  end() { this.flag = false; }

}
