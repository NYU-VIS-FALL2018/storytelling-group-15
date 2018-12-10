import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class HeatMap extends Component {

  constructor(props) {
    super(props);
    this.components = {};

  }
  renderChart(props) {
    this.components.svg = d3.select(this.svgRef);
    this.components.width = props.width - 300;
    this.components.height = props.height;
    this.components.formatDate = d3.timeFormat("%H:%M %p");
    this.components.cellSize = props.height / 24;
    this.components.buckets = 9;
    this.components.timeFormat = d3.timeFormat("%b %d");
    this.components.legendElementWidth = 50;
    this.components.colors = ["#ffffb9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"];
    this.components.colorScale = d3.scaleQuantile()
      .domain([0, this.components.buckets - 1, d3.max(props.data, function(d) { return d.value; })])
      .range(this.components.colors);
  }

  updateData(props) {
    let parseDate = d3.timeParse("%H:%M %p");
    let yScale = d3.scaleTime()
      .domain([parseDate("23:00 PM"), parseDate("00:00 AM")])
      .range([0, this.components.height - 100]);
    let xScale = d3.scaleTime()
      .range([0, this.components.width]);

    let colorScale = this.components.colorScale;

    this.components.cellSizeWidth = (this.components.width) / (props.days);

    xScale.domain(d3.extent(props.data, function(d) { return new Date(d.date); }));

    this.components.xAxis = d3.axisBottom().scale(xScale).tickFormat(this.components.timeFormat).ticks(5);
    this.components.YAxis = d3.axisLeft().scale(yScale).tickFormat(this.components.formatDate).ticks(12);

    this.components.g = this.components.svg.append("g").attr("transform",
        "translate(" + props.margin.left + "," + props.margin.top + ")")
      .attr("class", "inner");

    this.components.g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (props.height - props.margin.top - 40) + ")")
      .call(this.components.xAxis);

    this.components.g.append("g")
      .attr("class", "Yaxis")
      .call(this.components.YAxis);

    this.components.cells = this.components.g.selectAll('rect')
      .data(props.data)
      .enter().append('g').append('rect')
      .attr('class', 'cell')
      .attr('width', this.components.cellSizeWidth)
      .attr('height', this.components.cellSize)
      .attr('y', function(d) { return yScale(parseDate(d.hour)); })
      .attr('x', function(d) { return xScale(new Date(d.date)); })
      .attr('fill', function(d) { return colorScale(d.value); });

    this.components.cells.append("title");
    this.components.cells.select("title").text(function(d) { return " Count : " + d.value; });


    this.components.cells.exit().remove();
  }

  renderLegend() {
    let colors = this.components.colors;
    let legendElementWidth = this.components.legendElementWidth;

    this.components.legend = this.components.svg.append("g").attr("class", "inner").selectAll(".legend")
      .data([0].concat(this.components.colorScale.quantiles()), function(d) { return d; })
      .enter().append("g");

    this.components.legend.append("rect")
      .attr("y", function(d, i) { return legendElementWidth * i + 30; })
      .attr("x", this.props.width - 100)
      .attr("height", legendElementWidth)
      .attr("width", this.components.cellSize)
      .attr("fill", function(d, i) { return colors[i]; });

    this.components.legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("y", function(d, i) { return legendElementWidth * i + 60; })
      .attr("x", this.props.width - 100 + this.components.cellSize + 10);

    this.components.legend.exit().remove();
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.width !== this.props.width || nextProps.height !== this.props.height || nextProps.data !== this.props.data) {
      this.components.svg.selectAll(".inner").remove();
      this.updateData(nextProps);
      this.renderLegend();
    }

  }

  componentDidMount() {
    this.renderChart(this.props);
    this.updateData(this.props);
    this.renderLegend();
  }

  componentWillUnmount() {
    d3.select(this.svgRef).selectAll("*").remove();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.width !== this.props.width || nextProps.height !== this.props.height || nextProps.data !== this.props.data) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div>
        <svg ref={(el)=>{this.svgRef = el}} style={{width: this.props.width, height:this.props.height}}>
        </svg>
        <div style = {{margin:75}} id="chart">
        </div>        
      </div>
    );
  }
}

HeatMap.defaultProps = {
  margin: {
    left: 60,
    right: 10,
    bottom: 25,
    top: 40
  }
}

HeatMap.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default HeatMap;
