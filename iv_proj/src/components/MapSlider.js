import React from 'react';
import Slider from '@material-ui/lab/Slider';

class StepSlider extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
    this.props.changeMap(value)
  };

  render() {
    const { value } = this.state;    
    return (
      <div className="root">
        <p style={{fontSize:"0.6em"}}>Move Slider to to view the data by State or by Location</p>
        <Slider
          value={value}
          min={0}
          max={1}
          step={1}
          onChange={this.handleChange}
          style={{width: "50px", margin: "0 auto", marginTop: "20px"}}
        />
      </div>
    );
  }
}

export default StepSlider
