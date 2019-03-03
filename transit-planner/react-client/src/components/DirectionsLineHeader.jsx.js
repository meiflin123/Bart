 import React from 'react';

 const DirectionsLineHeader = ({ message }) => {
   return (
     <div className="directions-step">
        <div className="directions-line-header">
          <p className="line-name">{ message }</p>
        </div>
     </div>
          
   );

 }


export default DirectionsLineHeader;