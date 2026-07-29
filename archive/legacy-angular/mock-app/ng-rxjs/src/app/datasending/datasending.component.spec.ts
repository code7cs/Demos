import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasendingComponent } from './datasending.component';

describe('DatasendingComponent', () => {
  let component: DatasendingComponent;
  let fixture: ComponentFixture<DatasendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
