import React from "react";
import * as d3 from "d3";
import BubbleChart from "@weknow/react-bubble-chart-d3";
// import Actions          from '../Actions';

class BubbleChartRace extends React.Component {
  constructor(props) {
    super(props);
    this.colors = d3.schemeCategory10
    this.data = this.props.data.reduce((r, o) => {
      r[o["Shooter Race"]] = r[o["Shooter Race"]] ? 
      r[o["Shooter Race"]] 
      : { label: o["Shooter Race"].split("or")[0].trim().split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' '), value: 0 };
      r[o["Shooter Race"]].value += 1;
      return r;
    }, {});
    this.data = Object.values(this.data);
    for (let i in this.data) {
        this.data[i]["color"] = this.colors[i]
    }
    this.x = d => d.value;
    this.xMin = Math.min(...this.data.map(this.x));
    this.xMax = Math.max(...this.data.map(this.x));
  }

  render() {
    return (
        <div>
        <h2>Comparing Ethnicities of the Shooters</h2>
        <BubbleChart
          graph={{
            zoom: 1,
            offsetX: 0.03,
            offsetY: 0
          }}
        //   style={{
        //     marginLeft: 35
        //   }}
          width={1000}
          height={900}
          showLegend={true} // optional value, pass false to disable the legend.
          legendPercentage={20} // number that represent the % of with that legend going to use.
          legendFont={{
            family: "Arial",
            size: 14,
            color: "#000"
          }}
          valueFont={{
            family: "Arial",
            size: 14,
            color: "#fff"
          }}
          labelFont={{
            family: "Arial",
            size: 18,
            color: "#fff"
          }}
          data={this.data}
        />
        </div>
    );
  }
}

export default BubbleChartRace;
