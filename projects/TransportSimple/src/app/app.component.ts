import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServicableLocationsComponent } from '../components/servicable-locations/servicable-locations.component';
import { RouteMapComponent } from '../components/route-map/route-map.component';
import { TripDetailsComponent } from '../components/trip-details/trip-details.component';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ServicableLocationsComponent, RouteMapComponent, TripDetailsComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TransportSimple';
}
