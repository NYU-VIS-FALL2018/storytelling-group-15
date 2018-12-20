import React from "react";
import * as d3 from "d3";
import BubbleChart from "@weknow/react-bubble-chart-d3";
// import Actions          from '../Actions';

class BubbleChartWeapons extends React.Component {
  constructor(props) {
    super(props);
    this.colors = d3.schemeSet1
    this.data = this.props.data.reduce((r, o) => {
      r[o["Type of Gun - General"]] = r[o["Type of Gun - General"]] ? 
      r[o["Type of Gun - General"]] : { label: o["Type of Gun - General"].split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' '), value: 0 };
      r[o["Type of Gun - General"]].value += 1;
      return r;
    }, {});
    this.data = Object.values(this.data).sort((a,b) => b.value - a.value);
    for(let i in this.data){
        this.data[i]["color"] = this.colors[i]
    }
    this.x = d => d.value;
    this.xMin = Math.min(...this.data.map(this.x));
    this.xMax = Math.max(...this.data.map(this.x));
  }

  bubbleClick = label => {
    console.log("Custom bubble click func");
  };
  legendClick = label => {
    console.log("Customer legend click func");
  };
  render() {
    return (
        <div>
        <h2>Weapons Most Used In Shootings</h2>
        <BubbleChart
          graph={{
            zoom: 1,
            // offsetX: 35,
            offsetY: 0
          }}
          style={{
            width: "850px",
            height: "500px",
            marginLeft: 35
          }}
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
            size: 13,
            color: "#fff"
          }}
          labelFont={{
            family: "Arial",
            size: 25,
            color: "#fff"
          }}
          //Custom bubble/legend click functions such as searching using the label, redirecting to other page
          bubbleClickFunc={this.bubbleClick}
          legendClickFun={this.legendClick}
          data={this.data}
        />
        </div>
    );
  }
}

export default BubbleChartWeapons;
