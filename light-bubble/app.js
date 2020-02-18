const routing = require('./routing.js');

// Start the server on the configured host and port
routing.app.listen(routing.config.port, routing.config.host);
