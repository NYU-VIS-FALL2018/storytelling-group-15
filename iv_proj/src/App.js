import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as moment from 'moment';
import Map from './Map.js';
import * as d3 from 'd3';
import BarChartD3 from './BarChart.js';
import dataFromCsv from './Stanford_MSA_Database.csv'
import RawData2 from './Stanford_MSA_cleaned.csv'

import LineGraphD3 from './LineGraph.js'
import BarGraphD3 from './BarGraphD3.js'

import ReactD3, { LineChart, ScatterPlot, AreaChart, BarChart, Brush ,PieChart} from 'react-d3-components';



class App extends Component {

  constructor(props) {
    super(props);
    this.state={
      stateData : {}
    }
  }

componentDidMount(){
   d3.csv(RawData2).then((data)=>{
   this.dataPreProcessing(data)
  }).catch(function(err) {
    throw err;
})
}



  dataForPieChart = {
    label: 'somethingA',
    values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
};

 sort = d3.ascending //, d3.descending, func(a,b) { return a - b; }, etc...


  

  Mapdata = [
    { lat: 23.4582348, lon: 37.5062675, value: 30, country: 'South Africa' },
    { lat: 34.17622092, lon: -118.5399542, value: 30, country: 'California' },
    { lat: 33.4577141, lon: 47.5066109, value: 20, country: 'Nimbia' },
    { lat: 43.4572601, lon: 37.5070038, value: 3, country: 'Iraq' },
    { lat: 53.4566746, lon: 27.507301, value: 4, country: 'United states of Republic' },
    { lat: -23.455698, lon: 7.5076256, value: 4, country: 'Algeria' },
    { lat: -3.4549737, lon: 37.5079214, value: 4, country: 'Iran' },
    { lat: 23.4545445, lon: 37.3080235, value: 4, country: 'Africa' },
    { lat: 18.4538579, lon: -37.5078873, value: 4, country: 'Saudi Arabia' },
    { lat: -123.4531713, lon: 7.5077852, value: 4, country: 'Morocco' },
    { lat: 23.4521842, lon: -27.5078533, value: 4, country: 'Syria' },
    { lat: 23.4513688, lon: 37.5079895, value: 4, country: 'Guinea' }
  ];

  BarChartdata = [{ name: 'HandGuns', value: 950 },
  { name: 'MultipleGuns', value: 825 },
  { name: 'Riffel', value: 206 },
  { name: 'ShotGun', value: 82 },
  { name: 'Semi-automatic', value: 12 },
  { name: '9 mm Gun', value: 6 },
  ];

  dataForStackedBarChart = [
    {
    label: '1',
    values: [{x: 'PARESH', y: 10}, {x: 'PRAFUL', y: 10}]
    },
    {
    label: '2',
    values: [{x: 'PARESH', y: 6}, {x: 'PRAFUL', y: 10}]
    },

];


  dataForLineGraph = [
    {
      label: 'somethingA',
      values:[{ x: 0, y: 2 }, { x: 1.3, y: 5 }, { x: 3, y: 6 }, { x: 3.5, y: 6.5 }, { x: 4, y: 6 }, { x: 4.5, y: 6 }, { x: 5, y: 7 }, { x: 5.5, y: 8 }]
    },

  ];

  dataForBarChart = [{
    label: 'Paresh',
    values: [{ x: 'SomethingA', y: 10 }, { x: 'SomethingB', y: 20}, { x: 'SomethingC', y: 3 }, { x: 'SomethingD', y: 12 }],
  }];



