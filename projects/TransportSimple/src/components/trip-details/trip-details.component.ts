import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Levels, TripDetailsService } from '../../services/trip-details.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as d3 from 'd3';
import { LiteralExpr } from '@angular/compiler';

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
  @ViewChild('svgContainer', { static: true }) svgRef!: ElementRef<SVGSVGElement>;

  constructor(
    private tripDetailsService: TripDetailsService
  ) {

  }
  ngOnInit() {
    this.tripsPaths$ = this.tripDetailsService.tripsPath$;
    // this.renderSVG();
    // this.renderSampleSVG();
    this.tripDetailsService.tripsPath$.subscribe(i => {
      if (this.tripsPaths$.value.length > 0) {
        let tripsPath: any[] = this.tripsPaths$.value;
        if (tripsPath.length === 1 && ((tripsPath[0].graphic) === LineTypes.LevelTwo || tripsPath[0] === LineTypes.LevelTwo)) {
          this.clearExistingSVG();
        }
        this.renderSampleSVG(this.tripsPaths$.value[this.tripsPaths$.value.length - 1])
        console.log("the data", i);
      }

    })
  }
  currentX = 0; // starting x
  initialBaseY = 150;  // base y position
  baseY = this.initialBaseY;


  clearExistingSVG() {
    d3.select("svg").selectAll("*").remove();
    this.currentX = 0;
    this.initialBaseY = 150;
  }

  renderSampleSVG(type: any) {
    // console.log(i);
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
        // Draw the line
        svg.append("line")
          .attr("x1", this.currentX)
          .attr("y1", this.initialBaseY)
          .attr("x2", this.currentX + 80) // shorten the line for the arrow
          .attr("y2", this.initialBaseY)
          .attr("stroke", "red");

        // Draw the arrowhead using polygon
        svg.append('polygon')
          .attr('points', `${this.currentX + 80},${this.initialBaseY - 5} ${this.currentX + 90},${this.initialBaseY} ${this.currentX + 80},${this.initialBaseY + 5}`)
          .attr('fill', 'red');

        // Label the arrow
        svg.append("text")
          .text(displayText)
          .attr("x", this.currentX + 5)
          .attr("y", this.initialBaseY - 10); // Adjust text above line

        this.currentX += 100; // move currentX forward
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
          .attr("r", 10)
          .attr("fill", "red");

        svg.append("text")
          .text(displayText)
          .attr("x", this.currentX + 5)
          .attr("y", this.initialBaseY - 15); // above the circle

        svg.append("line")
          .attr("x1", this.currentX)
          .attr("y1", this.initialBaseY)
          .attr("x2", this.currentX + 100)
          .attr("y2", this.initialBaseY)
          .attr("stroke", "blue");

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

        // Determine if we're moving up or coming back down
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
          .attr("y", this.initialBaseY - 15);

        // Dot before curve
        svg.append("circle")
          .attr("cx", curveStartX)
          .attr("cy", curveStartY)
          .attr("r", 5)
          .attr("fill", "orange");

        // Curved line
        svg.append("path")
          .attr("d", `M ${curveStartX} ${curveStartY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${curveEndX} ${curveEndY}`)
          .attr("stroke", "orange")
          .attr("stroke-width", 2)
          .attr("fill", "none");

        // Dot after curve
        svg.append("circle")
          .attr("cx", curveEndX)
          .attr("cy", curveEndY)
          .attr("r", 5)
          .attr("fill", "orange");

        // Update X and Y
        this.currentX = curveEndX;
        this.initialBaseY = curveEndY;
      }

    }

  }

  renderSVG() {
    const svg = d3.select(this.svgRef.nativeElement)
      .attr('width', this.tripsPaths$.value.length * this.segmentWidth)
      .attr('height', this.height * 2);

    let x = 0;
    let y = this.height;

    this.tripsPaths$.value.forEach((type, index) => {
      let path = '';

      if (type === 'straight-line') {
        path = `M${x},${y} L${x + this.segmentWidth},${y}`;
      } else if (type === 'arrow-line') {
        path = `M${x},${y} C${x + 30},${y - 60},${x + 90},${y - 60},${x + this.segmentWidth},${y}`;
        svg.append('polygon')
          .attr('points', `${x + this.segmentWidth - 10},${y - 5} ${x + this.segmentWidth},${y} ${x + this.segmentWidth - 10},${y + 5}`)
          .attr('fill', 'orange');
      } else if (type === 'level-two') {
        y = this.height / 2;
        path = `M${x},${y} L${x + this.segmentWidth},${y}`;
      }

      svg.append('path')
        .attr('d', path)
        .attr('stroke', 'orange')
        .attr('fill', 'none')
        .attr('stroke-width', 3);

      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 5)
        .attr('fill', 'orange');

      x += this.segmentWidth;

      // Reset Y for straight-line after level-two
      if (type === 'level-two' && this.tripsPaths$.value[index + 1] === 'straight-line') {
        y = this.height;
      }
    });
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

    // Label
    svg.append("text")
      .text(displayText)
      .attr("x", curveStartX + 5)
      .attr("y", curveStartY - 15);

    // Dot before curve
    svg.append("circle")
      .attr("cx", curveStartX)
      .attr("cy", curveStartY)
      .attr("r", 5)
      .attr("fill", "purple");

    // Curved line (downward)
    svg.append("path")
      .attr("d", `M ${curveStartX} ${curveStartY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${curveEndX} ${curveEndY}`)
      .attr("stroke", "purple")
      .attr("stroke-width", 2)
      .attr("fill", "none");

    // Dot after curve
    svg.append("circle")
      .attr("cx", curveEndX)
      .attr("cy", curveEndY)
      .attr("r", 5)
      .attr("fill", "purple");

    // Update state
    this.currentX = curveEndX;
    this.initialBaseY = curveEndY;
  }

  levelTwoYOffset = 30;      // Downward shift for level-two

  // Generates path string for each type
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
