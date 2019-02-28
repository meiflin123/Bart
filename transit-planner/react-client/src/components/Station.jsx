import React from 'react';
import axios from 'axios';

class Station extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      favStation: this.props.station.is_favorite // a boolean 
    };

    this.toggleFavStation = this.toggleFavStation.bind(this);
  };

// toggle the is_favorite status of a station in database. 
	toggleFavStation(e) {
	  const stationId = e.target.value;
	  axios.post('/api/toggleFavStation/' + stationId)
      .then(response => this.setState({ favStation: response.data }))     
      .catch(error => console.log(error))
  };

  // render station name followed with a star if favorite, no star if not favorite. 
  render() {
    return (
        <div className="station">
           <li onClick = { this.toggleFavStation } value = { this.props.station.station_id }>
           {
            this.state.favStation 
             ? this.props.station.name + '  ⭐️' 
             : this.props.station.name

           }
           </li>     
        </div> 
    );
  };
};


export default Station;