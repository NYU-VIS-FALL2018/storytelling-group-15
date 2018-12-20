import React, { Component } from "react";
import { Bar } from "@vx/shape";
import { Group } from "@vx/group";
import { Grid } from "@vx/grid";
import * as d3 from "d3";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { scaleBand, scaleLinear } from "@vx/scale";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapIndex: 1
    };
    this.bg = "#eaedff";
    let ageToNumberOfShootings = this.props.data.reduce((r, o) => {
      r[o["Average Shooter Age"]] = r[o["Average Shooter Age"]] ? r[o["Average Shooter Age"]] : { age: o["Average Shooter Age"], number: 0 };
      r[o["Average Shooter Age"]]["number"] = r[o["Average Shooter Age"]]["number"] + 1;
      return r;
    }, {});

    let ageToNumberOfVictims = this.props.data.reduce((r, o) => {
      r[o["Average Shooter Age"]] = r[o["Average Shooter Age"]] ? r[o["Average Shooter Age"]] : { age: o["Average Shooter Age"], number: 0 };
      r[o["Average Shooter Age"]]["number"] = r[o["Average Shooter Age"]]["number"] + parseInt(o["Total Number of Victims"]);
      return r;
    }, {});

    const ageRanges = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65];
    const ageToNumberOfShootingsBinned = {};
    for (let obj of Object.values(ageToNumberOfShootings)) {
      const ageIndex = Math.floor(parseInt(obj["age"]) / 5) - 2;
      let ageRange = "";
      if (ageIndex >= 0 && ageIndex < ageRanges.length - 1) {
        ageRange = `${ageRanges[ageIndex]}-${ageRanges[ageIndex + 1] - 1}`;
      } else if (ageIndex >= ageRanges.length - 1) {
        ageRange = `${ageRanges[ageRanges.length - 1]}+`;
      }
      ageToNumberOfShootingsBinned[ageRange] = ageToNumberOfShootingsBinned[
        ageRange
      ]
        ? ageToNumberOfShootingsBinned[ageRange]
        : { ageRange, number: 0 };
      ageToNumberOfShootingsBinned[ageRange].number =
        ageToNumberOfShootingsBinned[ageRange].number + obj["number"];
    }

    const ageToNumberOfVictimsBinned = {};
    for (let obj of Object.values(ageToNumberOfVictims)) {
      const ageIndex = Math.floor(parseInt(obj["age"]) / 5) - 2;
      let ageRange = "";
      if (ageIndex >= 0 && ageIndex < ageRanges.length - 1) {
        ageRange = `${ageRanges[ageIndex]}-${ageRanges[ageIndex + 1] - 1}`;
      } else if (ageIndex >= ageRanges.length - 1) {
        ageRange = `${ageRanges[ageRanges.length - 1]}+`;
      }
      ageToNumberOfVictimsBinned[ageRange] = ageToNumberOfVictimsBinned[
        ageRange
      ]
        ? ageToNumberOfVictimsBinned[ageRange]
        : { ageRange, number: 0 };
      ageToNumberOfVictimsBinned[ageRange].number =
        ageToNumberOfVictimsBinned[ageRange].number + obj["number"];
    }

    ageToNumberOfShootings = Object.values(ageToNumberOfShootingsBinned);
    ageToNumberOfVictims = Object.values(ageToNumberOfVictimsBinned);

    this.data = [ageToNumberOfShootings, ageToNumberOfVictims];
    // accessors
    this.x = d => d.ageRange;
    this.y = d => d.number;

    this.width = 660;
    this.height = 550;
    this.margin = {
      left: 65,
      right: 10,
      top: 40,
      bottom: 0
    };
    // bounds
    this.xMax = this.width - this.margin.left;
    this.yMax = this.height - 100;

    // scales
    this.xScale = [
      scaleBand({
        rangeRound: [0, this.xMax],
        domain: this.data[0].map(this.x),
        padding: 0.4
      }),
      scaleBand({
        rangeRound: [0, this.xMax],
        domain: this.data[1].map(this.x),
        padding: 0.4
      })
    ];
    this.yScale = [
      scaleLinear({
        rangeRound: [this.yMax, 0],
        domain: [0, Math.max(...this.data[0].map(this.y))]
      }),
      scaleLinear({
        rangeRound: [this.yMax, 0],
        domain: [0, Math.max(...this.data[1].map(this.y))]
      })
    ];
    this.colorScale = [
      scaleLinear({
        domain: [0, Math.max(...this.data[0].map(this.y))],
        range: [d3.rgb("#3182bd").brighter(), d3.rgb("#3182bd").darker()]
      }),
      scaleLinear({
        domain: [0, Math.max(...this.data[1].map(this.y))],
        range: [d3.rgb("#3182bd").brighter(), d3.rgb("#3182bd").darker()]
      })
    ];
  }
  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
          <h2>Number of Shootings & Victims by Age Groups of Shooters</h2>
          <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{paddingRight: '5px'}}>
        <svg width={this.width} height={this.height}>
          <rect
            x={0}
            y={0}
            width={this.width}
            height={this.height}
            fill={this.bg}
            rx={14}
            />
          <Grid
            top={this.margin.top}
            left={this.margin.left}
            xScale={this.xScale[0]}
            yScale={this.yScale[0]}
            width={this.xMax}
            height={this.yMax}
            stroke={"black"}
            strokeOpacity={0.1}
            xOffset={this.xScale[0].bandwidth() / 2}
            />
          <Group top={this.margin.top} left={this.margin.left}>
            {this.data[0].map((d, i) => {
                const age = this.x(d);
                const barWidth = this.xScale[0].bandwidth();
                const barHeight = this.yMax - this.yScale[0](this.y(d));
                const barX = this.xScale[0](age);
                const barY = this.yMax - barHeight;
                return (
                    <Bar
                    key={`bar-${age}`}
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill={this.colorScale[0](this.y(d))}
                    onClick={event => {
                        alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                    }}
                    />
                    );
                })}
          </Group>
          <Group top={this.margin.top} left={this.margin.left}>
            <AxisLeft
              top={0}
              left={0}
              scale={this.yScale[0]}
              hideZero
              label="Number of Shootings"
              labelProps={{
                  fill: "steelblue",
                  textAnchor: "middle",
                  fontSize: 14,
                  fontFamily: "Arial"
                }}
                tickLabelProps={(value, index) => ({
                    fill: "steelblue",
                    textAnchor: "end",
                    fontSize: 14,
                    fontFamily: "Arial",
                    dx: "-0.25em",
                    dy: "0.25em"
                })}
                stroke="steelblue"
              tickStroke="steelblue"
              tickComponent={({ formattedValue, ...tickProps }) => (
                  <text {...tickProps}>{formattedValue}</text>
                  )}
                  />
            <AxisBottom
              top={this.yMax}
              scale={this.xScale[0]}
              stroke="steelblue"
              label="Age Groups"
              labelProps={{
                  fill: "steelblue",
                  textAnchor: "middle",
                  fontSize: 14,
                  fontFamily: "Arial"
                }}
                tickStroke={"steelblue"}
                tickLabelProps={(value, index) => ({
                    fill: "steelblue",
                    fontSize: 14,
                    textAnchor: "middle"
                })}
                />
          </Group>
        </svg>
        </div>
        <div style={{paddingLeft: '5px'}}>
        <svg width={this.width} height={this.height}>
          <rect
            x={0}
            y={0}
            width={this.width}
            height={this.height}
            fill={this.bg}
            rx={14}
          />
          <Grid
            top={this.margin.top}
            left={this.margin.left}
            xScale={this.xScale[1]}
            yScale={this.yScale[1]}
            width={this.xMax}
            height={this.yMax}
            stroke={"black"}
            strokeOpacity={0.1}
            xOffset={this.xScale[1].bandwidth() / 2}
          />
          <Group top={this.margin.top} left={this.margin.left}>
            {this.data[1].map((d, i) => {
              const age = this.x(d);
              const barWidth = this.xScale[1].bandwidth();
              const barHeight = this.yMax - this.yScale[1](this.y(d));
              const barX = this.xScale[1](age);
              const barY = this.yMax - barHeight;
              return (
                <Bar
                  key={`bar-${age}`}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={this.colorScale[1](this.y(d))}
                  onClick={event => {
                    alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                  }}
                />
              );
            })}
          </Group>
          <Group top={this.margin.top} left={this.margin.left}>
            <AxisLeft
              top={0}
              left={0}
              scale={this.yScale[1]}
              hideZero
              label="Number of Victims"
              labelProps={{
                fill: "steelblue",
                textAnchor: "middle",
                fontSize: 14,
                fontFamily: "Arial"
              }}
              tickLabelProps={(value, index) => ({
                fill: "steelblue",
                textAnchor: "end",
                fontSize: 14,
                fontFamily: "Arial",
                dx: "-0.25em",
                dy: "0.25em"
              })}
              stroke={"steelblue"}
              tickStroke={"steelblue"}
              tickComponent={({ formattedValue, ...tickProps }) => (
                <text {...tickProps}>{formattedValue}</text>
              )}
            />
            <AxisBottom
              top={this.yMax}
              scale={this.xScale[1]}
              stroke={"steelblue"}
              label={"Age Groups"}
              labelProps={{
                fill: "steelblue",
                textAnchor: "middle",
                fontSize: 14,
                fontFamily: "Arial"
              }}
              tickStroke={"steelblue"}
              tickLabelProps={(value, index) => ({
                fill: "steelblue",
                fontSize: 14,
                textAnchor: "middle"
              })}
            />
          </Group>
        </svg>
        </div>
        </div>
      </div>
    );
  }
}
export default BarChart;
