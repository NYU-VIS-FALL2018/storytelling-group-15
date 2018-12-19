import React, { Component } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { scaleQuantize } from "@vx/scale";
import topology from "../data/us.json";

class MapLocations extends Component {
  constructor(props) {
    super(props);
    this.width = 1000;
    this.height = 600;
    this.us = topology;
    this.data = this.props.data;
    this.locationToShootingsCount = this.data.reduce((r, o) => {
      r[o.Location] = r[o.Location] ? r[o.Location] + 1 : 1;
      return r;
    }, {});
    this.locationToVictimsCount = this.data.reduce((r, o) => {
      r[o.Location] = r[o.Location]? r[o.Location] + parseInt(o["Total Number of Victims"]): parseInt(o["Total Number of Victims"]);
      return r;
    }, {});
    this.circleColor = scaleQuantize({
      domain: [1, ...new Set(Object.values(this.locationToVictimsCount))],
      range: d3.schemeReds[9]
    });
  }

  componentDidMount() {
    // extract just the names and Ids
    var map_svg = d3.select("#map_with_locations");
    var projection = d3.geoAlbersUsa();
    var path = d3.geoPath().projection(projection);
    const states = topojson.feature(this.us, this.us.objects.states).features;
    projection.scale(1000);

    map_svg
      .selectAll("path")
      .data(states)
      .enter()
      .append("path")
      .attr("class", "feature")
      .style("fill", "lightblue")
      .style("stroke", "black")
      .style("stroke-width", "0.5")
      .attr("d", path)

    map_svg
      .selectAll("circle")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return projection([
          parseFloat(d["Longitude"]),
          parseFloat(d["Latitude"])
        ])[0];
      })
      .attr("cy", function(d) {
        return projection([
          parseFloat(d["Longitude"]),
          parseFloat(d["Latitude"])
        ])[1];
      })
      .attr("r", d => {
        return (parseFloat(this.locationToShootingsCount[d["Location"]]) * 3).toString() + "px";
      })
      .attr("fill", d => this.circleColor(this.locationToVictimsCount[d["Location"]]))
      .style("stroke-width", 1.5)
      .append("title")
      .text(d => {
        return `${d["Location"].split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')}\nShootings: ${this.locationToShootingsCount[d["Location"]]}\nVictims: ${this.locationToVictimsCount[d["Location"]]}`;
      });
  }

  render() {
    return (
      <div id="section1" className="card text-center">
      <h3>Mass Shootings Across Locations by Number of Shootings & Number of Victims</h3>
        <svg id="map_with_locations" width={this.width} height={this.height} />
      </div>
    );
  }
}

export default MapLocations;
