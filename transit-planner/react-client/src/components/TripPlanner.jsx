import React from 'react';
import axios from 'axios';
import DirectionStep from './DirectionStep.jsx';
import Lines from './Lines.jsx';


class TripPlanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      staList: [],
      strtSta: '',
      strtStaId: null,
      endSta: '',
      endStaId: null,
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
    this.select = this.select.bind(this);
  }



// display all stations and those favorite ones would be on top of the list.
  async displayStaList() {
    const response = await axios.get('/api/stations/');
    this.setState({ staList: response.data.sort((a, b) => b.is_favorite - a.is_favorite) });
  }

  // record user selected station name and station id.
  select(e, point, pointId) {
    const [ station, stationId ] = JSON.parse(e.target.value)
    this.setState({
      [ point ]: station,
      [ pointId ]: stationId
    });
  };

  // invoke getDirection once user click 'Go'
  
  async getDirection() {
    // set beginning with no stops and hide transfer JSX.

    this.setState({ stops: [], isHidden: true });
    
    const linesWithStrtSta = await this.fetchLines(this.state.strtStaId);
    const linesWithEndSta = await this.fetchLines(this.state.endStaId);
    
    const directRoute = await this.getDirectRoute(linesWithStrtSta, linesWithEndSta);
    // is there direct route? no? transfer.
    if (!directRoute) {
      this.transfer(linesWithStrtSta, linesWithEndSta);
    };

    const { circles, lineNames,toward } = await this.getLineHead(this.state.line);
    this.setState({ circles, lineNames, toward });
  };

  async fetchLines(statId) {
    const response = await axios.get('/api/station/' + statId); 
    return response.data.map(line => line.line_id);  // e.g. [1,2,3...]
  };

  async getDirectRoute(linesWithStrt, linesWithEnd) {
    let directRoutes = [];
    // any share line id?
    const sharedLine = linesWithStrt.filter(lineId => linesWithEnd.includes(lineId));   
    
      // yes? getStopsInfo to check each shared line, 
    if (sharedLine.length!== 0) {
      await Promise.all(sharedLine.map(async lineId => {
        const validLine = await this.getStopsInfo(lineId, this.state.strtStaId, this.state.endStaId);
        // vaild? add line id to directRoutes array. 
        if (validLine) {
          directRoutes.push(lineId);
          // record stops only for the first match
          this.state.stops.length === 0 && this.setState({stops: validLine.stops});
        };
      }));
      this.setState({ line: directRoutes}); 
    };
    return directRoutes.length !== 0;  // back to getDirection.
  };

  async getStopsInfo(lineId, strtId, endId) {
    const response = await axios.get('/api/lines/' + lineId);
    const allStops = response.data;

    const [strtIndex, endIndex] = this.getIndex(allStops, strtId, endId);

    // also check if direction is correct,
    if(strtIndex!== undefined && endIndex!== undefined && strtIndex < endIndex) {
      // extract stops from strtId to endId
      const stops = allStops.slice(strtIndex, endIndex + 1);
      const distance = endIndex - strtIndex;
      return { distance, stops };   
    };
  }

  getIndex(stopsList, ...stationIds) {
    return stationIds.map(id => stopsList.indexOf(stopsList.filter(stop => stop.station_id === id)[0]));
  }

  async getLineHead(lines){
/*
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

    return { circles: circles, lineNames: lineNames, toward: toward }*/

    
    let circles = [];
    let nameList= [];
    let lineNames = '';
    let destination = null;
    let towardList = [];
    let toward = '';

  // get line color info for each single line in lines
  for (let line of lines) {
    const response = await axios.get('/api/linecolor/' + line);
    const data = response.data[0];

    circles.push(this.getCircle(data.color)) 
    nameList.push(this.getLineName(data.name)); 
    destination = this.getToward(data.name)

    // e.g. line 7 and 9 both toward Warm Springs. Show only one Warm Spring.
    if (!towardList.includes(destination)) {  
      towardList.push(destination);
    }
  }

    lineNames = nameList.join(' or ');
    toward = towardList.join(' / ');
 
    console.log('circle is ', this.state.circles, ' line is ', this.state.lineNames, ' lines is ', lines);

    return { circles: circles, lineNames: lineNames, toward: toward }


  };

  getCircle(colorCode) {  //e.g. colorCode = "e11a57"
    return '#' + colorCode; 
  };

  getLineName(name) {   //name = "Red: towards Richmond"
    return name.replace(':', '').split(' ')[0];  
  };

  getToward(name) {
    const towardsIndex = name.indexOf('towards');  //e.g. name = "Orange: towards Warm Springs"
    return name.slice(towardsIndex + 7);
  };
  
  async transfer(linesWithStrt, linesWithEnd) {

    // linesMix  = [ [1,2], [3,5], ...] for example.
    // axios get the transfer stations for each pair 
      // if any share transfer station
        // test direction and distance from start station to trf, from trf to end station.
          // get the shoretest route ( smallest tot of stops)

        // display stops from start stop to transfer stop from line1
        // display stops from transfer stop to ending stop from line2
      // if no transfer station, also previously confirmed no direct route?
        // no such case. (no codes)

    let linesMix = this.createLineMix(linesWithStrt, linesWithEnd);
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

  createLineMix(lineList1, lineList2) {
    let linesMix = [];
    for (const line1 of lineList1) {
      for (const line2 of lineList2) {
        linesMix.push( [line1, line2] );
      }
    }
    return linesMix;
  }

  componentDidMount() {
    this.displayStaList();
  }

  // record start station and ending station and their IDs.
  renderSelect(select, point, pointId) {
    return (
      <select onChange= { e => select(e, point, pointId) }><option>select a station </option>
        { this.state.staList.map(station => 
          <option 
            value={ JSON.stringify([station.name, station.id])} key={ station.id }>
            { station.name } 
          </option>
        )}
      </select>
    );
  }

  render() {
    return (
      <div className="trip-planner-view">
        <div className="selections">
          Start: { this.renderSelect(this.select, 'strtSta', 'strtStaId') }
          <br />
          End: { this.renderSelect(this.select, 'endSta', 'endStaId') }    
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
          <div className="change-train">
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