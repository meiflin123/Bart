const mysql = require('mysql');
const mysqlConfig = require('./config.js');

const connection = mysql.createConnection(mysqlConfig);

connection.connect((err) => {
	if (err) {
		console.log('problem connecting to mysql', err);
		return;
	}
	console.log('connected to mysql!')
})

//retrieve all lines from the `service_lines` table in the database.
const getAllLines = function(callback) {
  connection.query('SELECT * FROM service_lines', (err, data) => {
  	if (err) {
  		callback(err);
  		return;
  	}
  	callback(null, data);
  });
 

}

/* test getALLLines function.
getAllLines(function(err, data) {
	console.log(data);
})
*/

//get all stops found along a line, according to that line's `id`.
const getStops = function(lineid, callback) {
  var query = 'SELECT *  FROM stations, stops WHERE stops.line_id = ? AND stations.id = stops.station_id;'
  connection.query(query, lineid, (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, data)
    console.log('database: getStops', data)
  })
}

//test getStops
/*getStops(1, function(err, data) {
  console.log(data);
})*/


// toggle a station to be favorite or to be unfavorite. 
const toggleFavStation = function(stationId, callback) {
  var stationData = 'SELECT * FROM stations WHERE id = ?'
  var makeFav = 'UPDATE stations SET is_favorite = 1 WHERE stations.id = ?';
  var removeFav = 'UPDATE stations SET is_favorite = 0 WHERE stations.id = ?';

  connection.query(stationData, stationId, (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    console.log('station data from database is', data, typeof data, data[0].id, data[0].is_favorite === 0)
  
    if(data[0].is_favorite === 0) {
  
      connection.query(makeFav, stationId, (err, data) => {
        if (err) {
          callback(err);
          return;
        }
        callback(null, true)
      })
    }


    if (data[0].is_favorite === 1) {
      connection.query(removeFav, stationId, (err, data) => {
        if (err) {
          callback(err);
          return;
        }
        callback(null, false)
      })
    }
  })}


// gets all stations 
const getStations = function(callback) {

  connection.query('SELECT * FROM stations', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, data)
  })

}
//get a station's lineid according to that station's `id`.
const getLineId = function(stationId, callback) {
  var query = 'SELECT line_id  FROM stops where station_id = ?'
  connection.query(query, stationId, (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, data)
    console.log('database: lineid', data)
  })
}

const getTransfer = function(lineId, callback) {
  var query = 'SELECT station_id from stops where is_transfer = 1 AND line_id = ?'
  connection.query(query, lineId, (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, data)
    console.log('database: transfer station on this line is', data)
  })

}
module.exports = {
  getAllLines,
  getStops,
  toggleFavStation,
  getStations,
  getLineId,
  getTransfer
};