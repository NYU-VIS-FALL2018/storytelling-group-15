import React, { Component } from 'react'
import './App.css'
import * as d3 from "d3-fetch"
import * as moment from 'moment'
import Typography from "@material-ui/core/Typography"
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import AreaChart from './components/AreaChart'
import MapStates from './components/MapStates'
import MapLocations from  './components/MapLocations'
import StepSlider from "./components/MapSlider"
import StackedBarChart from "./components/StackedBarChart"
import BarChart from "./components/BarChart"
import BubbleChartRace from "./components/BubbleChart"
import BarChartMentalIllness from "./components/BarChartMentalIllness"
import BubbleChartWeapons from "./components/BubbleChartWeapons"
class App extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      data: [],
      map: {}
    }
    
    
  }
  componentDidMount(){
    this.getCSVData()
    // this.getUSMapData()
  }
  getMap(value, data){
    const maps = {
      0: (<div key ="map_states" className="map_shootings_by_state">
      <MapStates data={data} />
    </div>),
      1: (<div key="map_locations" className="map_shootings_by_city">
        <MapLocations data={data} />
      </div>),
    }
    return maps[value];
  }

  changeMap(value) {
    this.setState({
      map: this.getMap(value, this.state.data)
    })
  }
  
  getCSVData() {
    const cleanDatum = (datum) => {
      datum.Year = moment(datum.Date).utc().year()
      for(let i of Object.keys(datum)){
        if(typeof(datum[i]) === 'string'){
          datum[i] = datum[i].trim().toLowerCase()
        } 
        if(i === "Average Shooter Age") {
          datum[i] = parseInt(Math.round(parseFloat(datum[i]))) || 25
        } else if(i === "History of Mental Illness - General") {
          const mentalIllnessHistoryTypes = ["yes", "no", "unknown"]
          if(!mentalIllnessHistoryTypes.includes(datum[i])) {
            datum[i] = "unknown"
          }
        } else if(i === "Number of shooters"){
          datum[i] = datum[i] === "" ? "unknown" : datum[i]
        }
        this.objectVals[i] = this.objectVals[i] ? this.objectVals[i].add(datum[i]) : new Set([datum[i]])
      }
      return datum
    }
    d3.csv("https://nyu-vis-fall2018.github.io/storytelling-group-15/iv_proj/src/data/Stanford_MSA_cleaned.csv").then(csvData => {
      this.objectVals = {}
      const data = csvData.map(datum => {
        return cleanDatum(datum)
      })
      this.setState({
        data,
        map: this.getMap(0, data)
      })
    })
  }
  
  render() {
    return (
      <div className="App">
        <div style={{height:'50%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          margin: '10.5em 0 auto 0',
          }}>
        <Typography variant="h2" color="textPrimary">The Mass Shooting Crisis in the US</Typography>
        </div>
        <Typography variant="subtitle" color="textSecondary" style={{fontSize: '14px', marginBottom: '2.5em'}}>Why has the number of mass shootings gone up in the United States in recent years, <br/> and can the problem even be resolved? </Typography>
        
        <hr width="50%" style={{opacity:"0.5", marginBottom: '11em'}}/>
        { this.state.data.length > 0 && 
          <div className="visualizations">
            <div className="year_to_shootings_count_area">
              {/* <strong>Number of Shootings Annually in the United States from 1966 to 2016</strong> */}
              <AreaChart data={this.state.data} />
            </div>
            <h3>Number of Shootings Across the Country</h3>
            <StepSlider classes={{  root: "root" }} changeMap={this.changeMap.bind(this)}/>
            <ReactCSSTransitionReplace
              transitionName="cross-fade"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}>
              {this.state.map}
            </ReactCSSTransitionReplace>
            <StackedBarChart data={this.state.data}/>
            <BarChart data={this.state.data} />
            <BubbleChartRace data={this.state.data} />
            <BarChartMentalIllness data={this.state.data} />
            <BubbleChartWeapons data = {this.state.data} />
          </div>
        }
      </div>
    );
  }
}

export default App;
