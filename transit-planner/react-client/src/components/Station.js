import React from 'react';
import $ from 'jquery';
import axios from 'axios';


class Station extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // station status is favorite?
      station: false
    }
    this.toggleFavStation = this.toggleFavStation.bind(this);
  }



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


  componentDidMount (){
    this.setState({
      station: this.props.station.is_favorite
    })
  }

  render() {
    return (
      
        <div className="station">
           <li onClick = {this.toggleFavStation} value = {this.props.station.station_id}>
           {this.state.station 
             ? <b>{this.props.station.name}</b>
             : this.props.station.name

           }
           </li>
          
        
          
        </div>
   
    );

  }
}


export default Station;