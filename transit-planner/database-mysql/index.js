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

module.exports = {
  getAllLines
};