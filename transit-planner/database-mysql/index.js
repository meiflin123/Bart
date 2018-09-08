const mysql = require('mysql');
const mysqlConfig = require('./config.js');

const connection = mysql.createConnection(mysqlConfig);

const getAllLines = function(callback) {
  // TODO - your code here!

}

module.exports = {
  getAllLines
};