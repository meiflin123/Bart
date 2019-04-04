import React from 'react';
import Station from './station.jsx'

const StopsList = props => {

    return (
      
        <div className="lines-stop-list">
          <ul>

           {props.stopsList.map(stop => <Station station = {stop} key={stop.id}/>)}

          </ul>
        </div>
   
    );

  };


export default StopsList;