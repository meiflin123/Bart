const express = require('express');
const bodyParser = require('body-parser');
const getAllLines = require('../database-mysql/index.js').getAllLines;

const db = require('../database-mysql');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


 app.use(express.static(__dirname + '/../react-client/dist'));


app.get('/api/lines', (req, res) => {
  getAllLines((err, data) => {
  	if (err) {
  		res.sendStatus(500).send(err)
  		return;
  	}
  	res.json(data)
  })

});

// Write additional route handlers as needed below!

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
