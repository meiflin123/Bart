const express = require('express');
const bodyParser = require('body-parser');
const getAllLines = require('../database-mysql/index.js').getAllLines;
const getStops = require('../database-mysql/index.js').getStops;
const toggleFavStation = require('../database-mysql/index.js').toggleFavStation;
const getStations = require('../database-mysql/index.js').getStations;
const getLineId = require('../database-mysql/index.js').getLineId;
const getTransfer = require('../database-mysql/index.js').getTransfer;

const db = require('../database-mysql');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


 app.use(express.static(__dirname + '/../react-client/dist'));


// get all lines

app.get('/api/lines', (req, res) => {
  getAllLines((err, data) => {
  	if (err) {
  		res.sendStatus(500).send(err)
  		return;
  	}
  	console.log('server retrieve data:',  data);

  	res.json((data));
  })

});

// get user selected line's all stops 
app.get('/api/lines/:lineid', (req,res) => {
  //console.log(req.params.lineid)
  const lineid = req.params.lineid;
  getStops(lineid, (err, data) => {
    if (err) {
      res.sendStatus(500).send(err)
      return;
    }
    res.json(data);
  })
  
})

//toggle station to be favorite or unfavorite
app.post('/api/toggleFavStation/:stationId', (req, res) => {
  const stationId = req.params.stationId;

 
  toggleFavStation(stationId, (err, data) => {
    if(err) {
      return res.status(500).send(err);
    }

    res.json(data);


  })


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

// Write additional route handlers as needed below!

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
