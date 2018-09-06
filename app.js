const TuyaSwitch = require('./tuya_switch.js')
const express = require('express');
const app = express();

const port = 8080;
const host = '0.0.0.0';

const device = new TuyaSwitch({
  id: 'xxxxxxxxxxxxxxxxxxxx',
  key: 'xxxxxxxxxxxxxxxx',
  ip: 'xxxxxxxxxxxx'});

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile('index.html', {root: './static'})
});

app.post('/api', async (req, res) =>{
  let response = {};

  if (req.body.dps) {
    const dps = parseInt(req.body.dps, 10);

    console.log(`Toggling dps ${dps}`);
    await device.toggleOutlet(dps);

    response[dps] = device.getOutletStatus(dps);
  }

  console.log('API call complete');

  res.send(response);
});

app.use(express.static('static'));

app.listen(port, host);
