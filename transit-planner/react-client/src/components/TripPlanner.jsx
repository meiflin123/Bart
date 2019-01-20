import React from 'react';
import $ from 'jquery';
import axios from 'axios';
import Transfer from './Transfer.jsx';
import Lines from './Lines.jsx';


class TripPlanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stationList: [],
      startingStation: 'Starting point',
      startingStationId: null,
      endingStation: 'destination',
      endingStationId: null,
      linesWithStartingStation: null,
      linesWithEndingStation: null,
      lineCombinations: [],
      stops: [],
      toward: [],
      circleColors: [],
      lineList: [],
      lineName: ''

    }

    this.getStationList = this.getStationList.bind(this);
    this.selectStart = this.selectStart.bind(this);
    this.selectEnd = this.selectEnd.bind(this);
    this.getDirection = this.getDirection.bind(this);
    this.transfer = this.transfer.bind(this);
    this.getLineColor= this.getLineColor.bind(this);

   
  }

// write a function to display all stations 
  getStationList() {
     axios.get('/api/stations/')

      .then((response) => {
        const stations = response.data
        // display stations that are marked favorite in the db first
        const options = [{'id': 0, 'name': 'select station'}].concat(stations.sort((a, b) => b.is_favorite - a.is_favorite));
        this.setState({stationList: options})
        
        console.log('stations list ', this.state.stationList)
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
    this.setState({circleColors: []})
    this.setState({lineList: []})
    console.log('starting station is ' + this.state.startingStation + ' station_id is ' + this.state.startingStationId);
    console.log('ending station is ' + this.state.endingStation + ' station_id is ' + this.state.endingStationId)

    //fetch lines that have the starting station
    axios.get('/api/station/' + this.state.startingStationId)
      .then((response) => {
        console.log('possible lines with starting_id:' + JSON.stringify(response.data))
        const lines1 = response.data;
        this.setState({linesWithStartingStation: lines1})
      })
      .catch((error)=>{
        console.log(error);
       })

    // fetch lines that have the ending station
    axios.get('/api/station/' + this.state.endingStationId)
      .then((response) => {
        console.log('possible lines with ending_id:' + JSON.stringify(response.data))
        const lines2 = response.data;
        let shareLine = null;
        let lineCombinations = [];
        let transfer = true;
        this.setState({linesWithEndingStation: lines2}, () => {

        //compare two lines, if there's common line id, fetch and display stops along this line, done.
        //if no common line is found, get transfer train.
          for (let i = 0; i < this.state.linesWithStartingStation.length; i++) {
            for (let j = 0; j < this.state.linesWithEndingStation.length; j++) {

              lineCombinations.push([this.state.linesWithStartingStation[i].line_id, this.state.linesWithEndingStation[j].line_id])

              if (this.state.linesWithStartingStation[i].line_id === this.state.linesWithEndingStation[j].line_id) {
                transfer = false;
                //this.getLineColor(this.state.linesWithStartingStation[i].line_id)
                this.getStops(this.state.linesWithStartingStation[i].line_id)          
              }
            }
          }
        })


        this.setState({lineCombinations : lineCombinations})
        console.log('lineCombinations is ', this.state.lineCombinations)
        if (transfer === true) {
          this.state.lineCombinations.map(x => this.transfer(x))
        }
      })


      .catch((error) => {
        console.log(error);
      })
  }

  getLineColor(lineid){
    //display available options of routes between two stations user selected. 
    let lines = {
      '1 and 2' :['Red', '#e11a57'], 
      '3 and 4' :['Yellow', '#fdf057'],
      '5 and 6' :['Blue', '#2aabe2'],
      '7 and 8' :['Green', '#4fb848']
    };
    for (var x in lines) {
      if (x.includes(lineid)) {
        this.state.circleColors.push(lines[x][1]);
        this.state.lineList.push(lines[x][0]);
        let circleColors = this.state.circleColors;
        let lineName = this.state.lineList.join(', ')
        this.setState({circleColors: circleColors, lineName: lineName})

      }
    }
  }
  
  getStops(lineid, transferid) {
    this.setState({toward: []})
    console.log('reached getStops, line id is: ' + lineid);
    console.log('starting station id is ' + this.state.startingStationId + ' ending station id is ' + this.state.endingStationId )

    // get all the stops along a line
    axios.get('/api/lines/' + lineid)
      .then((response) => {

        let startingStopIndex = null;  
        let endingStopIndex= null;
        let stops = null
        console.log('stops fetched from first line ',lineid, ' is ', response.data )

        for (let i = 0; i < response.data.length; i++) {
          // if a station id of a line matches the starting station id, set index. 
          if (response.data[i].station_id === this.state.startingStationId) {
            startingStopIndex = i;
            console.log('found start' + JSON.stringify(response.data[i]))
          }
          // if the last station of a line matches the ending station id, set index. 

          if (response.data[response.data.length -1].station_id === this.state.endingStationId && response.data[i].station_id === transferid) {
            endingStopIndex = i;
            console.log('ending station id is ', this.state.endingStationId, response.data[i])

          }

          if (response.data[i].station_id === this.state.endingStationId) {
            endingStopIndex = i;
            console.log('found end' + JSON.stringify(response.data[i]))
          }}
            // if starting stop index exists AND the correct direction of the route, 
              // set towards and display stops
              // display available line names

          if(startingStopIndex!== null && startingStopIndex < endingStopIndex) {
            console.log('start and end, right direction', lineid)
            let destination = response.data[response.data.length -1].name

            if (!this.state.toward.includes(destination)) {
              this.state.toward.push(destination)
            }
            console.log('toward ', this.state.toward, lineid)
            
            stops = response.data.slice(startingStopIndex, endingStopIndex + 1);
            this.setState({stops: stops})
            this.getLineColor(lineid)
            
            console.log('state of the stops is ', this.state.stops);

            return;

          }

      })


      .catch((error)=>{
         console.log(error);
      })

  }


  transfer(lines) {
    let line1 = lines[0];
    let line2 = lines[1];
    let transferStations1 = [];
    let transferStations2 = [];
    let transferid = 'station_id'
    let index = null;
    console.log(line1, line2)
    
    // fetch transfer stations from line1
    axios.get('/api/transfer/' + line1)
      .then((response) => {
        transferStations1 = response.data;
        console.log('transferStations on line ',line1,' are ', JSON.stringify(transferStations1))
      })
      .catch((error)=>{
         console.log(error);
       })

    //fetch transfer stations from line2
    axios.get('/api/transfer/' + line2)
      .then((response) => {
        const transferStations2 = response.data;
        console.log('transferStations on line ', line2, ' are ', JSON.stringify(transferStations2))

        // if line1 and line2 share same transfer station, 
          // find stops starting from line1.
        for (let i = 0; i < transferStations1.length; i++) {
          for (let j = 0; j < transferStations2.length; j++) {

            if (transferStations1[i].station_id === transferStations2[j].station_id) {
              transferid = transferStations1[i].station_id;
              console.log('shared transferstation id is', transferid, 'line1 is ', line1)
              
              this.getStops(line1, transferid)
            }

          }
        }
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
          
        <div className="directions-step">
          <div className="directions-line-header">
            {this.state.circleColors.map((circle, index) => (<div key= {index} className="line-circle" style={{backgroundColor: circle}}></div>))}
            <p className="line-name">{this.state.lineName} Line</p>
            <p className="line-direction">towards {this.state.toward}</p>
          </div>
            <ul>
              {this.state.stops.map((stop) => (<li key={stop.id}>{stop.name}</li>))}
            </ul>
        </div>    
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