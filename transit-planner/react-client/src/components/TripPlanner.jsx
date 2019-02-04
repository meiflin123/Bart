import React from 'react';
import axios from 'axios';
import Transfer from './Transfer.jsx';
import Lines from './Lines.jsx';


class TripPlanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stationList: [{'id': 0, 'name': 'select station'}],
      startStation: '',
      startStationId: null,
      startIndex: null,
      endStation: '',
      endStationId: null,
      endIndex: null,
      linesWithStartStation: [],
      linesWithEndStation: [],
      //lineCombinations: [],
      allStopsOnALine: [],
      stops: [],
      toward: [],
      circles: [],
      lineNames: '',
      lines: [],
      shortest: 100

    }

    this.displayStationList = this.displayStationList.bind(this);
    this.selectStart = this.selectStart.bind(this);
    this.selectEnd = this.selectEnd.bind(this);
    this.fetchLines = this.fetchLines.bind(this);
    this.getDirection = this.getDirection.bind(this);
    this.transfer = this.transfer.bind(this);
    this.getLineHeader= this.getLineHeader.bind(this);
    this.getSharedLine= this.getSharedLine.bind(this);
    this.isCorrectDirection = this.isCorrectDirection.bind(this);
    this.displayStops = this.displayStops.bind(this);
   
  }

