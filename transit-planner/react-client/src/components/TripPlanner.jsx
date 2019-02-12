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
      trfSta: '',
      isHidden: true,
    }
  }

// display all stations and those favorite ones would be on top of the list.
  async displayStaList() {
    const response = await axios.get('/api/stations/');
    const stations = response.data
    const fromFav = stations.sort((a, b) => b.is_favorite - a.is_favorite);
    const staList = this.state.staList.concat(fromFav)
    this.setState({ staList });
  }

  // get user selected station'name and station id.

  selectStrt(e) {
    const { strtSta, strtStaId } = JSON.parse(e.target.value);
    this.setState({ strtSta, strtStaId });
  };

  selectEnd(e) {
    const { endSta, endStaId } = JSON.parse(e.target.value);
    this.setState({ endSta, endStaId });

  };
  
  // invoke getDirection once user click 'Go'
    // hide the second <DirectionSteps /> and empty stops

  async getDirection() {

    this.setState({ stops: [], isHidden: true });
    const LinesOfStations = await this.fetchLines();
    const shareLine = await this.getDirectRoute(this.state.linesWithStrtSta, this.state.linesWithEndSta);
    
  }  

  async fetchLines() {

    // fetch lines that have the starting station. 
    // fetch lines that have the ending station.
  
    console.log('starting station is ' + this.state.strtSta + ' station_id is ' + this.state.strtStaId);
    console.log('ending station is ' + this.state.endSta + ' station_id is ' + this.state.endStaId)


    const responseStrt = await axios.get('/api/station/' + this.state.strtStaId)
    const linesWithStrtSta = responseStrt.data
    this.setState({linesWithStrtSta});

    const responseEnd = await axios.get('/api/station/' + this.state.endStaId)
    const linesWithEndSta = responseEnd.data
    this.setState({linesWithEndSta});

    console.log('list of lines having the selected start station : ' , this.state.linesWithStrtSta);
    console.log('list of lines having the selected ending station : ' , this.state.linesWithEndSta);

  }

  // look for direct route from lines with start station and lines with ending station. 

  async getDirectRoute(linesWithStrt, linesWithEnd) {

    // compare two arrays, any share line id?
      //yes? each time...
         // getStopsInfo to check this shared line, 
           // vaild? add to line. 
         // call display stops only for the first match, 
           // for other matches, stops will be same, no update stops
      // no? each time...
         //add the i, j line ids to linesMix
    // if line.length === 0? start transfer.

    let sharedLine = null;
    let line = [];
    let linesMix = [];
  

    for (let strt of linesWithStrt) {

      for (let end of linesWithEnd) {

        // shared line id?
        if (strt.line_id === end.line_id) {
        
          let sharedLine = strt.line_id;
          let response = await this.getStopsInfo(sharedLine, this.state.strtStaId, this.state.endStaId);

          // valid?
          if (response) {
            line.push(sharedLine);
            console.log(response);

            // valid and hasn't display stop?
            if (this.state.stops.length === 0) {
              this.setState({ stops: response.stops })
            }
          }

        // not a good match?  add to lineMix.

        } else { linesMix.push([strt.line_id, end.line_id]); }
      }    
    };


    const { circles, lineNames,toward } = await this.getLineHead(line);

    this.setState({ line, circles,lineNames, toward });

    console.log('direct route are ', this.state.line);

    //transfer?
    return this.state.line.length === 0 && this.transfer(linesMix);
  }

  async getStopsInfo(lineId, strtId, endId) {
   
    const response = await axios.get('/api/lines/' + lineId);
    const stops = response.data;

    let strtIndex = stops.indexOf(stops.filter(stop => stop.station_id === strtId)[0]);  
    let endIndex = stops.indexOf(stops.filter(stop => stop.station_id === endId)[0]);
  
    let distance;
    let stopsPiece = [];

   // if start index AND end index AND the order is correct,
    if(strtIndex!== undefined && endIndex!== undefined && strtIndex < endIndex) {

      // get stops from strtId to endId
      stopsPiece = stops.slice(strtIndex, endIndex + 1);
      distance = endIndex - strtIndex;

      console.log('getStopsInfo, line id is ', lineId, ' start Index is ', strtIndex, ' end Index is ', endIndex, ' distance is ', distance);
      return {distance: distance, stops: stopsPiece};   
    };  
  }

  async getLineHead(lines){

    let circles = [];
    let nameList= [];
    let lineNames = '';
    let destination = null;
    let towardList = [];
    let toward = '';

  // get line info for each single line in lines
  for (let line of lines) {
    const response = await axios.get('/api/linecolor/' + line);
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

    let totDistance = 100;
    let line = [];
    let trfLine = [];
    let trfSta = '';  
    let stops = [];
    let trfLStops = [];
    
    for (let linePair of linesMix) {
      let [line1, line2] = linePair;

      // fetch transfer stations of line1
      let response1 = await axios.get('/api/transfer/' + line1);
      let trfStasOnL1 = response1.data;
      console.log('transferStations on line 1 ',line1,' are ', JSON.stringify(trfStasOnL1));

      //fetch transfer stations from line2
      let response2 = await axios.get('/api/transfer/' + line2)
      let trfStaOnL2 = response2.data;
      console.log('transferStations on line 2', line2, ' are ', JSON.stringify(trfStaOnL2));

      
        for (let trfStaOn1 of trfStasOnL1) {
          for (let trfStaOn2 of trfStaOnL2) {

            // share trf station?
            if (trfStaOn1.station_id === trfStaOn2.station_id) {
              let shareTrf = trfStaOn1.station_id;   

              // stops Count = distance between two stations on a line.
              let stopsCountL2 = await this.getStopsInfo(line2, shareTrf, this.state.endStaId);
              let stopsCountL1 = await this.getStopsInfo(line1, this.state.strtStaId, shareTrf);

              // each time when stopsCountL2.distance  + stopsCountL1.distance < totDistance
               // update totDistance 
               // assign correct line2
               // assign correct line1
               // assign trf Id
              // if equal
               // if not duplicated
                // add correct lines

              if (stopsCountL1 && stopsCountL2) {
                let totStops = stopsCountL1.distance + stopsCountL2.distance;
            
                if (totStops < totDistance) {
                  totDistance = totStops;
                  trfLine = [line2];
                  line = [line1];
                  trfSta = stopsCountL2.stops[0].name;
                  trfLStops = stopsCountL2.stops;
                  stops = stopsCountL1.stops;
                }

                if (totStops === totDistance) {
                   if (!line.includes(line1)) {
                     line.push(line1);
                   }

                   if (!trfLine.includes(line2)) {
                     trfLine.push(line2);
                   }
                } 
              }

            }
          }
        }
      }     
    
    this.setState({line, trfLine});

    let {circles, lineNames, toward}= await this.getLineHead(this.state.line);
    let trfLineHeader = await this.getLineHead(this.state.trfLine);
    
    this.setState({ stops, circles, lineNames, toward, trfLStops, trfSta,
      trfCircles: trfLineHeader.circles, 
      trfLineNames: trfLineHeader.lineNames, 
      trfToward:trfLineHeader.toward,
      isHidden: false
    });

    console.log('line2 is ', trfLine, 'line1 is ', line, 'totDistance is ', totDistance, ' stops are ', stops)
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

          <select onChange= {this.selectStrt.bind(this)}>{this.state.staList.map((station, index) => <option value={JSON.stringify({'strtSta': station.name, 'strtStaId': station.id})} key={index}>{station.name}</option>)}
          </select>

          <br />

          End: 
          <select onChange= {this.selectEnd.bind(this)}>{this.state.staList.map((station, index) => <option value={JSON.stringify({'endSta': station.name, 'endStaId': station.id})} key={index}>{station.name}</option>)}
          </select>

          <br />

          <button onClick ={this.getDirection.bind(this)}>Go!</button>
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

        {!this.state.isHidden &&
          <div>
            <div className="directions-step">
              <div className="directions-line-header">
                <p className="line-name">Change Trains at {this.state.trfSta} Station</p>
              </div>
            </div>
             
              <DirectionStep stops= { this.state.trfLStops } circles={ this.state.trfCircles } lineNames={ this.state.trfLineNames } toward={ this.state.trfToward } />
          </div>
        } 
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