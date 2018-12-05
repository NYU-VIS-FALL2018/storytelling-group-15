import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class StackedBar extends Component {

  constructor(props) {
    super(props);
    this.component = {};



 margin = { top: 20, right: 160, bottom: 35, left: 30 };

  width = 960 - margin.left - margin.right;
  height = 500 - margin.top - margin.bottom;

  this.component.svg = d3.select(this.svgRef)
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


/* Data in strings like it would be if imported from a csv */

 data = [
  { year: "2006", redDelicious: "10", mcintosh: "15", oranges: "9", pears: "6" },
  { year: "2007", redDelicious: "12", mcintosh: "18", oranges: "9", pears: "4" },
  { year: "2008", redDelicious: "05", mcintosh: "20", oranges: "8", pears: "2" },
  { year: "2009", redDelicious: "01", mcintosh: "15", oranges: "5", pears: "4" },
  { year: "2010", redDelicious: "02", mcintosh: "10", oranges: "4", pears: "2" },
  { year: "2011", redDelicious: "03", mcintosh: "12", oranges: "6", pears: "3" },
  { year: "2012", redDelicious: "04", mcintosh: "15", oranges: "8", pears: "1" },
  { year: "2013", redDelicious: "06", mcintosh: "11", oranges: "9", pears: "4" },
  { year: "2014", redDelicious: "10", mcintosh: "13", oranges: "9", pears: "5" },
  { year: "2015", redDelicious: "16", mcintosh: "19", oranges: "6", pears: "9" },
  { year: "2016", redDelicious: "19", mcintosh: "17", oranges: "5", pears: "7" },
]

this.component.parse = d3.time.format("%Y").parse;


// Transpose the data into layers
dataset = d3.layout.stack()(["redDelicious", "mcintosh", "oranges", "pears"].map(function (fruit) {
  return data.map(function (d) {
    return { x: parse(d.year), y: +d[fruit] };
  });
}));


// Set x, y and colors
this.component.x = d3.scale.ordinal()
  .domain(dataset[0].map(function (d) { return d.x; }))
  .rangeRoundBands([10, width - 10], 0.02);

this.component.y = d3.scale.linear()
  .domain([0, d3.max(dataset, function (d) { return d3.max(d, function (d) { return d.y0 + d.y; }); })])
  .range([height, 0]);
colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574"];


// Define and draw axes
this.component.yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(5)
  .tickSize(-width, 0, 0)
  .tickFormat(function (d) { return d });

this.component.xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .tickFormat(d3.time.format("%Y"));

this.component.svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);

this.component.svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);


// Create groups for each series, rects for each segment 
this.component.groups = svg.selectAll("g.cost")
  .data(dataset)
  .enter().append("g")
  .attr("class", "cost")
  .style("fill", function (d, i) { return colors[i]; });

this.component.rect = groups.selectAll("rect")
  .data(function (d) { return d; })
  .enter()
  .append("rect")
  .attr("x", function (d) { return x(d.x); })
  .attr("y", function (d) { return y(d.y0 + d.y); })
  .attr("height", function (d) { return y(d.y0) - y(d.y0 + d.y); })
  .attr("width", x.rangeBand())
  .on("mouseover", function () { tooltip.style("display", null); })
  .on("mouseout", function () { tooltip.style("display", "none"); })
  .on("mousemove", function (d) {
    var xPosition = d3.mouse(this)[0] - 15;
    var yPosition = d3.mouse(this)[1] - 25;
    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    tooltip.select("text").text(d.y);
  });


// Draw legend
this.component.legend = svg.selectAll(".legend")
  .data(colors)
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function (d, i) { return "translate(30," + i * 19 + ")"; });

legend.append("rect")
  .attr("x", width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function (d, i) { return colors.slice().reverse()[i]; });

legend.append("text")
  .attr("x", width + 5)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "start")
  .text(function (d, i) {
    switch (i) {
      case 0: return "Anjou pears";
      case 1: return "Naval oranges";
      case 2: return "McIntosh apples";
      case 3: return "Red Delicious apples";
    }
  });


// Prep the tooltip bits, initial display is hidden
var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");

tooltip.append("rect")
  .attr("width", 30)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 15)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");




render() {
  return (
    <div>
      <svg ref={(el) => { this.svgRef = el }} style={{ width: this.props.width, height: this.props.height }}>
      </svg>
      <div style={{ margin: 75 }} id="chart">
      </div>
    </div>
  );
}
}

StackedBar.defaultProps = {
  margin: {
    left: 60,
    right: 10,
    bottom: 25,
    top: 40
  }
}

StackedBar.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  selectedData: PropTypes.array.isRequired,
}

export default StackedBar;
