import React from 'react';
import axios from 'axios';

class Station extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // is station favorite?
      station: this.props.station.is_favorite
    };

    this.toggleFavStation = this.toggleFavStation.bind(this);
  }


// toggleFavStation toggle the is_favorite status of a station from database. 
	toggleFavStation(e) {

	  console.log('stationId is ', e.target.value);
	  const stationId = e.target.value;

	  axios.post('/api/toggleFavStation/' + stationId)
      .then(response => {
        this.setState({ station: response.data });
      })     
      .catch(error => {
         console.log(error);
      });
    };

  render() {
    return (

        <div className="station">
           <li onClick = { this.toggleFavStation } value = { this.props.station.station_id }>
           {
            this.state.station 
             ? this.props.station.name + '  ⭐️' 
             : this.props.station.name

           }
           </li>     
        </div> 
    );
  };
};


export default Station;