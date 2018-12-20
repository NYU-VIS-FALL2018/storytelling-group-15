import React, { Component } from "react";
import { Group } from "@vx/group";
import { curveBasis } from "@vx/curve";
import { Grid } from "@vx/grid"
import { LinearGradient } from "@vx/gradient";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { Area, LinePath, Line } from "@vx/shape";
import { scaleTime, scaleLinear } from "@vx/scale";
class AreaChart extends Component {
  constructor(props) {
    super(props);
    this.data = this.getDatesToShootingsCountMap(this.props.data);
    // accessors
    this.x = d => new Date(d.year);
    this.y = d => d.count;
    this.margin = {
      left: 60,
      top: 55,
      bottom: 60,
      right: 75
    };
    this.width = 700;
    this.height = 600;
    this.bg = "#eaedff";

    this.xMax = this.width - this.margin.left - this.margin.right;
    this.yMax = this.height - this.margin.top - this.margin.bottom;

    // scales
    this.xScale = scaleTime({
      range: [0, this.xMax / 9],
      domain: this.data.map(this.x)
    });
    this.yScale = scaleLinear({
      range: [this.yMax, 0],
      domain: [0, Math.max(...this.data.map(this.y))],
      nice: true
    });
  }

  // responsive utils for axis ticks
  numTicksForHeight(height) {
    if (height <= 300) return 3;
    if (300 < height && height <= 600) return 5;
    return 10;
  }

  numTicksForWidth(width) {
    if (width <= 300) return 2;
    if (300 < width && width <= 400) return 5;
    return 10;
  }

  getDatesToShootingsCountMap(data) {
    const yearToNumMap = data.reduce((r, d) => {
      r[d.Year] = r[d.Year] ? r[d.Year] + 1 : 1;
      return r;
    }, {});
    const dataForAreaChart = [];
    for (let year of Object.keys(yearToNumMap)) {
      const yearToNum = {
        year: year,
        count: yearToNumMap[year]
      };
      dataForAreaChart.push(yearToNum);
    }
    return dataForAreaChart;
  }

  // bounds

  render() {
    return (
      <div className="annual_shootings">
        <h3>Number of Mass Shootings In the US Over The Years</h3>
        <svg width={this.width} height={this.height}>
          <rect x={0} y={0} width={this.width} height={this.height} fill={this.bg} rx={14} />
          <LinearGradient
            id="linear"
            from="#fed976"
            to="#f03b20"
            vertical={false}
            fromOpacity={0.3}
            toOpacity={1.0}
          />
          <Grid
            top={this.margin.top}
            left={this.margin.left}
            xScale={this.xScale}
            yScale={this.yScale}
            width={this.width}
            height={this.yMax}
            stroke={"black"}
            strokeOpacity={0.1}
            // xOffset={this.xScale.bandwidth() / 2}
          />
          <Group top={this.margin.top} left={this.margin.left}>
            <Area
              data={this.data}
              x={d => this.xScale(this.x(d))}
              y0={d => this.yScale.range()[0]}
              y1={d => this.yScale(this.y(d))}
              strokeWidth={2}
              stroke={"transparent"}
              fill={"url(#linear)"}
              curve={curveBasis}
            />
            <LinePath
              data={this.data}
              x={d => this.xScale(this.x(d))}
              y={d => this.yScale(this.y(d))}
              stroke={"url('#linear')"}
              strokeWidth={2}
              curve={curveBasis}
            />
          </Group>
          <Group left={this.margin.left}>
            <AxisLeft
              top={this.margin.top}
              left={0}
              scale={this.yScale}
              hideZero
              numTicks={this.numTicksForHeight(this.height)}
              label="Number of Shootings"
              labelProps={{
                fill: "#8e205f",
                textAnchor: "middle",
                fontSize: 14,
                fontFamily: "Arial"
              }}
              stroke="#1b1a1e"
              tickStroke="#8e205f"
              tickLabelProps={(value, index) => ({
                fill: "#8e205f",
                textAnchor: "end",
                fontSize: 12,
                fontFamily: "Arial",
                dx: "-0.25em",
                dy: "0.25em"
              })}
              tickComponent={({ formattedValue, ...tickProps }) => (
                <text {...tickProps}>{formattedValue}</text>
              )}
            />

            <AxisBottom
              top={this.height - this.margin.bottom}
              left={0}
              scale={this.xScale}
              numTicks={this.numTicksForWidth(this.width)}
              stroke="#1b1a1e"
              label="Years"
            >
              {axis => {
                const tickLabelSize = 10;
                const tickRotate = 45;
                const tickColor = "#8e205f";
                const axisCenter =
                  axis.axisToPoint.x - axis.axisFromPoint.x + 160;
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
                            transform={`translate(${tickX}, ${tickY}) rotate(${tickRotate})`}
                            fontSize={12}
                            textAnchor="middle"
                            fill={tickColor}
                          >
                            {tick.formattedValue}
                          </text>
                        </Group>
                      );
                    })}
                    <text
                      textAnchor="middle"
                      transform={`translate(${axisCenter+70}, 50)`}
                      fontSize="1em"
                      fill="#8e205f"
                    >
                      {axis.label}
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

export default AreaChart;
