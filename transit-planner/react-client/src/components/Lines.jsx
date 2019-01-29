import React from 'react';
import $ from 'jquery';
import axios from 'axios';
import StopsList from  './StopsList.jsx';
import TripPlanner from './TripPlanner.jsx';


class Lines extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lines: [],
      stops: []
    };
    this.selectLine = this.selectLine.bind(this);
  };

  getAllLines() {
    axios.get('/api/lines')
      .then(
        (response) => {
        this.setState({lines : response.data});     
        
      })
      .catch((error) => {
        console.log(error);
      })
  };
  

  selectLine(e) {
    this.getStops(e.target.value);
 };

  getStops(lineid) {
    console.log('line selected is: ' + lineid);

    axios.get('/api/lines/' + lineid)
      .then(response => {
        const stops = response.data;
        this.setState({stops: stops})
        console.log('all stops along this line:', this.state.stops);
      })

      .catch(error => {
        console.log(error);
      });

  };

  componentDidMount (){
    this.getAllLines();
    this.getStops(1)

  }
  render () {
    return (
      <div className="lines-view">
        <div className="selections">
          Choose a line:
         
         <select onChange= { this.selectLine }>{ this.state.lines.map(line => <option value={line.id} key={line.id}>{ line.name }</option>)}
            
          </select>

        </div>
        <div className="lines-stop-list">
          {<StopsList stopsList={ this.state.stops }/>}
        </div>
      </div>
    );
  }
}

export default Lines;