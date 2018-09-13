import React from 'react';
import $ from 'jquery';


const Stops = (props) => {

    return (
      
       
        <div className="lines-stop-list">
          <ul>
           {props.stopsList.stops.map((stop) => <li key={stop.id}>{stop.name}</li>)}
          </ul>
        </div>
   
    );

  }


export default Stops;