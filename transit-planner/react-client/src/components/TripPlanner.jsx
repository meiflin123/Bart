import React from 'react';


const TripPlanner = function() {
  return (
    <div className="trip-planner-view">
      <div className="selections">
        Start: 
        <select>
          <option>Hardcoded Station Name A</option>
          <option>Hardcoded Station Name B</option>
          <option>Hardcoded Station Name C</option>
          <option>Hardcoded Station Name D</option>
          <option>Hardcoded Station Name E</option>
          <option>Hardcoded Station Name F</option>
        </select>

        <br />

        End: 
        <select>
          <option>Hardcoded Station Name A</option>
          <option>Hardcoded Station Name B</option>
          <option>Hardcoded Station Name C</option>
          <option>Hardcoded Station Name D</option>
          <option>Hardcoded Station Name E</option>
          <option>Hardcoded Station Name F</option>
        </select>

        <br />

        <button>Go!</button>
      </div>

      <div className="directions">
        <div className="directions-summary">
          <p className="line-name">Station A to Station E</p>
          <p>31 minutes (arrive at 5:51pm)</p>
        </div>

        <div className="directions-step">
          <div className="directions-line-header">
            <p className="line-name">Start at Station A</p>
          </div>
        </div>

        <div className="directions-step">
          <div className="directions-line-header">
            <div className="line-circle" style={{backgroundColor: "#ed1d24"}}></div>
            <p className="line-name">Red Line</p>
            <p className="line-direction">towards Station C</p>
          </div>
          <ul>
            <li> Station A </li>
            <li> Station B </li>
            <li> Station C </li>
          </ul>
        </div>

        <div className="directions-step">
          <div className="directions-line-header">
            <p className="line-name">Change Trains</p>
          </div>
        </div>

        <div className="directions-step">
          <div className="directions-line-header">
            <div className="line-circle" style={{backgroundColor: "#0099cc"}}></div>
            <p className="line-name">Blue Line</p>
            <p className="line-direction">towards Station F</p>
          </div>
          <ul>
            <li> Station C </li>
            <li> Station D </li>
            <li> Station E </li>
          </ul>
        </div>

        <div className="directions-step">
          <div className="directions-line-header">
            <p className="line-name">Arrive at Station E</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripPlanner;