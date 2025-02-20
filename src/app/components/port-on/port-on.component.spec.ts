import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortOnComponent } from './port-on.component';

describe('PortOnComponent', () => {
  let component: PortOnComponent;
  let fixture: ComponentFixture<PortOnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortOnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
