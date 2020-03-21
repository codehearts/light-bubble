const routing = require('./routing.js');

// Start the server on the configured host and port
const server = routing.app.listen(routing.config.port, routing.config.host);

// Gracefully disconnect all devices on sigterm
process.on('SIGTERM', () => {
  server.close(async () => {
    console.log('Disconnecting all devices');
    await routing.device_director.disconnectAll();
    console.log('All devices disconnected');
    console.log('light-bubble terminated successfully');
  });
});
