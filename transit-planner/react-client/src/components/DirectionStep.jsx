import React from 'react';
import $ from 'jquery';
import axios from 'axios';

class DirectionStep extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props)

  }


  render() {
    return (

          <div className="directions-step">
            <div className="directions-line-header">
              <p className="line-name">Change Trains</p>
            </div>
         

          <div className="directions-step">
            <div className="directions-line-header">
              <div className="line-circle" style={{backgroundColor: "#0099cc"}}></div>
              <p className="line-name">Blue Line</p>
              <p className="line-direction">towards Station F</p>
            </div>
            <ul>
             {this.props.stopsOnXferTrain.map((stop) => (<li key={stop.id}>{stop.name}</li>))}
            </ul>
          </div>
           </div>
          )

  }
}

export default DirectionStep;