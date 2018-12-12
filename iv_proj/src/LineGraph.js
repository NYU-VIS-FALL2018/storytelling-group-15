import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
// import s from './LineGraph.css';
import ReactD3, {LineChart, AreaChart} from 'react-d3-components';

class LineGraph extends Component {

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
      dataForLineGraph :[]
    }
   

  }

  componentDidMount(){
    this.setState({
      dataForLineGraph: [{ label: 'ShootingData',
      values: this.props.lineData
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
    if(this.state.dataForLineGraph.length > 0){
      console.log("RENDERING LINEGRAPH", this.state.dataForLineGraph)
      return (
        <div>
          <LineChart
                    data={this.state.dataForLineGraph}
                    width={800}
                    height={500}
                    xAxis={{label: "x-label"}}
                    yAxis={{label: "y-label"}}
                    margin={{ top: 10, bottom: 50, left: 50, right: 10 }} />

          <AreaChart
                    data={this.state.dataForLineGraph}
                    width={1200}
                    height={500}
                    xAxis={{innerTickSize: 10, tickArguments: [20],tickPadding: 3,tickDirection:"diagonal", label: "x-label"}}
                    yAxis={{label: "y-label"}}
                    margin={{ top: 10, bottom: 50, left: 50, right: 10 }} />
          

           
        </div>
      );

    }
    return <div></div>
  }
}

LineGraph.defaultProps = {
  
}

LineGraph.propTypes = {
 
}

export default LineGraph;
