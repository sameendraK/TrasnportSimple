import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Levels, TripDetailsService } from '../../services/trip-details.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as d3 from 'd3';

enum LineTypes {
  Straight = 'straight-line',
  Arrow = 'arrow-line',
  LevelTwo = 'level-two'
}

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.scss'
})
export class TripDetailsComponent implements OnInit {

  tripsPaths$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  width = 300;
  height = 100;
  segmentWidth = 120;
  currentX = 15;
  initialBaseY = 150;
  baseY = this.initialBaseY;
  levelTwoYOffset = 30;

  @ViewChild('svgContainer', { static: true }) svgRef!: ElementRef<SVGSVGElement>;

  constructor(
    private tripDetailsService: TripDetailsService
  ) {

  }
  ngOnInit() {
    this.tripsPaths$ = this.tripDetailsService.tripsPath$;
    this.tripDetailsService.tripsPath$.subscribe(i => {
      if (this.tripsPaths$.value.length > 0) {
        let tripsPath: any[] = this.tripsPaths$.value;
        if (tripsPath.length === 1 && ((tripsPath[0].graphic) === LineTypes.LevelTwo || tripsPath[0] === LineTypes.LevelTwo)) {
          this.clearExistingSVG();
        }
        this.renderSVG(this.tripsPaths$.value[this.tripsPaths$.value.length - 1])
      }

    })
  }


  clearExistingSVG() {
    d3.select("svg").selectAll("*").remove();
    this.currentX = 15;
    this.initialBaseY = 150;
  }

  renderSVG(type: any) {
    let displayText = type.displayText
    var svgWidth = '100%';
    var svgHeight = 400;
    var svg = d3.select("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("class", "svg-container");
    if (type.graphic === LineTypes.Arrow) {
      if ((this.tripDetailsService.currentLevel === Levels.Level_1) && (this.tripDetailsService.previousLevel === Levels.Level_2)) {
        this.downCurve(svg, displayText);
      }
      else {
        svg.append("circle")
          .attr("cx", this.currentX)
          .attr("cy", this.initialBaseY)
          .attr("r", 5)
          .attr("fill", "#0483E5");
        // Line
        svg.append("line")
          .attr("x1", this.currentX)
          .attr("y1", this.initialBaseY)
          .attr("x2", this.currentX + 80)
          .attr("y2", this.initialBaseY)
          .attr("stroke", "#0483E5");

        // Arrow
        svg.append('polygon')
          .attr('points', `${this.currentX + 80},${this.initialBaseY - 5} ${this.currentX + 90},${this.initialBaseY} ${this.currentX + 80},${this.initialBaseY + 5}`)
          .attr('fill', '#0483E5');

        // Text
        svg.append("text")
          .text(displayText)
          .attr("x", this.currentX + 5)
          .attr("y", this.initialBaseY + 15);

        this.currentX += 100;
      }
    }
    else if (type.graphic === LineTypes.Straight) {
      if ((this.tripDetailsService.currentLevel === Levels.Level_1) && (this.tripDetailsService.previousLevel === Levels.Level_2)) {
        this.downCurve(svg, displayText);
      }
      else {
        svg.append("circle")
          .attr("cx", this.currentX)
          .attr("cy", this.initialBaseY)
          .attr("r", 5)
          .attr("fill", "#595FAB");

        svg.append("text")
          .text(displayText)
          .attr("x", this.currentX + 5)
          .attr("y", this.initialBaseY + 15);

        svg.append("line")
          .attr("x1", this.currentX)
          .attr("y1", this.initialBaseY)
          .attr("x2", this.currentX + 100)
          .attr("y2", this.initialBaseY)
          .attr("stroke", "#595FAB");

        this.currentX += 100;
      }
    }

    else if (type.graphic === LineTypes.LevelTwo) {

      if ((this.tripDetailsService.currentLevel === Levels.Level_1) && (this.tripDetailsService.previousLevel === Levels.Level_2)) {
        this.downCurve(svg, displayText)
      }
      else {

        const curveStartX = this.currentX;
        const curveStartY = this.initialBaseY;

        const goingUp = this.initialBaseY === this.initialBaseY;
        const curveEndY = goingUp ? this.initialBaseY - 100 : this.initialBaseY;

        const curveEndX = this.currentX + 100;

        const controlX1 = curveStartX + 25;
        const controlY1 = goingUp ? this.initialBaseY - 75 : this.initialBaseY + 25;
        const controlX2 = curveEndX - 25;
        const controlY2 = goingUp ? curveEndY - 25 : curveEndY - 75;

        // Label
        svg.append("text")
          .text(displayText)
          .attr("x", curveStartX + 5)
          .attr("y", this.initialBaseY + 15);

        svg.append("circle")
          .attr("cx", curveStartX)
          .attr("cy", curveStartY)
          .attr("r", 5)
          .attr("fill", "#FDD49A");

        svg.append("path")
          .attr("d", `M ${curveStartX} ${curveStartY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${curveEndX} ${curveEndY}`)
          .attr("stroke", "#FDD49A")
          .attr("stroke-width", 2)
          .attr("fill", "none");

        svg.append("circle")
          .attr("cx", curveEndX)
          .attr("cy", curveEndY)
          .attr("r", 5)
          .attr("fill", "#FDD49A");

        this.currentX = curveEndX;
        this.initialBaseY = curveEndY;
      }

    }

  }

  downCurve(svg: any, displayText: string) {
    const curveStartX = this.currentX;
    const curveStartY = this.initialBaseY;

    const curveEndX = this.currentX + 100;
    const curveEndY = this.initialBaseY + 100; // going down

    const controlX1 = curveStartX + 25;
    const controlY1 = curveStartY + 75;
    const controlX2 = curveEndX - 25;
    const controlY2 = curveEndY + 25;

    svg.append("text")
      .text(displayText)
      .attr("x", curveStartX + 5)
      .attr("y", curveStartY + 15);

    svg.append("circle")
      .attr("cx", curveStartX)
      .attr("cy", curveStartY)
      .attr("r", 5)
      .attr("fill", "#9FA8B2");

    svg.append("path")
      .attr("d", `M ${curveStartX} ${curveStartY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${curveEndX} ${curveEndY}`)
      .attr("stroke", "#9FA8B2")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    svg.append("circle")
      .attr("cx", curveEndX)
      .attr("cy", curveEndY)
      .attr("r", 5)
      .attr("fill", "#9FA8B2");

    this.currentX = curveEndX;
    this.initialBaseY = curveEndY;
  }

  getPath(index: number): string {
    const type = this.tripsPaths$.value[index];
    const xStart = index * this.segmentWidth;
    const xEnd = xStart + this.segmentWidth;

    if (type === 'straight-line') {
      return `M ${xStart} ${this.initialBaseY} L ${xEnd} ${this.initialBaseY}`;
    }

    if (type === 'arrow-line') {
      const cp1x = xStart + this.segmentWidth / 2;
      const cp1y = this.initialBaseY - 30;
      return `M ${xStart} ${this.initialBaseY} C ${cp1x} ${cp1y}, ${cp1x} ${cp1y}, ${xEnd} ${this.initialBaseY}`;
    }

    if (type === 'level-two') {
      const y = this.initialBaseY + this.levelTwoYOffset;
      return `M ${xStart} ${this.initialBaseY} L ${xStart} ${y} L ${xEnd} ${y}`;
    }

    return '';
  }


}
