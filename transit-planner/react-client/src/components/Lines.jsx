import React from 'react';
import $ from 'jquery';
import axios from 'axios';
import Stops from  './Stops.js';


class Lines extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lines: [],
      stops: []
    }
    this.getAllLines = this.getAllLines.bind(this);
    this.selectLine = this.selectLine.bind(this);
    this.getStops = this.getStops.bind(this);
  }


  
  
  getAllLines() {
    axios.get('/api/lines')
      .then(
        (response) => {
        var lines = response.data
        this.setState({lines : lines});
        
        
      })
      .catch((error) => {
        console.log(error)
      })

  };
  

  selectLine (event) {
  //console.log(event.target.value);

    this.getStops(event.target.value)

 }

  getStops(lineid) {
    console.log('line selected is: ' + lineid);

    axios.get('/api/lines/' + lineid)
      .then((response) => {
        const stops = response.data
        this.setState({stops: stops})
        console.log('all stops along this line:', this.state.stops)
          })

      .catch((error)=>{
         console.log(error);
        })

  }
  componentDidMount (){
    this.getAllLines();
    this.getStops(1)
  }
  render () {
    return (
      <div className="lines-view">
        <div className="selections">
          Choose a line:
         
         <select onChange= {this.selectLine}>{this.state.lines.map((line) => (<option value={line.id} key={line.id}>{line.name}</option>))}
            
          </select>

        </div>
        <div className="lines-stop-list">
          {<Stops stopsList={this.state.stops}/>}
        </div>
      </div>
    );
  }
}

export default Lines;