import React from 'react';
import DirectionStep from './DirectionStep.jsx';
import DirectionsLineHeader from './DirectionsLineHeader.jsx'

const DirectionsSummary = ({ strtSta, endSta, stops, circles, lineNames, toward, trfLStops, trfCircles, trfLineNames, trfToward, isHidden }) => {
  return (
    <div className="directions">
      <div className="directions-summary">
        <p className="line-name">{ strtSta } to { endSta }</p>
        <p>31 minutes (arrive at 5:51pm)</p>
      </div>

      <DirectionsLineHeader message={`Start at ${ strtSta }`} />
      <DirectionStep stops={ stops } circles={ circles } lineNames={ lineNames } toward ={ toward } />

      {!isHidden &&
        <div className="change-train">
          <DirectionStep stops= { trfLStops } circles={ trfCircles } lineNames={ trfLineNames } toward={ trfToward } />
        </div>
      }
      <DirectionsLineHeader message={`End at ${ endSta }`} />
      
    </div>
  );

}

export default DirectionsSummary;

 