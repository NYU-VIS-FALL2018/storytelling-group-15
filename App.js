import React, { Component } from 'react';
import './App.css';
import Map from './Map.js';
// import * as d3 from 'd3';
// import * as topology from './WorldMapJson/world_countries.json';

class App extends Component {
  Mapdata = [
    // { lat: 23.4582348, lon: 37.5062675, value: 30, country: 'South Africa' },
    // { lat: 33.4577141, lon: 47.5066109, value: 20, country: 'Nimbia' },
    // { lat: 43.4572601, lon: 37.5070038, value: 3, country: 'Iraq' },
    // { lat: 53.4566746, lon: 27.507301, value: 4, country: 'United states of Republic' },
    // { lat: -23.455698, lon: 7.5076256, value: 4, country: 'Algeria' },
    // { lat: -3.4549737, lon: 37.5079214, value: 4, country: 'Iran' },
    // { lat: 23.4545445, lon: 37.3080235, value: 4, country: 'Africa' },
    // { lat: 18.4538579, lon: -37.5078873, value: 4, country: 'Saudi Arabia' },
    // { lat: -123.4531713, lon: 7.5077852, value: 4, country: 'Morocco' },
    // { lat: 23.4521842, lon: -27.5078533, value: 4, country: 'Syria' },
    // { lat: 23.4513688, lon: 37.5079895, value: 4, country: 'Guinea' }
  ]


  render() {
    return (
      <div className="App">
        <div>
          <Map data ={this.Mapdata} width={900} height={500}/>
        </div>
      </div>
    );
  }
}

export default App;
