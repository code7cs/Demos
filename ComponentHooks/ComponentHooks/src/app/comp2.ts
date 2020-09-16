import { Component, ViewChild, ElementRef, Input, ViewChildren, QueryList, ContentChild, ContentChildren } from '@angular/core';

@Component({
    selector: 'comp2',
    templateUrl: 'comp2.html'
  })
  export class comp2{
    @Input() name : string;
    @ViewChild("div1",{ static: true }) div1:ElementRef ;  //ContentChild with only selector
    

    constructor(){
      console.log(this.name);
      console.log(this.div1);
      console.log("comp constructor ");
    }
    ngOnInit() {
      console.log(this.name);
      console.log(this.div1);
      console.log("comp init");
      
     }
     ngOnDestroy(){
      console.log("comp destroy");
     }
      ngDoCheck()	{
        console.log("comp check ");
      }
      ngAfterContentInit()	{
        console.log("comp Content Init");
      }
      ngAfterContentChecked(){
        console.log("comp content checked");
    
      }
      ngAfterViewInit(){
        console.log("comp view init Init");
      }
      ngAfterViewChecked()	{
        console.log("comp after view checked");
    
      }
      ngOnChanges(){
        console.log("comp on changes");
    
      }

  
  }