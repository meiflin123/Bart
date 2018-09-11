import React from 'react';
import $ from 'jquery';


const Lines = (props) => {
  return (
    <div className="lines-view">
      <div className="selections">
        Choose a line:
       
        <select>{props.sampleLines.map((line) => <option key= {props.sampleLines.indexOf(line)}>{line}</option> )}
          
        </select>

      </div>
      <div className="lines-stop-list">
        <ul>
         {props.sampleStopList.stops.map((stop) => <li key={stop.id}>{stop.name}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default Lines;