import React from 'react';

const DirectionStep = props => {
  
    console.log(props.stops)

 
    return (
          
           <div>
            <div className="directions-line-header">
            
             {props.circles.map((circle, index) => (<div key= {index} className="line-circle" style={{backgroundColor: circle}}></div>))}
          
            <p className="line-name">{props.lineNames} Line</p>
            <p className="line-direction">towards {props.toward}</p>
           </div>
            <ul>
              {props.stops.map((stop) => (<li key={stop.id}>{stop.name}</li>))}
            </ul>
            </div>

    )
  
};

export default DirectionStep;