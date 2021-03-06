import React, { Component } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { scaleQuantize } from "@vx/scale";
import topology from "../data/us.json";
import stateNames from "../data/us_state_names.json";
import { LegendLinear, LegendItem, LegendLabel } from "@vx/legend"

class MapStates extends Component {
  constructor(props) {
    super(props);
    this.width = 1000;
    this.height = 600;
    this.us = topology;
    this.data = this.props.data;

    this.names = {};
    this.stateToVictimsCount = {}
    this.stateToShootingsCount = {}
    stateNames.forEach(d => {
      this.names[d.name.toLowerCase()] = d.id;
      this.names[d.id] = d.name.toLowerCase();
      this.stateToVictimsCount[d.id] = 0
      this.stateToShootingsCount[d.id] = 0
    });
    this.stateToVictimsCount = this.data.reduce((r, o) => {
      r[this.names[o.State]] = r[this.names[o.State]]? r[this.names[o.State]] + parseInt(o["Total Number of Victims"]): parseInt(o["Total Number of Victims"]);
      return r;
    }, this.stateToVictimsCount);

    this.stateToShootingsCount = this.data.reduce((r, o) => {
      r[this.names[o.State]] = r[this.names[o.State]]? r[this.names[o.State]] + parseInt(o["Total Number of Victims"]): parseInt(o["Total Number of Victims"]);
      return r;
    }, this.stateToShootingsCount);
    const colorDomain = [0, Math.max(...new Set(Object.values(this.stateToVictimsCount)))]
    this.stateColor = scaleQuantize({
      domain: colorDomain,
      // range: ["#fff5f0","#fff4ef","#fff4ee","#fff3ed","#fff2ec","#fff2eb","#fff1ea","#fff0e9","#fff0e8","#ffefe7","#ffeee6","#ffeee6","#ffede5","#ffece4","#ffece3","#ffebe2","#feeae1","#fee9e0","#fee9de","#fee8dd","#fee7dc","#fee6db","#fee6da","#fee5d9","#fee4d8","#fee3d7","#fee2d6","#fee2d5","#fee1d4","#fee0d2","#fedfd1","#feded0","#feddcf","#fedccd","#fedbcc","#fedacb","#fed9ca","#fed8c8","#fed7c7","#fdd6c6","#fdd5c4","#fdd4c3","#fdd3c1","#fdd2c0","#fdd1bf","#fdd0bd","#fdcfbc","#fdceba","#fdcdb9","#fdccb7","#fdcbb6","#fdc9b4","#fdc8b3","#fdc7b2","#fdc6b0","#fdc5af","#fdc4ad","#fdc2ac","#fdc1aa","#fdc0a8","#fcbfa7","#fcbea5","#fcbca4","#fcbba2","#fcbaa1","#fcb99f","#fcb89e","#fcb69c","#fcb59b","#fcb499","#fcb398","#fcb196","#fcb095","#fcaf94","#fcae92","#fcac91","#fcab8f","#fcaa8e","#fca98c","#fca78b","#fca689","#fca588","#fca486","#fca285","#fca183","#fca082","#fc9e81","#fc9d7f","#fc9c7e","#fc9b7c","#fc997b","#fc987a","#fc9778","#fc9677","#fc9475","#fc9374","#fc9273","#fc9071","#fc8f70","#fc8e6f","#fc8d6d","#fc8b6c","#fc8a6b","#fc8969","#fc8868","#fc8667","#fc8565","#fc8464","#fb8263","#fb8162","#fb8060","#fb7f5f","#fb7d5e","#fb7c5d","#fb7b5b","#fb795a","#fb7859","#fb7758","#fb7657","#fb7455","#fa7354","#fa7253","#fa7052","#fa6f51","#fa6e50","#fa6c4e","#f96b4d","#f96a4c","#f9684b","#f9674a","#f96549","#f86448","#f86347","#f86146","#f86045","#f75e44","#f75d43","#f75c42","#f65a41","#f65940","#f6573f","#f5563e","#f5553d","#f4533c","#f4523b","#f4503a","#f34f39","#f34e38","#f24c37","#f24b37","#f14936","#f14835","#f04734","#ef4533","#ef4433","#ee4332","#ed4131","#ed4030","#ec3f2f","#eb3d2f","#eb3c2e","#ea3b2d","#e93a2d","#e8382c","#e7372b","#e6362b","#e6352a","#e5342a","#e43229","#e33128","#e23028","#e12f27","#e02e27","#df2d26","#de2c26","#dd2b25","#dc2a25","#db2924","#da2824","#d92723","#d72623","#d62522","#d52422","#d42321","#d32221","#d22121","#d12020","#d01f20","#ce1f1f","#cd1e1f","#cc1d1f","#cb1d1e","#ca1c1e","#c91b1e","#c71b1d","#c61a1d","#c5191d","#c4191c","#c3181c","#c2181c","#c0171b","#bf171b","#be161b","#bd161a","#bb151a","#ba151a","#b91419","#b81419","#b61419","#b51319","#b41318","#b21218","#b11218","#b01218","#ae1117","#ad1117","#ac1117","#aa1017","#a91016","#a71016","#a60f16","#a40f16","#a30e15","#a10e15","#a00e15","#9e0d15","#9c0d14","#9b0c14","#990c14","#970c14","#960b13","#940b13","#920a13","#900a13","#8f0a12","#8d0912","#8b0912","#890812","#870811","#860711","#840711","#820711","#800610","#7e0610","#7c0510","#7a0510","#78040f","#76040f","#75030f","#73030f","#71020e","#6f020e","#6d010e","#6b010e","#69000d","#67000d"]
      // range: d3.schemeReds[9]
      range: [
        "#fee0d2",
        "#fcbba1",
        "#fc9272",
        "#fb6a4a",
        "#ef3b2c",
        "#cb181d",
        "#a50f15",
      ]
    })

  }

