import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicableLocationsService {

  constructor() { }

  locations$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


}
