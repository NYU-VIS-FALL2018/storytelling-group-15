import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Map.css';
import * as d3 from 'd3';
import * as topology from './world_countries.json';
// import DataCSV from './Stanford_MSA_Database.csv';

class Map extends Component {

  constructor(props) {
    super(props);
    this.components = {};
    this.dataCSV = {}

  }
  renderChart(props) {
    // console.log("topology:---->", topology.features);
    
    this.components.svg = d3.select(this.svgRef);
    this.components.width = props.width - 300;
    this.components.height = props.height;

    this.components.g = this.components.svg.append("g");
    
    this.components.projection = d3.geoMercator()
      .scale((props.width + 1) / 2.2 / Math.PI)
      .translate([props.width / 2.2, props.height / 1.7]);
    this.components.path = d3.geoPath()
      .projection(this.components.projection);
    this.map = this.components.g.selectAll("path")
      .data(topology.features)
      .enter()
      .append("path")
      .attr("d", this.components.path)
      .style("fill", "#ADD8E6")
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity", 0.6);


    var tooltip = d3.select("#chart")
      .append("div")
      .attr("className", "tooltip");

    tooltip.append("div")
      .attr("class", "label");

    this.map.on("mouseover", function (d) {
      tooltip.select(".label").html(d.properties.name);
      tooltip.style("display", "block");
      tooltip.style("position", "absolute");
      tooltip.style("left", "130px");
      tooltip.style("background", "white");
      tooltip.style("box-shadow", "0 0 5px #999999");
      tooltip.style("color", "#333");
      tooltip.style("padding", "10px");
      tooltip.style("text-align", "center");
      tooltip.style("width", "100px");
      tooltip.style("z-index", "10");

    })
      .on("mousemove", function (d) {
        tooltip.style("top", (d3.event.layerY + 10) + 'px')
          .style("left", (d3.event.layerX - 25) + 'px');
      })

      .on("mouseout", function () {
        tooltip.style("display", "none");
      });

    var projection = this.components.projection;
    this.components.svg.selectAll("circle")
      .data(props.data).enter()
      .append("circle")
      .attr("cx", function (d) { 
        // console.log(projection(d)); 
        return projection([d.lat, d.lon])[0]; })
      .attr("cy", function (d) { return projection([d.lat, d.lon])[1]; })
      .attr("r", "4px")
      .attr("fill", "red")

  }

  updateData(props) {
    this.components.svg.selectAll("circle").remove();
    var projection = this.components.projection;
    this.components.svg.selectAll("circle")
      .data(props.data).enter()
      .append("circle")
      .attr("cx", function (d) { 
        // console.log(projection(d)); 
        return projection([d.lat, d.lon])[0]; })
      .attr("cy", function (d) { return projection([d.lat, d.lon])[1]; })
      .attr("r", "4px")
      .attr("fill", "red")
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.width !== this.props.width || nextProps.height !== this.props.height || nextProps.data !== this.props.data) {

      this.updateData(nextProps);
    }

  }

  componentDidMount() {
    this.renderChart(this.props);
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
  
  // loadData() {
  //   d3.csv('http://localhost:8081/Stanford_MSA_Database.csv', function (data){
  //     console.log(data)
  //   })
  // }

  // cleanData(data) {
  //   data.forEach((row) => {
  //     console.log(row)
  //   });
  // }
  

  render() {
    return (
      <div>
      {/* {this.loadData()} */}
        <svg ref={(el) => { this.svgRef = el }} style={{ width: this.props.width, height: this.props.height }}>
        </svg>
        <div id="chart">
        </div>
      </div>
    );
  }
}

Map.defaultProps = {
  margin: {
    left: 150,
    right: 50,
    bottom: 25,
    top: 10
  }
}

Map.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default Map;
