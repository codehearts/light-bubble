const TuyaSwitch = require('./tuya_switch.js')
const express = require('express');
const app = express();

const port = 8080;
const host = '0.0.0.0';

device = new TuyaSwitch({
  id: 'xxxxxxxxxxxxxxxxxxxx',
  key: 'xxxxxxxxxxxxxxxx',
  ip: 'xxxxxxxxxxxx'});

app.get('/', (req, res) => {
  if (req.query.outlet) {
    console.log(`Toggling outlet ${req.query.outlet}`);
    device.toggleOutlet(req.query.outlet);
  }

  res.sendFile('index.html', {root: './static'})
});

app.use(express.static('static'));

app.listen(port, host);
