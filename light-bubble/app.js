const routing = require('./routing.js');

// Start the server on the configured host and port
const server = routing.app.listen(routing.config.port, routing.config.host);

// Gracefully disconnect all devices on sigterm
process.on('SIGTERM', () => {
  server.close(async () => {
    await routing.device_director.disconnectAll();
  });
});
