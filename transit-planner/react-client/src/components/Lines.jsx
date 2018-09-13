import React from 'react';
import $ from 'jquery';
import axios from 'axios';
import Stops from  './Stops.js';


class Lines extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lines: []
    }
    this.getAllLines = this.getAllLines.bind(this);
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
  

  
  componentDidMount (){
    this.getAllLines()
  }
  render () {
    return (
      <div className="lines-view">
        <div className="selections">
          Choose a line:
         
         <select>{this.state.lines.map((line) => (<option value={line.id} key={line.id}>{line.name}</option>))}
            
          </select>

        </div>
        <div className="lines-stop-list">
          {<Stops stopsList={this.props.sampleStopList}/>}
        </div>
      </div>
    );
  }
}

export default Lines;