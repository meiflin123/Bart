import React from 'react';
import $ from 'jquery';
import axios from 'axios';


class Station extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // station status is favorite?
      station: this.props.station.is_favorite
    }
    this.toggleFavStation = this.toggleFavStation.bind(this);
  }


// toggleFavStation would toggle the is_favorite status of a station in the database. 
	toggleFavStation(event) {

	  console.log('stationId is ', event.target.value)
	  const stationId = event.target.value
	  axios.post('/api/toggleFavStation/' + stationId)
  
      .then((response) => {
        this.setState({
          station: response.data
        })
        
      })
          
      .catch((error)=>{
         console.log(error);
      })
    }

  render() {
    return (
      
        <div className="station">
           <li onClick = {this.toggleFavStation} value = {this.props.station.station_id}>
           {this.state.station 
             ? this.props.station.name + '  ⭐️' 
             : this.props.station.name

           }
           </li>
          
        
          
        </div>
   
    );

  }
}


export default Station;