import React from 'react';

const DirectionStep = ({ circles, stops, lineNames, toward }) => {

  return (

    <div className="directions-step">
      <div className="directions-line-header">

        { circles.map(( circle, index ) => (<div key= { index } className="line-circle" style={{ backgroundColor: circle }}></div>))}

        <p className="line-name">{ lineNames} Line</p>
        <p className="line-direction">towards { toward }</p>
      </div>
        <ul>
          { stops.map((stop) => (<li key={stop.id}>{stop.name}</li>))}
        </ul>
      </div>

  )
  
};

export default DirectionStep;