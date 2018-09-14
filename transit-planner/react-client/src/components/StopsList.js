import React from 'react';
import $ from 'jquery';
import axios from 'axios';
import Station from './station.js'


const StopsList = (props) => {


	const onClick = (event) => {

	  console.log('stationId is ', event.target.value)
	  const stationId = event.target.value
	  axios.post('/api/toggleFavStation/' + stationId)
  
      .then((response) => {
      	
        })
          
      .catch((error)=>{
         console.log(error);
        })
    }
    return (
      
        <div className="lines-stop-list">
          <ul>
           {props.stopsList.map((stop) => <li onClick = {onClick} value = {stop.station_id} key={stop.id}>{stop.name}</li>)}
          </ul>
        </div>
   
    );

  }


export default StopsList;