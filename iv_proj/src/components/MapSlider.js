import React from 'react';

class StepSlider extends React.Component {
  state = {
    value: 0,
  };

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
        State
      </label>
      <label>
        <input type="radio" value={1} 
                      checked={this.state.value === 1} 
                      onChange={this.handleChange} />
        Location
      </label>
      </div>
    );
  }
}

export default StepSlider
