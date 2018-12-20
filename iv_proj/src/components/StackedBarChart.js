import React, { Component } from "react";
import { BarStack } from "@vx/shape";
import { Group } from "@vx/group";
import { Grid } from "@vx/grid";
import { AxisBottom, AxisLeft } from "@vx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@vx/scale";
import { withTooltip } from "@vx/tooltip";
import { LegendOrdinal } from "@vx/legend";

class StackedBarChart extends Component {
  constructor(props) {
    super(props);

    this.brown1 = "#fdae6b";
    this.brown2 = "#e6550d";
    // this.purple3 = "#a44afe";
    this.bg = "#eaedff";

    const majorStates = ["california", "florida", "texas", "colorado", "georgia", "new york"]
    this.data = this.props.data.reduce((r, o) => {
        if(majorStates.includes(o.State)) {
            if(!r[o.State]){
                r[o.State] = {}
                r[o.State]["state"] = o.State.split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
                r[o.State]["civilian_fatalities"] = parseInt(o["Number of Civilian Fatalities"])
                r[o.State]["civilian_injured"] = parseInt(o["Number of Civilian Injured"])
            } else {
                r[o.State]["civilian_fatalities"] = r[o.State]["civilian_fatalities"] + parseInt(o["Number of Civilian Fatalities"])
                r[o.State]["civilian_injured"] = r[o.State]["civilian_injured"] + parseInt(o["Number of Civilian Injured"])
            }
        }
        return r
    }, {})
    this.data = Object.values(this.data)
    this.keys = Object.keys(this.data[0]).filter(d => d !== "state" && d !== "total_victims");

    const totals = this.data.map(d => d["civilian_injured"] + d["civilian_fatalities"]);
    // accessors
    this.x = d => d.state;

    // scales
    this.xScale = scaleBand({
      domain: this.data.map(this.x),
      padding: 0.2
    });
    this.yScale = scaleLinear({
      domain: [0, Math.max(...totals)],
      nice: true
    });
    this.color = scaleOrdinal({
      domain: this.keys,
      range: [this.brown2, this.brown1]
    });

    this.tooltipTimeout = 10000;

    this.width = 800
    this.height = 500
    this.margin = {
        top: 40,
        left: 70
    }
    // this.tooltipOpen = true
    // this.tooltipLeft = 20
    // this.tooltipTop = 10
    // this.tooltipData = {}
    // this.hideTooltip = () => {}
    // this.showTooltip = () => {}
    this.xMax = this.width- this.margin.left + 30;
    this.yMax = this.height - this.margin.top - 100;

    this.xScale.rangeRound([0, this.xMax]);
    this.yScale.range([this.yMax, 0]);
  }
  render() {
    return (
    <div>
      <h3>Proportion of Injuries vs Fatalities in the Top 5 States</h3>
      <div style={{ position: "relative" }}>
        <svg width={this.width} height={this.height}>
          <rect x={0} y={0} width={this.width} height={this.height} fill={this.bg} rx={14} />
          <Grid
            top={this.margin.top}
            left={this.margin.left}
            right={this.width-this.margin.left}
            xScale={this.xScale}
            yScale={this.yScale}
            width={this.xMax}
            height={this.yMax}
            stroke={"black"}
            strokeOpacity={0.1}
            xOffset={this.xScale.bandwidth() / 2}
          />
          <Group top={this.margin.top} left={this.margin.left}>
            <BarStack
              data={this.data}
              keys={this.keys}
              x={this.x}
              xScale={this.xScale}
              yScale={this.yScale}
              color={this.color}
            >
              {(barStacks) => {
                return barStacks.map(barStack => {
                  return barStack.bars.map(bar => {
                    return (
                      <rect
                        key={`bar-stack-${barStack.index}-${bar.index}`}
                        x={bar.x}
                        y={bar.y}
                        height={bar.height}
                        width={50}
                        fill={bar.color}
                        onClick={event => {
                          alert(`clicked: ${JSON.stringify(bar)}`);
                        }}
                        // onMouseLeave={event => {
                        //   this.tooltipTimeout = setTimeout(() => {
                        //     this.hideTooltip();
                        //   }, 300);
                        // }}
                        // onMouseMove={event => {
                        //   if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
                        //   const top = event.clientY - this.margin.top - bar.height;
                        //   const offset =
                        //     (this.xScale.paddingInner() * this.xScale.step()) / 2;
                        //   const left = bar.x + bar.width + offset;
                        //   this.showTooltip({
                        //     tooltipData: bar,
                        //     tooltipTop: top,
                        //     tooltipLeft: left
                        //   });
                        // }}
                      />
                    );
                  });
                });
              }}
            </BarStack>
          </Group>
          <Group>

          <AxisLeft
              top={this.margin.top}
              left={this.margin.left}
              scale={this.yScale}
              hideZero
              label="Number of Victims Per 1M People"
              labelProps={{
                fill: this.purple3,
                textAnchor: "middle",
                fontSize: 11,
                fontFamily: "Arial"
              }}
              tickLabelProps={(value, index) => ({
                fill: this.purple3,
                textAnchor: "end",
                fontSize: 10,
                fontFamily: "Arial",
                dx: "-0.25em",
                dy: "0.25em"
              })}
              stroke={this.purple3}
              tickStroke={this.purple3}
              tickComponent={({ formattedValue, ...tickProps }) => (
                <text {...tickProps}>{formattedValue}</text>
              )}
            />
          <AxisBottom
            top={this.yMax + this.margin.top}
            left={this.margin.left-20}
            scale={this.xScale}
            stroke={this.purple3}
            tickStroke={this.purple3}
            tickLabelProps={(value, index) => ({
                fill: this.purple3,
                fontSize: 11,
                textAnchor: "middle"
            })}
            />
            </Group>
        </svg>
        <div
          style={{
              position: "absolute",
              top: this.margin.top / 2 - 10,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            fontSize: "14px"
          }}
        >
          <LegendOrdinal
            scale={this.color}
            direction="row"
            labelMargin="0 15px 0 0"
          />
        </div>
        {/* {this.tooltipOpen && (
          <Tooltip
            top={this.tooltipTop}
            left={this.tooltipLeft}
            style={{
              minWidth: 60,
              backgroundColor: "rgba(0,0,0,0.9)",
              color: "white"
            }}
          >
            <div style={{ color: this.color(this.tooltipData.key) }}>
              <strong>{this.tooltipData.key}</strong>
            </div>
            <div>{this.tooltipData.bar.data[this.tooltipData.key]}℉</div>
            <div>
              <small>{this.formatDate(this.x(this.tooltipData.bar.data))}</small>
            </div>
          </Tooltip>
        )} */}
      </div>
      </div>
    );
  }
}
export default withTooltip(StackedBarChart)