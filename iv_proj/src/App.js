import React, { Component } from 'react';
import './App.css';
import * as d3 from "d3-fetch";
import * as moment from 'moment'
import BarGraph from './components/BarGraph';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }
  
  componentDidMount(){
    this.getCSVData()
  }

  getCSVData() {
    d3.csv("http://localhost:8081/data/Stanford_MSA_cleaned.csv").then(csvData => {
      const data = csvData.map(datum => {
        datum.Year = moment(datum.Date).utc().year()
        return datum
      })
      this.setState({
        data: data
      })
    });
  }
  
  render() {
    return (
      <div className="App">
        { this.state.data.length > 0 && 
          <BarGraph data={this.state.data}/>
        }
      </div>
    );
  }
}

export default App;
