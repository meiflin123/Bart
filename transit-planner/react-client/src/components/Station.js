import React from 'react';
import $ from 'jquery';
import axios from 'axios';


const Station = (props) => {

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
      
        <div className="station">
          
           <li onClick = {onClick} value = {props.station.station_id}> {props.station.name}</li> 
          
        </div>
   
    );

  }


export default Station;