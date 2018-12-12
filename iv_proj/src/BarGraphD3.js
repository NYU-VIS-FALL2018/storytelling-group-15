import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
// import s from './BarGraphD3.css';
import ReactD3, {LineChart, AreaChart,BarChart} from 'react-d3-components';

class BarGraphD3 extends Component {

  constructor(props) {
    super(props);
    console.log(props)
    // this.dataForLineGraph = [
    //   {
    //     label: 'somethingA',
    //     values: this.props.lineData
    //     // [{ x: 0, y: 2 }, { x: 1.3, y: 5 }, { x: 3, y: 6 }, { x: 3.5, y: 6.5 }, { x: 4, y: 6 }, { x: 4.5, y: 6 }, { x: 5, y: 7 }, { x: 5.5, y: 8 }]
    //   },
  
    // ];
    
    this.state ={
      dataForBarGraph:[],
    }
   

  }

  componentDidMount(){
    this.setState({
      dataForBarGraph: [{ label: 'GunsToIncident',
        values: this.props.barData
      }]
    })
  }

  // state ={
  //   dataForLineGraph :[
  //    { label: 'ShootingData',
  //     values: this.props.lineData
  //   }
  //   ]
  // }
  
  

  render() {
    if(this.state.dataForBarGraph.length > 0){
      console.log("RENDERING BarGraph", this.state.dataForBarGraph)
      return (
        <div>
          
              <BarChart
                  data={this.state.dataForBarGraph}
                  width={900}
                  height={400}
                  xAxis={{innerTickSize: 2, tickArguments: [20],tickPadding:1,tickDirection:"diagonal", label: "x-label"}}
                  yAxis={{label: "y-label"}}
                  // tooltipHtml={() => this.tooltipBar()}
                  margin={{ top: 10, bottom: 50, left: 50, right: 10 }} />
  
          

           
        </div>
      );

    }
    return <div></div>
  }
}

BarGraphD3.defaultProps = {
  
}

BarGraphD3.propTypes = {
 
}

export default BarGraphD3;
