import React from 'react';
import axios from 'axios';
import Transfer from './Transfer.jsx';
import Lines from './Lines.jsx';

let color = {
      '1 and 2' :['Red', '#e11a57'], 
      '3 and 4' :['Yellow', '#fdf057'],
      '5 and 6' :['Blue', '#2aabe2'],
      '7 and 8' :['Green', '#4fb848'],
      '9 and 10' :['Orange','#f9a11d']
};

class TripPlanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stationList: [{'id': 0, 'name': 'select station'}],
      startStation: '',
      startStationId: null,
      endStation: '',
      endStationId: null,
      linesWithStartStation: [],
      linesWithEndStation: [],
      possibleLine: null,
      lineCombinations: [],
      stops: [],
      toward: [],
      circles: [],
      lineNames: '',
      lines: []

    }

    this.displayStationList = this.displayStationList.bind(this);
    this.selectStart = this.selectStart.bind(this);
    this.selectEnd = this.selectEnd.bind(this);
    this.fetchLines = this.fetchLines.bind(this);
    this.getDirection = this.getDirection.bind(this);
    this.transfer = this.transfer.bind(this);
    this.getLineColor= this.getLineColor.bind(this);
    this.compareLines= this.compareLines.bind(this);
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
    const shareLine = await this.compareLines(this.state.linesWithStartStation, this.state.linesWithEndStation);
    const lineColor = await this.getLineColor(this.state.lines)
    
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


  async compareLines(linesOfStart, linesOfEnd) {

    // compare two arrays, any share line id?
      //yes?
         //pass line id to function isCorrectDirection
         // if isCorrectDirection returns true, push the line id to array feasible Routes. 
      // no? 
         //need to transfer

    let sharedLine = null;
    let response = null;
    let feasibleRoutes = [];

    for (let i = 0; i < linesOfStart.length; i++) {

      for (let j = 0; j < linesOfEnd.length; j++) {

              /*lineCombinations.push([this.state.linesWithStartStation[i].line_id, this.state.linesWithEndStation[j].line_id])*/

        if (linesOfStart[i].line_id === linesOfEnd[j].line_id) {
          //transfer = false;
                //this.getLineColor(this.state.linesWithStartStation[i].line_id)
          sharedLine = linesOfStart[i].line_id;
          response = await this.isCorrectDirection(sharedLine);
      
          if (response === true) {
            feasibleRoutes.push(sharedLine);
          }

        }
      }    
    };

    this.setState({ lines: feasibleRoutes });
    console.log('common line is ', this.state.lines)  
  }

  async isCorrectDirection(lineId) {
   
    const response = await axios.get('/api/lines/' + lineId);
    const currentLine = response.data;


    const startId = this.state.startStationId;
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
           //return true back to CompareLines.
        //no?
          //not do anything.
   
    if(startIndex !== null && endIndex !== null && startIndex < endIndex) {
      if (this.state.stops.length === 0) {
        this.displayStops(startIndex, endIndex, currentLine);
      }
       return true;     
    };

    console.log('isCorrectDirection, line id is ', lineId, ' start Index is ', startIndex, ' end Index is ', endIndex)
   
     
  }


  displayStops(start, end, stopsList) {

    const stops = stopsList.slice(start, end + 1);
    this.setState({stops: stops})

    console.log('display stops ', this.state.stops);
  }


  async getLineColor(lineList){

    let circles = [];
    let name = [];
    let nameList= [];

   // if a line id appears inside of the object lineColor
     // push color code to array circles
     // push color name to array nameList
     // render by setState. 

/*    console.log('getLineColor, lines are ', this.state.circles);
    
    
    
    lineList.forEach( function(id) {

      for (let line in color) {

        if (line.includes(id) && !circles.includes(color[line][0])) {
  
          nameList.push(color[line][0]);
          circles.push(color[line][1]);
         
        }
      }
    })

    

    
    ;*/
   
    let lineInfo = await lineList.forEach(async function (line) {

      let response = await axios.get('/api/linecolor/' + line);

      circles.push(response.data[0].color)
      name = response.data[0].name.replace(':', '').split(' ')
      nameList.push(name[0]);

    });
    
    //let B = await A;

    let nameStr = nameList.join(', ');
    this.setState({ circles: circles, lineNames: nameStr });

    //this.setState({ circles: color});
    console.log(nameList)
 
    console.log('circle is ', this.state.circles, ' line is ', this.state.lineNames)
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
           // let destination = stops[stops.length -1].name
    if (!this.state.toward.includes(destination)) {
      this.state.toward.push(destination)
    }
    console.log('toward ', this.state.toward, lineid)
    
    
    this.getLineColor(lineid)
    
    
    console.log('state of the stops is ', this.state.stops);

    return 'found line';

  }
          
             

      })


      .catch((error)=>{
         console.log(error);
      })

  }*/


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
              
              this.displayStops(line1, transferid)
            }

          }
        }
      })
      .catch((error)=>{
         console.log(error);
       })

    
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
         {/* {<Transfer />}*/}
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