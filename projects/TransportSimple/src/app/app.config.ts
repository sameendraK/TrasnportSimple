import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { TripDetailsService } from '../services/trip-details.service';
import { ServicableLocationsService } from '../services/servicable-locations.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), TripDetailsService, ServicableLocationsService]
};
