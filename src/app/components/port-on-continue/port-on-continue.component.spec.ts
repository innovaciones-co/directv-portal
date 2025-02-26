import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortOnContinueComponent } from './port-on-continue.component';

describe('PortOnContinueComponent', () => {
  let component: PortOnContinueComponent;
  let fixture: ComponentFixture<PortOnContinueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortOnContinueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortOnContinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
