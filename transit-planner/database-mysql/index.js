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
  // TODO - your code here!

}

module.exports = {
  getAllLines
};