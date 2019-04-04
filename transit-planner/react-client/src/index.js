import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import Lines from './components/Lines.jsx';
import TripPlanner from './components/TripPlanner.jsx';
import data from './sample_data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'lines'
    }
  }

  changeView(view) {
    this.setState({
      view: view
    });
  }

  render() {
    return (
      <div>
        <div className="panel">
          <h1>Transit Planner</h1>
          <nav className="nav">
            <span 
              className={this.state.view === 'lines' 
                ? 'nav-item selected'
                : 'nav-item unselected'}
              onClick={() => this.changeView('lines')}
            >
              Lines
            </span>
            <span 
              className={this.state.view === 'planner' 
                ? 'nav-item selected'
                : 'nav-item unselected'}
              onClick={() => this.changeView('planner')}
            >
              Trip Planner
            </span>
          </nav>
          <div className="main-view">
            {this.state.view === 'lines' 
              ? <Lines sampleLines = {this.props.sampleLines} sampleStopList = {this.props.sampleStopList}/>
              : <TripPlanner />
            }
          </div>
        </div>
        <div className="map-panel">
          <img src="/images/bart-system-map.png"/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App sampleLines = {data.sampleLines} sampleStopList = {data.sampleStopList}/>, document.getElementById('app'));

