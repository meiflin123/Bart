import React from 'react';
import $ from 'jquery';

const Lines = () => {
  return (
    <div className="lines-view">
      <div className="selections">
        Choose a line:
        <select>
          <option>Hardcoded Line A</option>
          <option>Hardcoded Line B</option>
          <option>Hardcoded Line C</option>
          <option>Hardcoded Line D</option>
          <option>Hardcoded Line E</option>
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