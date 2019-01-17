import React from 'react';
import $ from 'jquery';
import axios from 'axios';
import Transfer from './Transfer.jsx';
import Lines from './Lines.jsx'


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

        //compare two lines, if there's common line id, fetch and display stops along this line
        //if no common line is found, get transfer train.
          for (let i = 0; i < this.state.linesWithStartingStation.length; i++) {
            for (let j = 0; j < this.state.linesWithEndingStation.length; j++) {
              lineCombinations.push([this.state.linesWithStartingStation[i].line_id, this.state.linesWithEndingStation[j].line_id])

              if (this.state.linesWithStartingStation[i].line_id === this.state.linesWithEndingStation[j].line_id) {
                transfer = false;
                this.getLineColor(this.state.linesWithStartingStation[i].line_id)
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
    let linesColors = [null, 'Red', 'Red','Yellow', 'Yellow','Blue', 'Blue', 'Green','Green', 'Orange','Orange']
    let selectLine = linesColors[lineid]
    let lineName = ''
    let colorCircle = ''
    if (!this.state.lineList.includes(selectLine)) {
      this.state.lineList.push(selectLine)
    }
    lineName = this.state.lineList.join(', ')
    this.setState({lineName: lineName})

    console.log('lineid for color is ', lineid)

    axios.get('/api/lineColor/'+ lineid)
    .then((response) => {
      console.log(response.data[0].color)
      colorCircle = '#' + response.data[0].color
      console.log('colorCircle is ' + this.state.circleColors)
      if (!this.state.circleColors.includes(colorCircle)) {
        this.state.circleColors.push(colorCircle)
      }
    })
    .catch((error)=>{
       console.log(error);
     })
  }
  
  getStops(lineid, transferid) {
    console.log('reached getStops, line id is: ' + lineid);

    // get all the stops along this line
    axios.get('/api/lines/' + lineid)
      .then((response) => {

        let startingStopIndex = null;  
        let endingStopIndex= null;     //index of the ending stop || shared transfer stop on the line Array
        let stops = null
        console.log('stops fetched from first line ',lineid, ' is ', response.data )

        
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].station_id === this.state.startingStationId) {
            startingStopIndex = i 
            console.log('starting station id is ', this.state.startingStationId, response.data[i])
          }
          if (response.data[i].station_id === this.state.endingStationId || response.data[i].station_id === transferid) {
            endingStopIndex = i 
            console.log('ending station id is ', this.state.endingStationId, response.data[i])

            // if starting stop index exists AND the correct direction of the route, 
            // set towards and display stops
            if(startingStopIndex!== null && startingStopIndex < endingStopIndex) {
              /*let trainColor = this.props.getAllLines();*/
              console.log(this.props.getAllLines)
              let destination = response.data[response.data.length -1].name
              if (!this.state.toward.includes(destination)) {
                this.state.toward.push(destination)

              }
              console.log('toward ', this.state.toward)
              stops = response.data.slice(startingStopIndex, endingStopIndex + 1);
              this.setState({stops: stops});
              console.log('state of the stops is ', this.state.stops);
              return;

            }
          }
          
        }
          
      })


      .catch((error)=>{
         console.log(error);
      })

  }


  transfer(lines) {
    let lineId1 = lines[0];
    let lineId2 = lines[1];
    let transferStations1 = [];
    let transferStations2 = [];
    let transferid = 'station_id'
    let index = null;
    console.log(lineId1, lineId2)
    
    // fetch transfer stations list from first line
    axios.get('/api/transfer/' + lineId1)
      .then((response) => {
        transferStations1 = response.data;
        console.log('transferStations on lineid ',lineId1,' are ', JSON.stringify(transferStations1))
      })
      .catch((error)=>{
         console.log(error);
       })

    //fetch transfer stations list from second line
    axios.get('/api/transfer/' + lineId2)
      .then((response) => {
        const transferStations2 = response.data;
        console.log('transferStations on lineid ', lineId2, ' are ', JSON.stringify(transferStations2))

        // if first line and second line share same transfer station, display stops start from starting station to transfer station on line1.
        for (let i = 0; i < transferStations1.length; i++) {
          for (let j = 0; j < transferStations2.length; j++) {

            if (transferStations1[i].station_id === transferStations2[j].station_id) {
              transferid = transferStations1[i].station_id;
              console.log('shared transferstation id is', transferid, 'lineId1 is ', lineId1)
              this.getStops(lineId1, transferid)
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
            <div className="directions-line-header">
          
           {this.state.circleColors.map((circle) => (<div className="line-circle" style={{backgroundColor: circle}}></div>))}
              <p className="line-name">{this.state.lineName} Line</p>
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