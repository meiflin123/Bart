import React from 'react';
import $ from 'jquery';
import axios from 'axios';


class TripPlanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stationList: [],
      startingStation: 'Starting point',
      startingStationId: null,
      endingStation: 'destination',
      endingStationId: null,
      linesOfStartStation: null,
      linesOfEndingStation: null,
      stops: [],
      toward: null

    }

    this.getStationList = this.getStationList.bind(this);
    this.selectStart = this.selectStart.bind(this);
    this.selectEnd = this.selectEnd.bind(this);
    this.getRoute = this.getRoute.bind(this);

  }

// write a function to display all stations 
  getStationList() {
     axios.get('/api/stations/')

      .then((response) => {
        var stations = response.data
        // display stations that are marked favorite in the db first
        this.setState({stationList: stations.sort((a, b) => b.is_favorite - a.is_favorite)})
        
        /*console.log('stations are', stations, 'the state is ', this.state.stationList)*/
      })
      .catch((error)=>{
         console.log(error);
       })
  }

  selectStart(event) {
    this.setState({startingStation: JSON.parse(event.target.value).station, startingStationId: JSON.parse(event.target.value).id})
    
    console.log(this.state.startingStation, this.state.startingId);

  }

  selectEnd(event) {
    this.setState({endingStation: JSON.parse(event.target.value).station, endingStationId:JSON.parse(event.target.value).id})

  }

  /*getRoute() {
    var startingIdLines = this.getLineId(this.state.startingStationId);
    var endingIdLines = this.getLineId(this.state.endingStationId);

    console.log(startingIdLines)*/
   /* for (var i = 0; i < startingIdLines.length; i++) {
      for (var j = 0; j < endingIdLines.length; j++) {
        if (startingIdLines[i].line_id === endingIdLines[j].length) {
          console.log(true)
        }
      }
    }*/
  /*}
*/
  getRoute() {
    axios.get('/api/station/' + this.state.startingStationId)
      .then((response) => {
        const lines1 = response.data;
        this.setState({linesOfStartStation: lines1})
      })
      .catch((error)=>{
        console.log(error);
       })

    axios.get('/api/station/' + this.state.endingStationId)
      .then((response) => {
        const lines2 = response.data;
        var commonLine = null;
        this.setState({linesOfEndingStation: lines2}, () => {

          for (var i = 0; i < this.state.linesOfStartStation.length; i++) {
            for (var j = 0; j < this.state.linesOfEndingStation.length; j++) {
              if (this.state.linesOfStartStation[i].line_id === this.state.linesOfEndingStation[j].line_id) {
                commonLine = this.state.linesOfStartStation[i].line_id
                console.log('lineid is', commonLine)
                this.getStops(commonLine)
                
              }
              
            }
          }
        })
      })
        .catch((error)=>{
           console.log(error);
         })

    console.log(this.state.linesOfStartStation, this.state.linesOfEndingStation)
  }

  getStops(lineid) {
    console.log('line selected is: ' + lineid);

    axios.get('/api/lines/' + lineid)
      .then((response) => {
        this.setState({toward: response.data[response.data.length-1].name})
        var startingStopId = null;
        var endingStopId= null;
        var stops = null
        console.log('response.data is', response.data )
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].station_id === this.state.startingStationId) {
            startingStopId = i 
            console.log(this.state.startingStationId, response.data[i])
          }
          if (response.data[i].station_id === this.state.endingStationId) {
            endingStopId = i 
            console.log(this.state.endingStationId, response.data[i])
          }
        }
        if (startingStopId > endingStopId) {
          stops = response.data.slice(endingStopId, startingStopId + 1).reverse();
        } else {
          stops = response.data.slice(startingStopId, endingStopId + 1)
        }

          console.log(startingStopId, endingStopId+1)
          this.setState({stops: stops})
          console.log('all stops along this line:', this.state.stops)
            })

      .catch((error)=>{
         console.log(error);
        })

  }

  componentDidMount() {
    this.getStationList();

    
  }




  render() {
    return (
      <div className="trip-planner-view">
        <div className="selections">
          Start: 

          <select onChange= {this.selectStart}>{this.state.stationList.map((station) => <option value={JSON.stringify({'station': station.name, 'id': station.id})} key={station.id}>{station.name}</option>)}
          </select>

          <br />

          End: 
          <select onChange= {this.selectEnd}>{this.state.stationList.map((station) => <option value={JSON.stringify({'station': station.name, 'id': station.id})}key={station.id}>{station.name}</option>)}
          </select>

          <br />

          <button onClick ={this.getRoute}>Go!</button>
        </div>

        <div className="directions">
          <div className="directions-summary">
            <p className="line-name">{this.state.startingStation} to {this.state.endingStation}</p>
            <p>31 minutes (arrive at 5:51pm)</p>
          </div>

          <div className="directions-step">
            <div className="directions-line-header">
              <p className="line-name">Start at {this.state.startingStation}</p>
            </div>
          </div>

          <div className="directions-step">
            <div className="directions-line-header">
              <div className="line-circle" style={{backgroundColor: "#ed1d24"}}></div>
              <p className="line-name">Red Line</p>
              <p className="line-direction">towards {this.state.toward}</p>
            </div>
            <ul>
              {this.state.stops.map((stop) => (<li key={stop.id}>{stop.name}</li>))}
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
              <p className="line-name">Arrive at {this.state.endingStation}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TripPlanner;