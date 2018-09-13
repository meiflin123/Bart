import React from 'react';
import $ from 'jquery';


const Stops = (props) => {


	const onClick = (event) => {

	  console.log('stationID is ', event.target.value)
	  const stationID = event.target.value
	}
    return (
      
        <div className="lines-stop-list">
          <ul>
           {props.stopsList.map((stop) => <li onClick = {onClick} value = {stop.station_id} key={stop.id}>{stop.name}</li>)}
          </ul>
        </div>
   
    );

  }


export default Stops;