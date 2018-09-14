import React from 'react';
import $ from 'jquery';
import axios from 'axios';


const Stops = (props) => {


	const onClick = (event) => {

	  console.log('stationId is ', event.target.value)
	  const stationId = event.target.value
	  axios.post('/api/toggleFavStation/' + stationId)
  
      .then((response) => {
      	console.log('stop component toggle station: ', response.data);

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


export default Stops;