  // HandleOnChange = (event) => {
  //   this.setState({ xScale: d3.time.scale().domain([extent[0], extent[1]]).range([0, 400 - 70]) });
  // }
 
dataPreProcessing(rawData){
  // console.log('DataPreProcessing',rawData);
  let dataValuesForLineGraph = this.dataLineGraph(rawData);
  let dataValuesForBarGraph = this.dataBarGraph(rawData)
 this.setState({
   stateData: rawData,
  dataValuesForLineGraph,
  dataValuesForBarGraph
 })
  // console.log('*********',dataForLineGraph1)
}

dataBarGraph(dataForBarGraph){

  let gunToIncidentCount = dataForBarGraph.reduce((r,d)=>{
    // if(!d["Type of Gun - General"] || typeof(d["Type of Gun - General"]) == "string"){
    //   d["Type of Gun - General"] = 
    // }
    r[d["Type of Gun - General"]] = r[d["Type of Gun - General"]] ? r[d["Type of Gun - General"]] + parseInt(d["Total Number of Victims"])  : parseInt(d["Total Number of Victims"])
    return r;
  }, {})
  console.log("******",gunToIncidentCount)
  let name = Object.keys(gunToIncidentCount);
  let value =Object.values(gunToIncidentCount);
   const nameTovalue = name.map((nameVal, i) => { return {'x': nameVal, 'y': value[i]}} )
   console.log("nameTovalue*****",nameTovalue)
   return nameTovalue

}

dataLineGraph(dataForLineGraph){
  // console.log(dataForLineGraph)
  // let valuesList = [];
  // let valDict = {}; 
  // console.log(typeof(dataForLineGraph))
  let dateToShootingsCount = dataForLineGraph.reduce((r,d)=>{
    r[moment(d.Date).utc().year()] = r[moment(d.Date).utc().year()] ? r[moment(d.Date).utc().year()] + 1 : 1
    return r;
  }, {})
  //  console.log(dateToShootingsCount)
   let x = Object.keys(dateToShootingsCount);
   let y =Object.values(dateToShootingsCount);
    const xToY = x.map((xVal, i) => { return {'x': xVal, 'y': y[i]}} )
    // console.log("X TO Y MSAPP",xToY)
    return xToY
  
}

tooltipBar(x, y) {
  return "x: " + x + " y: " + y;
};

  render() {
    const rawData = this.state.stateData;

    if(Object.keys(this.state.stateData).length > 0){
      return (
        <div className="App">
          <div className="root">
            <div className="container">
              <div className="title">Analyzing Factors Behind Mass Shooting in The United States</div>
              <div className="quoteContainer">
                <div className="innerQuoteContainer">
                  <div className="quote1">“Guns kill on an average of 36 people every day, and the nation doesn’t even blink ” </div>
                  <div className="magzinName">-The Huffington Post (10.01.2015)</div>
                </div>
                <div className="innerQuoteContainer">
                  <div className="quote2">“Firearms are involved in the deaths of more than 30,000 people in the US each year”</div>
                  <div> -Bloomberg Issue Overview: Guns in America(10.02.2016)</div>
                </div>
              </div>
              <div className="mapContainer">
                <Map data={this.Mapdata} width={900} height={500} />
                <div>Diving into the details of the shootings, we found out that: a. Military grade and semi-automatic weapons like rifles, bayonets, machine guns are being held by non-military and non-police person</div>
              </div>
              <div>
  
                {/* <BarChartD3 data={this.BarChartdata} width={900} height={500} /> */}
                {/* <HeatMap data ={this.dataset} width={800} height={500} days ={this.numberofDays}/>    */}
  

              <LineGraphD3  lineData ={this.state.dataValuesForLineGraph}/>
              {console.log("Props for bar***",this.state.dataValuesForBarGraph)}
              <BarGraphD3 barData={this.state.dataValuesForBarGraph} />

                {/* <LineChart
                  data={this.dataForLineGraph}
                  width={800}
                  height={500}
                  xAxis={{label: "x-label"}}
                  yAxis={{label: "y-label"}}
                  margin={{ top: 10, bottom: 50, left: 50, right: 10 }} /> */}
                  
                  
  
                 {/* <BarChart
                  data={this.dataForBarChart}
                  width={900}
                  height={400}
                  tooltipHtml={() => this.tooltipBar()}
                  margin={{ top: 10, bottom: 50, left: 50, right: 10 }} /> */}
  {/*
                  <BarChart
                  data={this.dataForStackedBarChart}
                  width={400}
                  height={400}
                  margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
  
                  <BarChart
                  groupedBars
                  data={this.dataForStackedBarChart}
                  width={400}
                  height={400}
                  margin={{top: 10, bottom: 50, left: 50, right: 10}} />
  
                  <PieChart
                  data={this.dataForPieChart}
                  width={600}
                  height={400}
                  margin={{top: 10, bottom: 10, left: 100, right: 100}}
                  sort={this.sort}
                  />
   */}
  
  
                {/* <ScatterPlot
                  data={data}
                  width={400}
                  height={400}
                  margin={{ top: 10, bottom: 50, left: 50, right: 10 }}
                  tooltipHtml={tooltipScatter}
                  xAxis={{ label: "x-label" }}
                  yAxis={{ label: "y-label" }} /> */}
                <div>Here, we clearly see that the states with less strict laws have more number of shootings and vice versa</div>
              </div>
  
  
  
  
              {/* <Map data={this.Mapdata} width={900} height={500} /> */}
              {/* <BarChart data={this.BarChartdata} width={900} height={500} /> */}
              {/* <StackedBar /> */}
            </div>
          </div>
        </div>
      );
    } else {
      return <div></div>
    }
  }
}

export default App;
