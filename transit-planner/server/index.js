const express = require('express');
const bodyParser = require('body-parser');
const getAllLines = require('../database-mysql/index.js').getAllLines;
const getStops = require('../database-mysql/index.js').getStops;
const toggleFavStation = require('../database-mysql/index.js').toggleFavStation;
const getStations = require('../database-mysql/index.js').getStations;
const getLineId = require('../database-mysql/index.js').getLineId;
const getLineColor = require('../database-mysql/index.js').getLineColor;
const getTransfer = require('../database-mysql/index.js').getTransfer;

const db = require('../database-mysql');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


 app.use(express.static(__dirname + '/../react-client/dist'));


// display all lines

app.get('/api/lines', (req, res) => {

  getAllLines((err, data) => {
  	if (err) {
  		res.sendStatus(500).send(err);
  		return;
  	};
  	res.json(data);
  });

});


// display all stops of the line user selects

app.get('/api/lines/:lineId', (req,res) => {

  const lineId = req.params.lineId;
  getStops(lineId, (err, data) => {
    if (err) {
      res.sendStatus(500).send(err);
      return;
    };
    res.json(data);
  });
  
});

//toggle station to be favorite or unfavorite;

app.post('/api/toggleFavStation/:stationId', (req, res) => {

  const stationId = req.params.stationId;
  toggleFavStation(stationId, (err, data) => {
    if(err) {
      res.status(500).send(err);
      return;
    };
    res.json(data);
  });
})

// get all stations 

app.get('/api/stations/', (req, res) => {

  getStations((err, data) => {

    if (err) {
      res.sendStatus(500).send(err)
      return;
    }
    res.json(data)
  })

});

//get a list of line_id for a selected station
app.get('/api/station/:stationId', (req, res) => {
	const stationId = req.params.stationId;
	getLineId(stationId, (err, data) => {
    if (err) {
      res.sendStatus(500).send(err)
      return;
    }
    res.json(data);
  })

})

app.get('/api/transfer/:lineId', (req, res) => {
  const lineId = req.params.lineId;
  getTransfer(lineId, (err, data) => {
    if (err) {
      res.sendStatus(500).send(err)
      return;
    }
    res.json(data);
  })
})

app.get('/api/linecolor/:lineId', (req, res) => {
  const lineId = req.params.lineId;
  console.log('lineId is ', lineId)
  getLineColor(lineId, (err, data) => {
    if (err) {
      res.sendStatus(500).send(err)
      return;
    }
    res.json(data);
  })
})

// Write additional route handlers as needed below!

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
