import {Component, OnInit} from '@angular/core';
import {from, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'mock-app';

  ngOnInit(): void {
    from([1, 2, 3]).subscribe({
      next: (value) => {
        console.log(value)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }


}
