import { Component, OnInit, Pipe } from '@angular/core';
import { ServicableLocationsService } from '../../services/servicable-locations.service';
import { BehaviorSubject } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicable-locations',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './servicable-locations.component.html',
  styleUrl: './servicable-locations.component.scss'
})
export class ServicableLocationsComponent implements OnInit {

  servicableLocations$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  locationForm!: FormGroup
  submittedLocations: any[] = [];
  constructor(
    private servicableLocationsService: ServicableLocationsService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.servicableLocations$ = this.servicableLocationsService.locations$;
    this.locationForm = this.fb.group({
      city: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  get city() {
    return this.locationForm.get('city')!;
  }

  onSubmit() {
    if (this.locationForm.valid) {
      const cityValue = this.city.value;
      // this.submittedLocations.push(cityValue);
      let currentLocations = this.servicableLocationsService.locations$.getValue();
      if (!(currentLocations).some(loc => loc.city === cityValue)) {
        this.servicableLocationsService.locations$.next([...currentLocations, this.locationForm.value]);
        this.locationForm.reset(); // Clear input
        this.submittedLocations.push(cityValue);
      }
      else {
        alert("City already exists");
      }

      // console.log(this.servicableLocationsService.locations$.value);
    } else {
      this.city.markAsTouched();
    }
  }
}