// display all stations and those favorite ones would be on top of the list.
  displayStationList() {
     axios.get('/api/stations/')

      .then((response) => {
        const stations = response.data
        const FavToUnfavStations = stations.sort((a, b) => b.is_favorite - a.is_favorite);
        this.setState({stationList: this.state.stationList.concat(FavToUnfavStations)})
    
      })

      .catch((error)=>{
         console.log(error);
       })
  }

  // get user selected station'names and station id.

  selectStart(e) {
    this.setState({startStation: JSON.parse(e.target.value).station, startStationId: JSON.parse(e.target.value).id});
  };

  selectEnd(e) {
    this.setState({endStation: JSON.parse(e.target.value).station, endStationId:JSON.parse(e.target.value).id});

  };


  async getDirection() {

    this.setState({ stops: [] });
    const LinesOfStations = await this.fetchLines();
    const shareLine = await this.getSharedLine(this.state.linesWithStartStation, this.state.linesWithEndStation);
    const lineColor = await this.getLineHeader(this.state.lines)
    
  }  

  async fetchLines() {

    // fetch lines that have the starting station. 
      //set state for this list of line
    // fetch lines that have the ending station.
      //set state for this list of line
  
    console.log('starting station is ' + this.state.startStation + ' station_id is ' + this.state.startStationId);
    console.log('ending station is ' + this.state.endStation + ' station_id is ' + this.state.endStationId)


    const responseStart = await axios.get('/api/station/' + this.state.startStationId)
    const linesWithStartStation = responseStart.data;
    this.setState({linesWithStartStation: linesWithStartStation});

    const responseEnd = await axios.get('/api/station/' + this.state.endStationId)
    const linesWithEndStation = responseEnd.data;
    this.setState({linesWithEndStation: linesWithEndStation});

    console.log('list of lines having the selected start station : ' , this.state.linesWithStartStation);
    console.log('list of lines having the selected ending station : ' , this.state.linesWithEndStation);

/*
        this.setState({lineCombinations : lineCombinations})
        console.log('lineCombinations is ', this.state.lineCombinations)
        if (transfer === true) {
          this.state.lineCombinations.map(x => this.transfer(x))
        }
      })*/

     
  }

  async getSharedLine(linesOfStart, linesOfEnd) {

    // compare two arrays, any share line id?
      //yes?
         //pass line id to function isCorrectDirection
         // if isCorrectDirection returns stops, push the line id to array direct Routes. 
      // no? ()
         //pass linesMix to transfer.

    let sharedLine = null;
    let response = null;
    let directRoute = [];
    let linesMix = [];

    for (let i = 0; i < linesOfStart.length; i++) {

      for (let j = 0; j < linesOfEnd.length; j++) {

              /*lineCombinations.push([this.state.linesWithStartStation[i].line_id, this.state.linesWithEndStation[j].line_id])*/

        if (linesOfStart[i].line_id === linesOfEnd[j].line_id) {
          //transfer = false;
                //this.getLineHeader(this.state.linesWithStartStation[i].line_id)
          sharedLine = linesOfStart[i].line_id;
          response = await this.isCorrectDirection(sharedLine);
       
          if (response) {
            directRoute.push(sharedLine);
            console.log(response)
 
            if (this.state.stops.length === 0) {
              this.displayStops(this.state.startStationId, this.state.endStationId, sharedLine);
            }
          }

        } else { linesMix.push([linesOfStart[i].line_id, linesOfEnd[j].line_id]); }
      }    
    };

    this.setState({ lines: directRoute });
    console.log('direct route are ', this.state.lines);

    if (this.state.lines.length === 0) {
      this.transfer(linesMix);
    }
  }

  async isCorrectDirection(lineId, transferId) {
   
    const response = await axios.get('/api/lines/' + lineId);
    const currentLine = response.data;


    const startId = transferId || this.state.startStationId;
    const endId = this.state.endStationId;

    let startIndex = null;  
    let endIndex = null;

    // look for start and end station on this line.

    for (let i = 0; i < currentLine.length; i++) {

      if (currentLine[i].station_id === startId) {
        startIndex = i;
      }  
      if (currentLine[i].station_id === endId) {
        endIndex = i;     
      }
    };
     // if start index exists AND end index exists AND start index < end index are all true,
        //yes? 
           //call display stops for the first time, 
           //other times, ignore(since stops will be same)
           //return true back to getSharedLine.
        //no?
          //not do anything.
   
    if(startIndex !== null && endIndex !== null && startIndex < endIndex) {
      return endIndex - startIndex; 
      console.log('isCorrectDirection, line id is ', lineId, ' start Index is ', startIndex, ' end Index is ', endIndex)    
    };

    
     
  }

  async displayStops(startId, endId, lineId) {

    const response = await axios.get('/api/lines/' + lineId);
    const allStops = response.data;
    let startIndex = null;
    let endIndex = null;

    for (let i = 0; i < allStops.length; i++) {
      if (allStops[i].station_id === startId) {
        startIndex = i
      }
      if (allStops[i].station_id === endId) {
        endIndex = i;
      }
    }

    const stops = allStops.slice(startIndex, endIndex + 1);
    this.setState({stops: stops})

    console.log('display stops ', this.state.stops);
  }

  async getLineHeader(lineList){

    let circles = [];
    let name = [];
    let nameList= [];
    let nameStr = '';
    let secondSpace = null;
    let destination = null;
    let toward = [];
    let towardStr = '';

   // get circle color and line name from database for each line in the linelist 
     // push color code to array circles
     // push color name to array nameList, modify response.data. 
     // push destination to array toward, modify response.data
     // render by setState. 

  for (var i = 0; i < lineList.length; i++) {
    const response = await axios.get('/api/linecolor/' + lineList[i]);
    const data = response.data[0];

    circles.push('#' + data.color)
    name = data.name.replace(':', '').split(' ')
    nameList.push(name[0]);

    secondSpace = data.name.indexOf('towards');
    destination = data.name.slice(secondSpace + 7);
    if (!toward.includes(destination)) {
      toward.push(destination);
    }
  
  }
    nameStr = nameList.join(', ');
    towardStr = toward.join(', ');
    this.setState({ circles: circles, lineNames: nameStr, toward: towardStr });
 
    console.log('circle is ', this.state.circles, ' line is ', this.state.lineNames, ' lineList is ', lineList)
  }
  
  /*displayStops(lineid, transferid) {
    this.setState({toward: []})
    console.log('reached displayStops, common line id is: ' + lineid);
    

    // get all the stops along a line
    axios.get('/api/lines/' + lineid)
      .then((response) => {

        let startingStopIndex = null;  
        let endingStopIndex= null;
        let stops = null
        console.log('stops fetched from first line ',lineid, ' is ', response.data )

        for (let i = 0; i < response.data.length; i++) {
          // if a station id of a line matches the starting station id, set index. 
          if (response.data[i].station_id === this.state.startStationId) {
            startingStopIndex = i;
            console.log('found start' + JSON.stringify(response.data[i]))
          }
          // if the last station of a line matches the ending station id, set index. 

          if (response.data[response.data.length -1].station_id === this.state.endStationId && response.data[i].station_id === transferid) {
            endingStopIndex = i;
            console.log('ending station id is ', this.state.endStationId, response.data[i])

          }

          if (response.data[i].station_id === this.state.endStationId) {
            endingStopIndex = i;
            console.log('found end' + JSON.stringify(response.data[i]))
          }}
           //
    if (!this.state.toward.includes(destination)) {
      this.state.toward.push(destination)
    }
    console.log('toward ', this.state.toward, lineid)
    
    
    this.getLineHeader(lineid)
    
    
    console.log('state of the stops is ', this.state.stops);

    return 'found line';

  }
          
             

      })


      .catch((error)=>{
         console.log(error);
      })

  }*/


  async transfer(linesMix) {

    // linesMix  = [ [1,2], [3,5], ...] for example.
    // for each line in each pair in linesMix, axios get the transfer stations
      // if any share transfer station
        // pass transfer station and line2 to distanceToEnd
        // pick the transfer station that's closest to the ending station && pass to isCorrctDirection.
          // display stops from start stop to transfer stop from first line
          // display stops from transfer stop to ending stop from second line
      // if no transfer station, also no direct route?
        // (impossible, bart is powerful.)
    let line1 = null;
    let line2 = null;
    let transferStations1 = [];
    let transferStations2 = [];
    let response1 = null;
    let response2 = null;
    let shareTransferId = null;
    let distance = 0;
    let shortest = 100;
    let correctLine1 = null;
    let correctLine2 = null;
    let finalTransferId = null;
    
    
    for (let i = 0; i < linesMix.length; i++) {
      line1 = linesMix[i][0];
      line2 = linesMix[i][1];

      // fetch transfer stations of line1
      response1 = await axios.get('/api/transfer/' + line1);
      transferStations1 = response1.data;
      console.log('transferStations on line ',line1,' are ', JSON.stringify(transferStations1));

      //fetch transfer stations from line2
      response2 = await axios.get('/api/transfer/' + line2)
      transferStations2 = response2.data;
      console.log('transferStations on line ', line2, ' are ', JSON.stringify(transferStations2));

      if (transferStations1.length !== 0 && transferStations2.length !== 0) {

        for (let j = 0; j < transferStations1.length; j++) {
          for (let k = 0; k < transferStations2.length; k++) {

            if (transferStations1[j].station_id === transferStations2[k].station_id) {
              shareTransferId = transferStations1[j].station_id;   

              console.log('shared transfer id is ', shareTransferId, 'line2 is ', line2)
              distance = await this.isCorrectDirection(line2, shareTransferId);

              if (distance < shortest) {
                shortest = distance;
                correctLine2 = line2;
                this.setState({lines: [line1]})
                finalTransferId = shareTransferId;

              }          
            }
          }
        }
       
      }     
    }
  
    console.log(shortest, correctLine2, finalTransferId);
    this.displayStops(this.state.startStationId, finalTransferId, this.state.lines);
    this.getLineHeader(this.state.lines)

  }

  async distanceToStop(transferId, endId, line) {
    //fetch stops on this line = (line2)
    // for loop stops, find the index of the transfer station and index of the end station 
      // if distance = (index of end station - index of transfer station) > 0,
        // return distance
    //let response = await axios('')

    const response = await axios.get('/api/lines/' + line);
    const stops = response.data;
    let transferIndex = null;
    let endIndex = null;
    let distance = null;

    for (let i = 0; i < stops.length; i++) {
      if (stops[i].station_id === transferId) {
        transferIndex = i;
     
        console.log(stops[i].name)
      }
      if (stops[i].station_id === endId) {
        endIndex = i;
      }

     // if (transferIndex! == null &&)
    }

    distance = endIndex - transferIndex;
    return distance > 0? [distance, stops] : console.log(transferId, line, 'not feasible to end station')

  }


  componentDidMount() {
    this.displayStationList();
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
          <select onChange= {this.selectEnd}>{this.state.stationList.map((station, index) => <option value={JSON.stringify({'station': station.name, 'id': station.id})} key={index}>{station.name}</option>)}
          </select>

          <br />

          <button onClick ={this.getDirection}>Go!</button>
        </div>

        <div className="directions">
          <div className="directions-summary">
            <p className="line-name">{this.state.startStation} to {this.state.endStation}</p>
            <p>31 minutes (arrive at 5:51pm)</p>
          </div>
          <div className="directions-step">
            <div className="directions-line-header">
              <p className="line-name">Start at {this.state.startStation}</p>
            </div>
          </div>
          <div className="directions-step">
          
        <div className="directions-step">
          <div className="directions-line-header">

            {this.state.circles.map((circle, index) => (<div key= {index} className="line-circle" style={{backgroundColor: circle}}></div>))}
            <p className="line-name">{this.state.lineNames} Line</p>
            <p className="line-direction">towards {this.state.toward}</p>
          </div>
            <ul>
              {this.state.stops.map((stop) => (<li key={stop.id}>{stop.name}</li>))}
            </ul>
        </div>    
          </div>
           <div className="transfer">
          {<Transfer />}
        </div>
          <div className="directions-step">
            <div className="directions-line-header">
              <p className="line-name">Arrive at {this.state.endStation}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TripPlanner;