import React from 'react';
import $ from 'jquery';
import axios from 'axios';
import Transfer from './Transfer.jsx';


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
      lineCombinations: [],
      stops: [],
      toward: null

    }

    this.getStationList = this.getStationList.bind(this);
    this.selectStart = this.selectStart.bind(this);
    this.selectEnd = this.selectEnd.bind(this);
    this.getDirection = this.getDirection.bind(this);
    this.transfer = this.transfer.bind(this);
    this.getRoute = this.getRoute.bind(this);

  }

// write a function to display all stations 
  getStationList() {
     axios.get('/api/stations/')

      .then((response) => {
        const stations = response.data
        // display stations that are marked favorite in the db first
        const options = [{'id': 0, 'name': 'select station'}].concat(stations.sort((a, b) => b.is_favorite - a.is_favorite));
        this.setState({stationList: options})
        
        console.log('the state is ', this.state.stationList)
      })
      .catch((error)=>{
         console.log(error);
       })
  }

  selectStart(event) {
    this.setState({startingStation: JSON.parse(event.target.value).station, startingStationId: JSON.parse(event.target.value).id})
  }

  selectEnd(event) {
    this.setState({endingStation: JSON.parse(event.target.value).station, endingStationId:JSON.parse(event.target.value).id})

  }

  getDirection() {
    console.log('starting station is ' + this.state.startingStation + ' station_id is ' + this.state.startingStationId);
    console.log('ending station is ' + this.state.endingStation + ' station_id is ' + this.state.endingStationId)

    //fetch lines that contain the starting station
    axios.get('/api/station/' + this.state.startingStationId)
      .then((response) => {
        console.log('lines for starting_id:' + response.data)
        const lines1 = response.data;
        this.setState({linesOfStartStation: lines1})
      })
      .catch((error)=>{
        console.log(error);
       })

    // fetch lines that contain the ending station
    axios.get('/api/station/' + this.state.endingStationId)
      .then((response) => {
        console.log('lines for ending_id:' + response.data)
        const lines2 = response.data;
        var shareLine = null;
        var lineCombinations = [];
        this.setState({linesOfEndingStation: lines2}, () => {

          for (var i = 0; i < this.state.linesOfStartStation.length; i++) {
            for (var j = 0; j < this.state.linesOfEndingStation.length; j++) {
              lineCombinations.push([this.state.linesOfStartStation[i].line_id, this.state.linesOfEndingStation[j].line_id])
              // if lines1 and lines2 have share same line
              if (this.state.linesOfStartStation[i].line_id === this.state.linesOfEndingStation[j].line_id) {
                // get line id where the direaction is correct
                this.getRoute(this.state.linesOfStartStation[i].line_id)
              }
            }
          }
        })

        this.setState({lineCombinations : lineCombinations})
        console.log('lineCombinations is ', this.state.lineCombinations)
      }, () => {
        // if no share line, compare all lines combinations and find common transfer stations
        if(this.state.stops.length === 0) {
          this.state.lineCombinations.map(x => this.transfer(x))
        }
      })


      .catch((error) => {
        console.log(error);
      })
  }


  getRoute(lineid) {
    console.log('line selected is: ' + lineid);

    axios.get('/api/lines/' + lineid)
      .then((response) => {
        console.log('getRoute ' + response)
        const stops = response.data.map(x => x.name)
        console.log('all stops along this line:', stops);

        // if the starting station is put before the ending station in this stops array, right direction is found.
        if(stops.indexOf(this.state.startingStation) < stops.indexOf(this.state.endingStation)) {
          return this.getStops(lineid)
        }
        
    
        })

      .catch((error)=>{
         console.log(error);
        })

  }


  
  getStops(lineid, transferid) {
    console.log('no transfer, line id is: ' + lineid);

    // get all the stops along this line
    axios.get('/api/lines/' + lineid)
      .then((response) => {

        var startingStopIndex = null;
        var endingStopIndex= null;
        var stops = null
        console.log('stops fetched from this line are ', response.data )

      
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].station_id === this.state.startingStationId) {
            startingStopIndex = i 
            console.log(this.state.startingStationId, response.data[i])
          }
          if (response.data[i].station_id === this.state.endingStationId || response.data[i].station_id === transferid) {
            endingStopIndex = i 
            console.log(this.state.endingStationId, response.data[i])
          }

        }
        
          stops = response.data.slice(startingStopIndex, endingStopIndex + 1)
          this.setState({stops: stops})
          this.setState({toward: response.data[response.data.length - 1].name})
          console.log('state of the stops is ', this.state.stops)})


      .catch((error)=>{
         console.log(error);
        })

  }

  transfer(lines) {
    var lineId1 = lines[0];
    var lineId2 = lines[1];
    var transferStations1 = [];
    var transferStations2 = [];
    var transferid = 'station_id'
    var index = null;
    console.log(lineId1, lineId2)
    
    // get transfer stations on lineId1
    axios.get('/api/transfer/' + lineId1)
      .then((response) => {
        transferStations1 = response.data;
        console.log('transferStations on line1' + transferStations1)
      })
      .catch((error)=>{
         console.log(error);
       })

    axios.get('/api/transfer/' + lineId2)
      .then((response) => {
        const transferStations2 = response.data;
        console.log('transferStations on line2' + transferStations2)
        for (var i = 0; i < transferStations1.length; i++) {
          for (var j = 0; j < transferStations2.length; j++) {
            if (transferStations1[i].station_id === transferStations2[j].station_id) {
              transferid = transferStations1[i].station_id;
              console.log('transferPoint is', transferid)
              this.getStops(lineId1, transferid)
              // get the index of the transferid.
            }
          }
        }
      })
      .catch((error)=>{
         console.log(error);
       })

    
  }

  /*getRoute(lineid, transfer_station) {
    console.log('line selected is: ' + lineid);

    axios.get('/api/lines/' + lineid)
      .then((response) => {
        const stops = response.data
        var index = null;
        for (var i = 0; i < stops.length; i++) {
          if (stops[i].station_id === transfer_station) {
            index = i;
            this.setState({stops: stops})
          }
        }
        
        console.log('all stops along this line:', this.state.stops)
          })

      .catch((error)=>{
         console.log(error);
        })

  }*/

  componentDidMount() {
    this.getStationList();

    
  }




  render() {
    return (
      <div className="trip-planner-view">
        <div className="selections">
          Start: 

          <select onChange= {this.selectStart}>{this.state.stationList.map((station, index) => <option value={JSON.stringify({'station': station.name, 'id': station.id})} key={index}>{station.name}</option>)}
          </select>

          <br />

          End: 
          <select onChange= {this.selectEnd}>{this.state.stationList.map((station, index) => <option value={JSON.stringify({'station': station.name, 'id': station.id})}key={index}>{station.name}</option>)}
          </select>

          <br />

          <button onClick ={this.getDirection}>Go!</button>
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
           <div className="transfer">
         {/* {<Transfer />}*/}
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