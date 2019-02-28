import React from 'react';
import axios from 'axios';
import StopsList from  './StopsList.jsx';

class Lines extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
      stops: []
    };
  };

 // get all existing lines from db
  getAllLines() {
    axios.get('/api/lines')
      .then(response => this.setState({ lines : response.data }))
      .catch(error => console.log(error))
  };

  selectLine(e) {
    this.getStops(e.target.value);
 };

  // get the list of stops along a line.
  getStops(lineId) {
    axios.get('/api/lines/' + lineId)
      .then(response => this.setState({ stops: response.data }))
      .catch(error => console.log(error))

  };

  componentDidMount (){
    this.getAllLines();
    this.getStops(1);
  };

  render () {
    return (
      <div className="lines-view">
        <div className="selections">
          Choose a line:
         <select onChange= { this.selectLine.bind(this) }>{ this.state.lines.map(line => <option value={line.id} key={line.id}>{ line.name }</option>)}       
         </select>
        </div>

        <div className="lines-stop-list">
          <StopsList stopsList={ this.state.stops }/>
        </div>
      </div>
    );
  }
}

export default Lines;