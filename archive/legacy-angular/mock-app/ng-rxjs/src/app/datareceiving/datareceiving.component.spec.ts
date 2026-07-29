import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatareceivingComponent } from './datareceiving.component';

describe('DatareceivingComponent', () => {
  let component: DatareceivingComponent;
  let fixture: ComponentFixture<DatareceivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatareceivingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatareceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
