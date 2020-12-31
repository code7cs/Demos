import { Component } from '@angular/core';
import { DataService } from './data.service';
@Component({
  selector: 'app-datareceiving',
  template: `<h1>Data Receiving Component : {{  messagefromComponent}}</h1> `,
  styleUrls: ['./datareceiving.component.css']
})
export class DatareceivingComponent {
  messagefromComponent: any;
  constructor(private dataService: DataService) {
    this.dataService.getMessage()
      .subscribe(mymessage => {
        this.messagefromComponent = mymessage;
      });
  }
}


