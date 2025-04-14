import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum Levels {
  Level_1 = "Level-1",
  Level_2 = "Level-2"
}

@Injectable({
  providedIn: 'root'
})
export class TripDetailsService {

  constructor() { }
  tripsPath: any[] = [];
  tripsList: any[] = [];
  latestPath: any[] = [];

  tripsPath$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  currentLevel: string = Levels.Level_1;
  previousLevel: string = '';

  pathCalculator() {
    let clonedTripsList = [...this.tripsList]
    if (clonedTripsList.length > 1) {
      this.latestPath = clonedTripsList.splice(this.tripsList.length - 2, this.tripsList.length);

      for (let i = 1; i < this.latestPath.length; i++) {
        let fromText: string = this.latestPath[i - 1].from;
        let toText: string = this.latestPath[i - 1].to;

        let fromToCombinedDisplayText = fromText.substring(0, 3).toUpperCase() + '-' + toText.substring(0, 3).toUpperCase();
        if (
          (this.latestPath[i - 1].from === this.latestPath[i].from) &&
          (this.latestPath[i - 1].to === this.latestPath[i].to)) {
          if (this.tripsPath.length === 1 && this.tripsPath[0].graphic === 'arrow-line') {
            this.tripsPath = [];
          }
          this.assignLevel(Levels.Level_2);


          this.tripsPath.push({ graphic: 'level-two', displayText: fromToCombinedDisplayText });
        }
        else if (this.latestPath[i - 1].to != this.latestPath[i].from) {
          this.assignLevel();
          this.tripsPath.push({ graphic: 'arrow-line', displayText: fromToCombinedDisplayText });
        }
        else if (this.latestPath[i - 1].to === this.latestPath[i].from) {
          this.assignLevel();
          this.tripsPath.push({ graphic: 'straight-line', displayText: fromToCombinedDisplayText });
        }
      }
    }
    else if (clonedTripsList.length === 1) {
      let fromText: string = clonedTripsList[0].from;
      let toText: string = clonedTripsList[0].to;

      let fromToCombinedDisplayText = fromText.substring(0, 3).toUpperCase() + '-' + toText.substring(0, 3).toUpperCase();

      this.tripsPath.push({ graphic: 'arrow-line', displayText: fromToCombinedDisplayText })
    }
    this.tripsPath$.next(this.tripsPath);
  }

  assignLevel(level: string = Levels.Level_1) {
    this.previousLevel = this.currentLevel;
    this.currentLevel = level;
  }

}
