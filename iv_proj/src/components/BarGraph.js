import React, { Component } from "react";
import { Group } from "@vx/group";
import { Bar } from "@vx/shape";
import { scaleLinear, scaleBand } from "@vx/scale";

// We'll use some mock data from `@vx/mock-data` for this.
class BarGraph extends Component {
  constructor(props) {
    super(props);
    this.uniqueYears = [];
    this.width = 500;
    this.height = 500;
    this.state = {
      data: this.props.data,
      xMax: 0,
      yMax: 0,
      xPoint: {},
      yPoint: {},
      xScale: {},
      yScale: {}
    };
    this.parseDataForBarGraph()
  }

  getDatesToShootingsCountMap(data) {
    return data.reduce((r,d) => {
      r[d.Year] = r[d.Year] ? r[d.Year] + 1 : 1;
      return r;
    }, {})
  }

  parseDataForBarGraph() {
    // const width = 500;
    // const height = 500;
    const margin = { top: 20, bottom: 20, left: 20, right: 20 };

    // Then we'll create some bounds
    this.xMax = this.width - margin.left - margin.right;
    this.yMax = this.height - margin.top - margin.bottom;

    // We'll make some helpers to get at the data we want
    const annualShootingsCount = this.getDatesToShootingsCountMap(this.state.data)
    this.uniqueYears = Object.keys(annualShootingsCount)
    const yAccessor = (year) => annualShootingsCount[year]
    // And then scale the graph by our data
    this.xScale = scaleBand({
      rangeRound: [0, this.xMax],
      domain: Object.keys(annualShootingsCount),
      padding: 0.4
    });

    this.yScale = scaleLinear({
      rangeRound: [this.yMax, 0],
      domain: [0, Math.max(...Object.values(annualShootingsCount))]
    });
    // Compose together the scale and accessor functions to get point functions
    const compose = (scale, accessor) => data => scale(accessor(data));
    this.yPoint = compose(
      this.yScale,
      yAccessor
    );
    // console.log(yScale(yAccessor(1966)))
    // this.setState({
    //   xMax,
    //   yMax,
    //   yPoint,
    //   xScale,
    //   yScale
    // })
  }

  render() {
    return (
      <svg width={this.width} height={this.height}>
        {this.uniqueYears.map((d) => {
          // console.log(d)
          const barHeight = this.yMax - this.yPoint(d);
          return (
            <Group key={`bar-${d}`}>
              <Bar
                x={this.xScale(d)}
                y={this.yMax - barHeight}
                height={barHeight}
                width={this.xScale.bandwidth()}
                fill='#fc2e1c'
              />
            </Group>
          );
        })}
      </svg>
    );
  }
}

export default BarGraph;
