import React from 'react';
import axios from 'axios';
import DirectionStep from './DirectionStep.jsx';
import Lines from './Lines.jsx';


class TripPlanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      staList: [{'id': 0, 'name': 'select station'}],
      strtSta: '',
      strtStaId: null,
      endSta: '',
      endStaId: null,
      linesWithStrtSta: [],
      linesWithEndSta: [],
      stops: [],
      trfLStops: [],
      toward: [],
      trfToward:[],
      circles: [],
      trfCircles:[],
      lineNames: '',
      trfLineNames: '',
      line: [],
      trfLine:[],
    }

    this.displayStaList = this.displayStaList.bind(this);
    this.selectStrt = this.selectStrt.bind(this);
    this.selectEnd = this.selectEnd.bind(this);
    this.fetchLines = this.fetchLines.bind(this);
    this.getDirection = this.getDirection.bind(this);
    this.transfer = this.transfer.bind(this);
    this.getLineHead= this.getLineHead.bind(this);
    this.getDirRoute= this.getDirRoute.bind(this);
    this.isCorrectDirection = this.isCorrectDirection.bind(this);
    this.displayStops = this.displayStops.bind(this);
   
  }

// display all stations and those favorite ones would be on top of the list.
  displayStaList() {
     axios.get('/api/stations/')

      .then((response) => {
        const stations = response.data
        const fromFav = stations.sort((a, b) => b.is_favorite - a.is_favorite);
        this.setState({staList: this.state.staList.concat(fromFav)});
    
      })

      .catch((error)=>{
         console.log(error);
       })
  }

  // get user selected station'names and station id.

  selectStrt(e) {
    this.setState({strtSta: JSON.parse(e.target.value).station, strtStaId: JSON.parse(e.target.value).id});
  };

  selectEnd(e) {
    this.setState({endSta: JSON.parse(e.target.value).station, endStaId:JSON.parse(e.target.value).id});

  };


  async getDirection() {

    this.setState({ stops: [] });
    const LinesOfStations = await this.fetchLines();
    const shareLine = await this.getDirRoute(this.state.linesWithStrtSta, this.state.linesWithEndSta);
    
  }  

  async fetchLines() {

    // fetch lines that have the starting station. 
      //set state for this list of line
    // fetch lines that have the ending station.
      //set state for this list of line
  
    console.log('starting station is ' + this.state.strtSta + ' station_id is ' + this.state.strtStaId);
    console.log('ending station is ' + this.state.endSta + ' station_id is ' + this.state.endStaId)


    const responseStart = await axios.get('/api/station/' + this.state.strtStaId)
    const linesWithStrtSta = responseStart.data;
    this.setState({linesWithStrtSta: linesWithStrtSta});

    const responseEnd = await axios.get('/api/station/' + this.state.endStaId)
    const linesWithEndSta = responseEnd.data;
    this.setState({linesWithEndSta: linesWithEndSta});

    console.log('list of lines having the selected start station : ' , this.state.linesWithStrtSta);
    console.log('list of lines having the selected ending station : ' , this.state.linesWithEndSta);

  }

  async getDirRoute(linesOfStart, linesOfEnd) {

    // compare two arrays, any share line id?
      //yes?
         //pass line id to function isCorrectDirection
         // if isCorrectDirection returns stops, push the line id to array direct Routes. 
         //call display stops only for the first match, 
           //for other matches, stops will be same, no need to update stops)
      // no? ()
         //pass linesMix to transfer.

    let sharedLine = null;
    let response = null;
    let directRoute = [];
    let linesMix = [];

    for (let i = 0; i < linesOfStart.length; i++) {

      for (let j = 0; j < linesOfEnd.length; j++) {

        // shared line id?
        if (linesOfStart[i].line_id === linesOfEnd[j].line_id) {
        
          sharedLine = linesOfStart[i].line_id;
          response = await this.isCorrectDirection(sharedLine, this.state.strtStaId, this.state.endStaId);
       
          if (response) {
            directRoute.push(sharedLine);
            console.log(response);
 
            if (this.state.stops.length === 0) {
              let stops = await this.displayStops(this.state.strtStaId, this.state.endStaId, sharedLine);
              this.setState({stops: stops})
            }
          }

        // no shared line id? prepare to take transfer

        } else { linesMix.push([linesOfStart[i].line_id, linesOfEnd[j].line_id]); }
      }    
    };

    const lineColor = await this.getLineHead(directRoute);

    this.setState({ line: directRoute, circles: lineColor.circles, lineNames:lineColor.lineNames, toward: lineColor.toward });

    console.log('direct route are ', this.state.line);

    //need transfer?
    if (this.state.line.length === 0) {
      this.transfer(linesMix);
    }
  }

  async isCorrectDirection(lineId, startId, endId) {
   
    const response = await axios.get('/api/lines/' + lineId);
    const stops = response.data;

    let staIndex = null;  
    let endIndex = null;
    let distance = null;

    // look for start and end station on this line.

    for (let i = 0; i < stops.length; i++) {

      if (stops[i].station_id === startId) {
        staIndex = i;
      }  
      if (stops[i].station_id === endId) {
        endIndex = i;     
      }
    };
     // if start index exists AND end index exists AND start index < end index are all true,
        //yes? 
           //return diff back to getDirRoute.
        //no?
          //not do anything.
   
    if(staIndex !== null && endIndex !== null && staIndex < endIndex) {
      distance = endIndex - staIndex
      return distance; 
      console.log('isCorrectDirection, line id is ', lineId, ' start Index is ', staIndex, ' end Index is ', endIndex)    
    };  
  }

  async displayStops(startId, endId, lineId) {

  // fetch stops along this line
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

    // get stops from startId to endId
    const stops = allStops.slice(startIndex, endIndex + 1);
    console.log('display stops ', this.state.stops, ' all stops are ', allStops, ' startId is ', startId, ' endId is ', endId, ' lineId is ', lineId);
    return stops;
  }

  async getLineHead(lines){

    let circles = [];
    let nameList= [];
    let lineNames = '';
    let destination = null;
    let towardList = [];
    let toward = '';

  // get line info for each single line in lines
  for (var i = 0; i < lines.length; i++) {
    const response = await axios.get('/api/linecolor/' + lines[i]);
    const data = response.data[0];

    //get line circle
      //from db, e.g. data.color = "e11a57"
    circles.push('#' + data.color)
    

    //get line name
      //from db, e.g. data.name = "Red: towards Richmond"
    const name = data.name.replace(':', '').split(' ')
    nameList.push(name[0]); //'Red'


    //get toward
      //from db, e.g. data.name = "Orange: towards Warm Springs"
    const towardsIndex = data.name.indexOf('towards');
    destination = data.name.slice(towardsIndex + 7); //'Warm Springs'


    // e.g. line 7 and 9 both toward Warm Springs. Show only one Warm Spring.
    if (!towardList.includes(destination)) {  
      towardList.push(destination);
    }
  }

    lineNames = nameList.join(' or ');
    toward = towardList.join(' / ');
 
    console.log('circle is ', this.state.circles, ' line is ', this.state.lineNames, ' lines is ', lines);

    return { circles: circles, lineNames: lineNames, toward: toward }
  }


  async transfer(linesMix) {

    // linesMix  = [ [1,2], [3,5], ...] for example.
    // axios get the transfer stations for each pair 
      // if any share transfer station
        // test direction and distance from start station to trf, from trf to end station.
          // get the shoretest route ( smallest tot of stops)

        // display stops from start stop to transfer stop from line1
        // display stops from transfer stop to ending stop from line2
      // if no transfer station, also previously confirmed no direct route?
        // no such case. (no codes)

    let trfStasOnL1 = [];
    let trfStaOnL2 = [];
    let shareTrf = null;
    let totDistance = 100;
    let correctL1 = [];
    let correctL2 = [];
    let trfId = null;
    
    for (let i = 0; i < linesMix.length; i++) {
      let line1 = linesMix[i][0];
      let line2 = linesMix[i][1];

      // fetch transfer stations of line1
      let response1 = await axios.get('/api/transfer/' + line1);
      trfStasOnL1 = response1.data;
      console.log('transferStations on line 1 ',line1,' are ', JSON.stringify(trfStasOnL1));

      //fetch transfer stations from line2
      let response2 = await axios.get('/api/transfer/' + line2)
      trfStaOnL2 = response2.data;
      console.log('transferStations on line 2', line2, ' are ', JSON.stringify(trfStaOnL2));

      
        for (let j = 0; j < trfStasOnL1.length; j++) {
          for (let k = 0; k < trfStaOnL2.length; k++) {

            // share trf station?
            if (trfStasOnL1[j].station_id === trfStaOnL2[k].station_id) {
              shareTrf = trfStasOnL1[j].station_id;   

              // stops Count = distance between two stations on a line.
              let stopsCountL2 = await this.isCorrectDirection(line2, shareTrf, this.state.endStaId);
              let stopsCountL1 = await this.isCorrectDirection(line1, this.state.strtStaId, shareTrf);

              // each time when stopsCountL2  + stopsCountL1 < distance 
               // update distance 
               // assign correct line2
               // assign correct line1
               // assign trf Id
              // if equal
               // if not duplicated
                // add correct lines
              let totStops = stopsCountL1 + stopsCountL2;

              if (totStops < totDistance) {
                totDistance = totStops;
                correctL2 = [line2];
                correctL1 = [line1];
                trfId = shareTrf;
              }

              if (totStops === totDistance) {
                 if (!correctL1.includes(line1)) {
                   correctL1.push(line1);
                 }

                 if (!correctL2.includes(line2)) {
                   correctL2.push(line2);
                 }
              }                                   
            }
          }
        }
      }     
    
    this.setState({line: correctL1, trfLine: correctL2});

    let stops = await this.displayStops(this.state.strtStaId, trfId, this.state.line[0]);
    let trfLStops = await this.displayStops(trfId, this.state.endStaId, this.state.trfLine[0]);
    let lineHeader= await this.getLineHead(this.state.line);
    let trfLineHeader = await this.getLineHead(this.state.trfLine);
    
    this.setState({ 

      stops: stops, 
      circles: lineHeader.circles, 
      lineNames: lineHeader.lineNames, 
      toward: lineHeader.toward, 

      trfLStops: trfLStops, 
      trfCircles: trfLineHeader.circles, 
      trfLineNames: trfLineHeader.lineNames, 
      trfToward:trfLineHeader.toward
    });

    console.log('shared transfer id is ', shareTrf, 'line2 is ', correctL2, 'line1 is ', correctL1, 'totDistance is ', totDistance)
    console.log(this.state.circles, this.state.lineNames, this.state.toward, this.state.trfCircles, this.state.trfLineNames, this.state.trfToward)

  }

  componentDidMount() {
    this.displayStaList();
  }

  render() {
    return (
      <div className="trip-planner-view">
        <div className="selections">
          Start: 

          <select onChange= {this.selectStrt}>{this.state.staList.map((station, index) => <option value={JSON.stringify({'station': station.name, 'id': station.id})} key={index}>{station.name}</option>)}
          </select>

          <br />

          End: 
          <select onChange= {this.selectEnd}>{this.state.staList.map((station, index) => <option value={JSON.stringify({'station': station.name, 'id': station.id})} key={index}>{station.name}</option>)}
          </select>

          <br />

          <button onClick ={this.getDirection}>Go!</button>
        </div>

        <div className="directions">
          <div className="directions-summary">
            <p className="line-name">{ this.state.strtSta } to { this.state.endSta }</p>
            <p>31 minutes (arrive at 5:51pm)</p>
          </div>

          <div className="directions-step">
            <div className="directions-line-header">
              <p className="line-name">Start at { this.state.strtSta }</p>
            </div>
          </div>
          
            <DirectionStep stops={ this.state.stops } circles={ this.state.circles } lineNames={ this.state.lineNames } toward ={ this.state.toward } />

          <div className="directions-step">
            <div className="directions-line-header">
              <p className="line-name">Change Trains</p>
            </div>
          </div>
           
            <DirectionStep stops= { this.state.trfLStops } circles={ this.state.trfCircles } lineNames={ this.state.trfLineNames } toward={ this.state.trfToward } />
         
          <div className="directions-step">
            <div className="directions-line-header">
              <p className="line-name">Arrive at { this.state.endSta }</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TripPlanner;