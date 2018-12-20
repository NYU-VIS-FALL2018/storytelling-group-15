import React from 'react';

class StepSlider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value : parseInt(this.props.value) || 0
    }
  }
  

  handleChange = (event) => {

    this.setState({ value: parseInt(event.target.value) });
    this.props.changeMap(event.target.value)
  };

  render() {
    return (
      <div>
      <label>
        <input type="radio" value={0} 
                      checked={this.state.value === 0} 
                      onChange={this.handleChange} />
        By States
      </label>
      <label>
        <input type="radio" value={1} 
                      checked={this.state.value === 1} 
                      onChange={this.handleChange} />
        By Cities
      </label>
      </div>
    );
  }
}

export default StepSlider
