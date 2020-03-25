const DeviceDirector = require('./device_director.js');
const ConfigLoader = require('./config_loader.js');
const express = require('express');

// Create the router, config parser, and device director
const app = express();
const config = new ConfigLoader('config.json');
const device_director = new DeviceDirector(config.devices);

// Connect all devices asynchronously
device_director.connectAll();

app.use(express.json());

// Endpoint URLs
const api_endpoint = '/api';

// Route for main app
app.get('/', (req, res) => {
  res.render('index', {
    'api_endpoint': api_endpoint,
    'theme': `theme-${config.theme}`,
    'forms': [...device_director.forms.values()] // Convert to array for viw template
  });
});

// Route for API requests
app.post(api_endpoint, async (req, res) =>{
  const fieldPromises = [];

  for (const field in req.body) {
    // Stored as functions to avoid running promises before Promise.all
    fieldPromises.push(() => device_director.setFieldState(field, req.body[field]));
  }

  // Send 200 if all devices are set, 500 with error message otherwise
  await Promise.all(fieldPromises.map(promise => promise()))
    .then(() => res.sendStatus(200))
    .catch(error => res.status(500).send(error.toString()));
});

// Server static assets using view templates
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('static'));

module.exports = {'app': app, 'config': config, 'device_directory': device_director};