  componentDidMount() {
    // extract just the names and Ids
    var map_svg = d3.select("#map_with_states");
    var projection = d3.geoAlbersUsa();
    var path = d3.geoPath().projection(projection);
    const states = topojson.feature(this.us, this.us.objects.states).features;
    projection.scale(1130);

    map_svg
      .selectAll("path")
      .data(states)
      .enter()
      .append("path")
      .attr("class", "feature")
      .style("fill", d => this.stateColor(this.stateToVictimsCount[d.id]))
      .style("stroke", "black")
      .style("stroke-width", "0.5")
      .attr("d", path)
      .append("title")
      .text(d => {
        return `${this.names[d.id].split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')}\nShootings: ${this.stateToShootingsCount[d.id]}\nVictims: ${this.stateToVictimsCount[d.id]}`;
      });
      
    map_svg
      .append("g")
      .attr("class", "labels")
      
    
    map_svg
      .selectAll(".labels")
      .data(states)
      .enter()
      .append("text")
      .attr("transform", d => `translate(${path.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", "9")
      // .text(d => this.names[d.id] ? this.names[d.id] : "")
      // .append('svg:tspan')
      // .attr('x', 0)
      // .attr('dy', 20)
      .text(d => this.stateToVictimsCount[d.id] ? parseFloat(this.stateToVictimsCount[d.id]/16).toFixed(2): "0")
  }
  render() {
    const oneDecimalFormat = d3.format('.1f');
    return (
      <div>
        
      <h2>Victims per 100,000 people across States in the US </h2>
      {this.props.mapChanger}
      <div style={{display: "flex", flexDirection: "row", justifyContent:"center", }} id="section1" className="card text-center">
        <svg id="map_with_states" width={this.width} height={this.height} />
        <div style={{display: "flex", flexDirection: 'column'}}>
        <p style={{alignItems:"left", fontSize:12}}>Number of Victims</p>
        <LegendLinear
          scale={this.stateColor}
          labelFormat={(d, i) => {
            if (i % 2 === 0) return oneDecimalFormat(d);
            return '';
          }}
        >
          {labels => {
            return labels.map((label, i) => {
              const size = 11;
              return (
                <LegendItem
                key={`legend-quantile-${i}`}
                >
                  <svg width={size} height={size} style={{ margin: '2px 0' }}>
                    <circle fill={label.value} r={size / 2} cx={size / 2} cy={size / 2} />
                  </svg>
                  <LegendLabel align={'left'} margin={'0 4px'}>
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              );
            });
          }}
        </LegendLinear>
        </div>
      </div>
          </div>
    );
  }
}

export default MapStates;
