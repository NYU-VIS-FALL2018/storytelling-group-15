import React, { Component } from 'react';
import './App.css';
import Map from './Map.js';
import BarChart from './BarChart.js';
// import StackedBar from'./StackedBar.js'
// import * as d3 from 'd3';
// import * as topology from './WorldMapJson/world_countries.json';

class App extends Component {

  constructor(props) {
    super(props);
  }


  Mapdata = [
    { lat: 23.4582348, lon: 37.5062675, value: 30, country: 'South Africa' },
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
  { name: 'Riffel', value:206  },
  { name: 'ShotGun', value:82 },
  { name: 'Semi-automatic', value: 12 },
  { name: '9 mm Gun', value: 6 },
  ];

  render() {
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
              
              <BarChart data={this.BarChartdata} width={900} height={500} />
              <div>Here, we clearly see that the states with less strict laws have more number of shootings and vice versa</div>
            </div>

            {/* <Map data={this.Mapdata} width={900} height={500} /> */}
            {/* <BarChart data={this.BarChartdata} width={900} height={500} /> */}
            {/* <StackedBar /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
