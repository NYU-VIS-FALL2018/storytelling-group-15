import React, { Component } from "react";
import * as d3 from "d3-fetch";
import * as moment from 'moment'
import { Group } from "@vx/group";
import { Bar } from "@vx/shape";
import { scaleLinear, scaleBand } from "@vx/scale";

// We'll use some mock data from `@vx/mock-data` for this.
class BarGraph extends Component {
  constructor(props) {
    super(props);
    this.data = [];
    this.uniqueYears = [];
    this.width = 500;
    this.height = 500;
    this.state = {
      xMax: 0,
      yMax: 0,
      xPoint: {},
      yPoint: {},
      xScale: {},
      yScale: {}
    };
  }

  componentDidMount() {
    
      this.uniqueYears = [...new Set(this.data.map(datum => datum.Year))]
      // console.log(this.uniqueYears)
      this.parseData()
    
  }

  getDatesToShootingsCountMap(data) {
    return data.reduce((r,d) => {
      r[d.Year] = r[d.Year] ? r[d.Year] + 1 : 1;
      return r;
    }, {})
  }

  parseData() {
    // const width = 500;
    // const height = 500;
    const margin = { top: 20, bottom: 20, left: 20, right: 20 };

    // Then we'll create some bounds
    const xMax = this.width - margin.left - margin.right;
    const yMax = this.height - margin.top - margin.bottom;

    // We'll make some helpers to get at the data we want

    const annualShootingsCount = this.getDatesToShootingsCountMap(this.data)
    const yAccessor = (year) => annualShootingsCount[year]
    // And then scale the graph by our data
    const xScale = scaleBand({
      rangeRound: [0, xMax],
      domain: Object.keys(annualShootingsCount),
      padding: 0.4
    });

    const yScale = scaleLinear({
      rangeRound: [yMax, 0],
      domain: [0, Math.max(...Object.values(annualShootingsCount))]
    });
    // Compose together the scale and accessor functions to get point functions
    const compose = (scale, accessor) => data => scale(accessor(data));
    const yPoint = compose(
      yScale,
      yAccessor
    );
    console.log(yScale(yAccessor(1966)))
    this.setState({
      xMax,
      yMax,
      yPoint,
      xScale,
      yScale
    })
  }

  render() {
    // Define the graph dimensions and margins
    
    // Finally we'll embed it all in an SVG
    return (
      <svg width={this.width} height={this.height}>
        {this.uniqueYears.map((d) => {
          // console.log(d)
          const barHeight = this.state.yMax - this.state.yPoint(d);
          console.log("In RENDER",this.state.yPoint(d))
          return (
            <Group key={`bar-${d}`}>
              <Bar
                x={this.state.xScale(d)}
                y={this.state.yMax - barHeight}
                height={barHeight}
                width={this.state.xScale.bandwidth()}
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
