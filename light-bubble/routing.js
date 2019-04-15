const TuyaOutlet = require('./tuya_outlet.js')
const express = require('express');
const app = express();

const port = 8080;
const host = '0.0.0.0';

const device = new TuyaOutlet({
  id: 'xxxxxxxxxxxxxxxxxxxx',
  key: 'xxxxxxxxxxxxxxxx',
  ip: 'xxxxxxxxxxxx'});

app.use(express.json());

app.get('/', (req, res) => {
  res.render('index', {
    dps_statuses: device.dps_statuses
  });
});

app.post('/api', async (req, res) =>{
  let response = {};

  if (req.body.dps) {
    const dps = parseInt(req.body.dps, 10);

    await device.toggleDps(dps);
    response[dps] = device.getDpsStatus(dps);
  }

  console.log('API call complete');

  res.send(response);
});

app.set('views', './views')
app.set('view engine', 'pug')
app.use(express.static('static'));

app.listen(port, host);
