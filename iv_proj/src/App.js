import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3-fetch";
import * as moment from "moment";
import Typography from "@material-ui/core/Typography";
import ReactCSSTransitionReplace from "react-css-transition-replace";
import AreaChart from "./components/AreaChart";
import MapStates from "./components/MapStates";
import MapLocations from "./components/MapLocations";
import StepSlider from "./components/MapSlider";
import StackedBarChart from "./components/StackedBarChart";
import BarChart from "./components/BarChart";
import BubbleChartRace from "./components/BubbleChart";
import BarChartMentalIllness from "./components/BarChartMentalIllness";
import BubbleChartWeapons from "./components/BubbleChartWeapons";
import bannerImage from "./data/banner.png";
// import "animate.css"
import AOS from "aos";
import "aos/dist/aos.css";
class App extends Component {
  constructor(props) {
    super(props);
    AOS.init({
      duration: 500
    });

    this.state = {
      data: [],
      map: {}
    };
  }
  componentDidMount() {
    this.getCSVData();
    // this.getUSMapData()
  }
  getMap(value, data) {
    const maps = {
      0: (
        <div key="map_states" className="map_shootings_by_state">
          <MapStates data={data} />
        </div>
      ),
      1: (
        <div key="map_locations" className="map_shootings_by_city">
          <MapLocations data={data} />
        </div>
      )
    };
    return maps[value];
  }

  changeMap(value) {
    this.setState({
      map: this.getMap(value, this.state.data)
    });
  }

  getCSVData() {
    const cleanDatum = datum => {
      datum.Year = moment(datum.Date)
        .utc()
        .year();
      for (let i of Object.keys(datum)) {
        if (typeof datum[i] === "string") {
          datum[i] = datum[i].trim().toLowerCase();
        }
        if (i === "Average Shooter Age") {
          datum[i] = parseInt(Math.round(parseFloat(datum[i]))) || 25;
        } else if (i === "History of Mental Illness - General") {
          const mentalIllnessHistoryTypes = ["yes", "no", "unknown"];
          if (!mentalIllnessHistoryTypes.includes(datum[i])) {
            datum[i] = "unknown";
          }
        } else if (i === "Number of shooters") {
          datum[i] = datum[i] === "" ? "unknown" : datum[i];
        }
        this.objectVals[i] = this.objectVals[i]
          ? this.objectVals[i].add(datum[i])
          : new Set([datum[i]]);
      }
      return datum;
    };
    d3.csv(
      "https://nyu-vis-fall2018.github.io/storytelling-group-15/iv_proj/src/data/Stanford_MSA_cleaned.csv"
    ).then(csvData => {
      this.objectVals = {};
      const data = csvData.map(datum => {
        return cleanDatum(datum);
      });
      this.setState({
        data,
        map: this.getMap(0, data)
      });
    });
  }

  render() {
    return (
      <div className="root">
        <div className="container">
          <div className="containerText">
            <div className="bannerContainer">
              <img src={bannerImage} className="bannerDiv" />

              <div className="headerContainer">
                <h1 style={{ fontSize: "50px", textShadow: "2px 4px white" }}>
                  The Mass Shooting Crisis in the US
                </h1>
                <h4>
                  Why has the number of mass shootings gone up in the United
                  States in recent years, and how close are we to solving the
                  problem?{" "}
                </h4>
              </div>
            </div>
          </div>
          <div className="quoteContainer">
            <div className="QuoteCss">
              “Firearms are involved in the deaths of more than 30,000 people in
              the US each year”
              <br />{" "}
              <span className="citeCss">
                -Bloomberg Issue Overview: Guns in America
              </span>
            </div>
            <div className="QuoteCss">
              “Guns kill on an average 36 people every day, and the nation
              doesn’t even blink!” <br />
              <span className="citeCss">-The Huffington Post</span>
            </div>
          </div>
          {this.state.data.length > 0 && (
            <div>
              <div className="caption">
                The United States is a world leader in many different respects -
                science, technology, arts. literature, politics, economics; it's
                a long list. But one sinister, shameful aspect that also sees
                the USA leaving the rest of the world far behind is that of gun
                violence, more specifically mass shootings by civilians. 
                <br/>
                It seems like gun violence has become a staple of everyday news
                reports, each incident more horrifying than the one before. Take
                the Las Vegas shooting of 2015, for instance, when 
              </div>
              <div className="LineChartContainer">
                <div data-aos="fade-right">
                  <AreaChart data={this.state.data} />
                </div>
                <div className="caption">
                  Was gun violence a problem that always plagued the United
                  States? Absolutely not! Up until about 2005, there were only
                  about 4 or 5 cases a year that came up in news reports.
                  However, there seems to have been an incredible spike in the
                  number of incidents since the year 2010. It's quite difficult
                  to determine the causes directly responsible for this, but it
                  seems quite likely that the upward trend will continue.
                </div>
              </div>

              <div className="MapContainer">
                {/* <hr /> */}
                <div data-aos="zoom-in">
                  <StepSlider
                    classes={{ root: "root" }}
                    changeMap={this.changeMap.bind(this)}
                  />
                  <ReactCSSTransitionReplace
                    transitionName="cross-fade"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                  >
                    {this.state.map}
                  </ReactCSSTransitionReplace>
                </div>
                <div className="caption">
                  Looking at the number of mass shootings across states in the
                  United States, it is easy to see that
                </div>
              </div>
              <div className="StackBarChart">
                <div className="caption">
                  Text Text Text Text Text Text Text Text Text Text Text Text
                  Text Text Text Text Text Text Text Text Text Text Text Text{" "}
                </div>
                <div data-aos="fade-left">
                  <StackedBarChart data={this.state.data} />
                </div>
              </div>

              <div className="BarChart">
                {/* <hr /> */}
                <div data-aos="zoom-in">
                  <BarChart data={this.state.data} />
                </div>
              </div>

              <div className="BubbleChart">
                <div data-aos="fade-right">
                  <BubbleChartRace data={this.state.data} />
                </div>
                <div className="caption">
                  Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text 
                </div>
              </div>

              <div className="BubbleWeaponChart">
                <div className="caption">
                  Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text 
                </div>
                <div data-aos="fade-left">
                  <BubbleChartWeapons data={this.state.data} />
                </div>
              </div>
              
              <div className="MentalIllness">
                <div data-aos="fade-right">
                  <BarChartMentalIllness data={this.state.data} />
                </div>
                <div className="caption">
                  Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text Text 
                </div>
              </div>
            </div>
          )}
        </div>

        {/* <div className="visualizations">
            <div className="year_to_shootings_count_area">
              <AreaChart data={this.state.data} />
            </div>
            <h3>Number of Shootings Across the Country</h3>
            <StepSlider classes={{  root: "root" }} changeMap={this.changeMap.bind(this)}/>
              {this.state.map}
            
            <BarChart data={this.state.data} />
            <BubbleChartRace data={this.state.data} />
            <BarChartMentalIllness data={this.state.data} />
            <BubbleChartWeapons data = {this.state.data} /> */}
      </div>
    );
  }
}

export default App;
