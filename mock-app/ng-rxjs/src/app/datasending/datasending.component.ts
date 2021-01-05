import { Component } from '@angular/core';
import { DataService } from '../datareceiving/data.service';
@Component({
  selector: 'app-datasending',
  templateUrl: './datasending.component.html',
  styleUrls: ['./datasending.component.css']
})
export class DatasendingComponent {
  name = 'Behavior Subject';
  constructor(private dataService: DataService) { }
  passInputData(data) {
    this.dataService.updateMessage(data);
  }
}


