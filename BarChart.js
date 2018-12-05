import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BarChart.css';

class BarChart extends Component {

  constructor(props) {
    super(props);
    this.components = {};

  }
  renderChart(props) {
    this.components.svg = d3.select(this.svgRef);
    this.components.width = props.width - 300;
    this.components.height = props.height;

    this.components.g = this.components.svg.append("g")
      .attr("transform", "translate(" + props.margin.left + "," + props.margin.top + ")");

    this.components.x = d3.scaleLinear()
      .range([0, this.components.width])
      .domain([0, d3.max(props.data, function(d) {
        return d.value;
      })]);

    this.components.y = d3.scaleBand()
      .rangeRound([0, props.height])
      .padding(0.1)
      .domain(props.data.map(function(d) {
        return d.name;
      }));

    this.components.yAxis = d3.axisLeft().scale(this.components.y).tickSize(0);
    this.components.color = d3.scaleOrdinal(d3.schemeCategory10);


  }

  updateData(props) {
    let y = this.components.y;
    let x = this.components.x;
    let color = this.components.color;
    this.components.chart = this.components.g.append("g")
      .attr("class", "inner");
    this.components.gy = this.components.chart.append("g")
      .attr("class", "y axis")
      .call(this.components.yAxis);
    this.components.bars = this.components.chart.selectAll(".bar")
      .data(props.data)
      .enter()
      .append("g");
    this.components.bars.append("rect")
      .attr("class", "bar")
      .attr("y", function(d) {
        return y(d.name);
      })
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("width", function(d) {
        return x(d.value);
      })
      .style("fill", function(d, i) { return color(i + 4); });

    this.components.bars.append("text")
      .attr("class", "label")
      .attr("y", function(d) {
        return y(d.name) + y.bandwidth() / 2 + 4;
      })
      .attr("x", function(d) {
        return x(d.value) + 3;
      })
      .text(function(d) {
        return d.value;
      });
    this.components.bars.exit().remove();
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.width !== this.props.width || nextProps.height !== this.props.height || nextProps.data !== this.props.data) {
      this.components.g.selectAll(".inner").remove();
      this.updateData(nextProps);
    }

  }

  componentDidMount() {
    this.renderChart(this.props);
    this.updateData(this.props);
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
        <svg className = {s.chart} ref={(el)=>{this.svgRef = el}} style={{width: this.props.width, height:this.props.height}}>
        </svg>
        <div id="chart">
        </div>        
      </div>
    );
  }
}

BarChart.defaultProps = {
  margin: {
    left: 150,
    right: 50,
    bottom: 25,
    top: 10
  }
}

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default BarChart;
