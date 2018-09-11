import React from 'react';
import $ from 'jquery';


const Lines = (props) => {
  return (
    <div className="lines-view">
      <div className="selections">
        Choose a line:
       
        <select>{props.sampleLines.map((line) => <option key= {props.sampleLines.indexOf(line)}>{line}</option> )}
          
        </select>

      </div>
      <div className="lines-stop-list">
        <ul>
          <li>Hardcoded Stop 1</li>
          <li>Hardcoded Stop 2</li>
          <li>Hardcoded Stop 3</li>
          <li>Hardcoded Stop 4</li>
          <li>Hardcoded Stop 5</li>
          <li>Hardcoded Stop 6</li>
          <li>Hardcoded Stop 7</li>
          <li>Hardcoded Stop 8</li>
          <li>Hardcoded Stop 9</li>
        </ul>
      </div>
    </div>
  );
}

export default Lines;