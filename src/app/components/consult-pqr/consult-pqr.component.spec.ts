import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultPqrComponent } from './consult-pqr.component';

describe('ConsultPqrComponent', () => {
  let component: ConsultPqrComponent;
  let fixture: ComponentFixture<ConsultPqrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultPqrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultPqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
