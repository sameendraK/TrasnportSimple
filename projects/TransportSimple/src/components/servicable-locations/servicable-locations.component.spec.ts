import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicableLocationsComponent } from './servicable-locations.component';

describe('ServicableLocationsComponent', () => {
  let component: ServicableLocationsComponent;
  let fixture: ComponentFixture<ServicableLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicableLocationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicableLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
