import React from 'react';
import axios from 'axios';
import Directions from './Directions.jsx';
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
    // find share line
    // record stops and routes for valid sharedLines 
    let directRoutes = [];
    const sharedLine = linesWithStrt.filter(lineId => linesWithEnd.includes(lineId));   
    
    if (sharedLine.length!== 0) {
      await Promise.all(sharedLine.map(async lineId => {
        const validLine = await this.checkStops(lineId, this.state.strtStaId, this.state.endStaId); 

        if (validLine) {
          directRoutes.push(lineId);
          this.state.stops.length === 0 && this.setState({stops: validLine.stops});
        };
      }));
      this.setState({ line: directRoutes}); 
    };
    return directRoutes.length !== 0;  // back to getDirection.
  };
  
  async checkStops(lineId, strtId, endId) {
    //check if the order of two stops on a line is correct
      //yes? extract stops between them.
    const response = await axios.get('/api/lines/' + lineId);
    const allStops = response.data;

    const [strtIndex, endIndex] = this.getIndex(allStops, strtId, endId);
    if(strtIndex!== undefined && endIndex!== undefined && strtIndex < endIndex) {
      
      const stops = allStops.slice(strtIndex, endIndex + 1);
      const distance = endIndex - strtIndex;

      return { distance, stops };   
    };
  }
  
  getIndex(stopsList, ...stationIds) {
    return stationIds.map(id => stopsList.indexOf(stopsList.filter(stop => stop.station_id === id)[0]));
  }

  async getLineHead(lines){
    
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
    
    return { circles, lineNames, toward }
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
    // generate possible matches
    // for each pair, check if there's shared transfer station
      // yes? get the route with least # of tot stops.
    const linesMix = this.generateMix(linesWithStrt, linesWithEnd); //e.g. [ [1,2], [3,5], ...]
    let totDistance = 100;
    let line = [];
    let trfLine = [];
    let trfSta = '';  
    let stops = [];
    let trfLStops = [];
    
    for (let linePair of linesMix) {
      const [line1, line2] = linePair;
    
      const trfStasOnL1 = await this.fetchTrfStation(line1);
      const trfStasOnL2 = await this.fetchTrfStation(line2);

      const shareTrf = this.findSharedTrf(trfStasOnL1, trfStasOnL2);

      const stopsCountL1 = await this.checkStops(line1, this.state.strtStaId, shareTrf);
      const stopsCountL2 = await this.checkStops(line2, shareTrf, this.state.endStaId); 

      if (stopsCountL1 && stopsCountL2) {
        const totStops = stopsCountL1.distance + stopsCountL2.distance;
    
        if (totStops < totDistance) {
          totDistance = totStops;
          trfLine = [line2];
          line = [line1];
          trfSta = stopsCountL2.stops[0].name;
          trfLStops = stopsCountL2.stops;
          stops = stopsCountL1.stops;
        }
        
        if (totStops === totDistance) {
           if (!line.includes(line1)) { line.push(line1)}
           if (!trfLine.includes(line2)) {trfLine.push(line2)}
        } 
      }

    }

    let {circles, lineNames, toward}= await this.getLineHead(line);
    let trfLineHeader = await this.getLineHead(trfLine);
    
    this.setState({ line, trfLine, stops, circles, lineNames, toward, trfLStops, trfSta,
      trfCircles: trfLineHeader.circles, 
      trfLineNames: trfLineHeader.lineNames, 
      trfToward:trfLineHeader.toward,
      isHidden: false
    });
  }

  findSharedTrf(list1, list2) {
    for (let station1 of list1) {
      for (let station2 of list2) {
        if (station1.station_id === station2.station_id) {
          return station1.station_id;
        }
      }
    }
  }

  generateMix(lineList1, lineList2) {
    let linesMix = [];
    for (const line1 of lineList1) {
      for (const line2 of lineList2) {
        linesMix.push( [line1, line2] );
      }
    }
    return linesMix;
  }

  async fetchTrfStation(lineId) {
    const response = await axios.get('/api/transfer/' + lineId);
    return response.data;
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
    const { strtSta, endSta, stops, circles, lineNames, toward, trfLStops, trfCircles, trfLineNames, trfToward, isHidden } = this.state;
    return (
      <div className="trip-planner-view">
        <div className="selections">
          Start: { this.renderSelect(this.select, 'strtSta', 'strtStaId') }
          <br />
          End: { this.renderSelect(this.select, 'endSta', 'endStaId') }    
          <br />

          <button onClick ={this.getDirection.bind(this)}>Go!</button>
        </div>

        <Directions strtSta={ strtSta } 
                    endSta={ endSta } 
                    stops={ stops } 
                    circles={ circles } 
                    lineNames={ lineNames } 
                    toward={ toward } 
                    trfLStops={ trfLStops } 
                    trfCircles={ trfCircles } 
                    trfLineNames={ trfLineNames } 
                    trfToward={ trfToward } 
                    isHidden={ isHidden } 
        />
      </div>
    )
  }
}

export default TripPlanner;