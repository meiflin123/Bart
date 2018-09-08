import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import Lines from './components/Lines.jsx';
import TripPlanner from './components/TripPlanner.jsx';

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
              ? <Lines />
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

ReactDOM.render(<App />, document.getElementById('app'));

