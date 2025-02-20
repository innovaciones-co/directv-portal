import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortinRequestComponent } from './portin-request.component';

describe('PortinRequestComponent', () => {
  let component: PortinRequestComponent;
  let fixture: ComponentFixture<PortinRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortinRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortinRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
