import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationComponent } from './homologation.component';

describe('HomologationComponent', () => {
  let component: HomologationComponent;
  let fixture: ComponentFixture<HomologationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomologationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomologationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
