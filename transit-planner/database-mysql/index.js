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

// a function to retrieve all of the lines from the `service_lines` table in the database.
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

//a function that will query the database for all of the stops found along a line, according to that line's `id`.
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
getStops(1, function(err, data) {
  console.log(data);
})

module.exports = {
  getAllLines
};