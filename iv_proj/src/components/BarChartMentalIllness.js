import React, { Component } from "react";
import { Bar, Line } from "@vx/shape";
import { Group } from "@vx/group";
import { Grid } from "@vx/grid";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { scaleBand, scaleLinear } from "@vx/scale";

class BarChartMentalIllness extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapIndex: 1
    };
    this.bg = "#eaedff";
    let motiveToNumberOfShootings = this.props.data.reduce((r, o) => {
      r[o["Possible Motive - General"]] = r[o["Possible Motive - General"]]
        ? r[o["Possible Motive - General"]]
        : { motive: o["Possible Motive - General"], number: 0 };
      r[o["Possible Motive - General"]]["number"] =
        r[o["Possible Motive - General"]]["number"] + 1;
      return r;
    }, {});

    this.data = Object.values(motiveToNumberOfShootings).sort((a,b) => b.number - a.number);    
    this.x = d => d.motive;
    this.y = d => d.number;

    this.width = 500;
    this.height = 550;
    this.margin = {
      left: 55,
      right: 10,
      top: 40,
      bottom: 0
    };
    // bounds
    this.xMax = this.width - this.margin.left;
    this.yMax = this.height - 200;

    // scales
    this.xScale = scaleBand({
      rangeRound: [0, this.xMax],
      domain: this.data.map(this.x),
      padding: 0.4
    });
    this.yScale = scaleLinear({
      rangeRound: [this.yMax, 0],
      domain: [0, Math.max(...this.data.map(this.y))]
    });

  }

  color(data){
    if(data.motive === "mental illness") {
      return "#54278f"
    } else {
      return "#bcbddc"
    }
  }

  opacity(data){
    if(data.motive === "mental illness") {
      return 1.5
    } else {
      return 0.7
    }
  }

  render() {
    return (
      <div>
        <h3>Possible Motives Behind The Shootings</h3>
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
            xScale={this.xScale}
            yScale={this.yScale}
            width={this.xMax}
            height={this.yMax}
            stroke={"black"}
            strokeOpacity={0.1}
            xOffset={this.xScale.bandwidth() / 2}
          />
          <Group top={this.margin.top} left={this.margin.left}>
            {this.data.map((d, i) => {
              const age = this.x(d);
              const barWidth = this.xScale.bandwidth();
              const barHeight = this.yMax - this.yScale(this.y(d));
              const barX = this.xScale(age);
              const barY = this.yMax - barHeight;
              return (
                <Bar
                  key={`bar-${age}`}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={this.color(d)}
                  opacity={this.opacity(d)}
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
              scale={this.yScale}
              hideZero
              label="Number of Shootings"
              labelProps={{
                fill: "steelblue",
                textAnchor: "middle",
                fontSize: 11,
                fontFamily: "Arial"
              }}
              tickLabelProps={(value, index) => ({
                fill: "steelblue",
                textAnchor: "end",
                fontSize: 10,
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
            {/* <AxisBottom
              top={this.yMax}
              scale={this.xScale}
              stroke="steelblue"
              label="Age Groups"
              labelProps={{
                fill: "steelblue",
                textAnchor: "middle",
                fontSize: 11,
                fontFamily: "Arial"
              }}
              tickStroke={"steelblue"}
              tickLabelProps={(value, index) => ({
                fill: "steelblue",
                fontSize: 11,
                textAnchor: "middle"
              })}
            /> */}
            <AxisBottom
              top={this.yMax}
              left={0}
              scale={this.xScale}
              numTicks={18}
              stroke="#1b1a1e"
              label="Motives"
            >
              {axis => {
                const tickLabelSize = 10;
                const tickRotate = -90;
                const tickColor = "#8e205f";
                const axisCenter = this.width/2 - this.margin.left
                return (
                  <g className="my-custom-bottom-axis">
                    {axis.ticks.map((tick, i) => {
                      const tickX = tick.to.x;
                      const tickY = tick.to.y + tickLabelSize + axis.tickLength;
                      return (
                        <Group
                          key={`vx-tick-${tick.value}-${i}`}
                          className={"vx-axis-tick"}
                        >
                          <Line
                            from={tick.from}
                            to={tick.to}
                            stroke={tickColor}
                          />
                          <text
                            transform={`translate(${tickX}, ${tickY-10}) rotate(${tickRotate})`}
                            fontSize={tickLabelSize}
                            textAnchor="end"
                            fill={tickColor}
                          >
                            {tick.formattedValue}
                          </text>
                        </Group>
                      );
                    })}
                    <text
                      textAnchor="middle"
                      transform={`translate(${axisCenter}, 110)`}
                      fontSize="12"
                      fill="#8e205f"
                      fontWeight="bold"
                    >
                      {"Motives"}
                    </text>
                  </g>
                );
              }}
            </AxisBottom>
          </Group>
        </svg>
        
      </div>
    );
  }
}
export default BarChartMentalIllness;
