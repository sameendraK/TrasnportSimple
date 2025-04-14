import { Component, OnInit } from '@angular/core';
import { ServicableLocationsService } from '../../services/servicable-locations.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripDetailsService } from '../../services/trip-details.service';

@Component({
  selector: 'app-route-map',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './route-map.component.html',
  styleUrl: './route-map.component.scss'
})
export class RouteMapComponent implements OnInit {

  servicableLocations$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  dropdownLocations$ = new BehaviorSubject<any[]>([]);
  optSelected: any;
  toLocations$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  locationForm!: FormGroup

  constructor(
    private servicableLocationsService: ServicableLocationsService,
    private tripDetailsService: TripDetailsService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.servicableLocationsService.locations$.subscribe(data => {
      const allLocations = data || [];
      this.dropdownLocations$.next(allLocations);
    });
    this.locationForm = this.fb.group({
      fromCity: ['', Validators.required],
      toCity: ['', Validators.required]
    });
  }

  optClickHandler(event: any, setToValueNull?: boolean) {
    let toLocations = this.dropdownLocations$.value.filter(i => {
      return this.locationForm.get('fromCity')?.value != i.city
    })
    this.toLocations$.next(toLocations)
    if (setToValueNull) {
      this.locationForm.get('toCity')?.setValue(null)
    }
  }

  addRouteHandler(event: any) {
    let fromCity = (this.locationForm.get('fromCity')?.value ? this.locationForm.get('fromCity')?.value : this.dropdownLocations$.value[0])

    let toCity = (this.locationForm.get('toCity')?.value)

    this.tripDetailsService.tripsList.push({ from: fromCity, to: toCity });


    this.tripDetailsService.pathCalculator();
  }


}
