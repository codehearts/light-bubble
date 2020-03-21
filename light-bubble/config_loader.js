const fs = require('fs');

// Array of valid theem names, all lowercase
const valid_themes = ['default', 'catseye'];

/**
 * Reads and parses a light-bubble config file from disk
 * 
 * The config is a JSON file this is then parsed into application-usable values
 *
 * @class
 * @throws {String} When a config field is missing or invalid
 * @example
 * const config = new ConfigLoader('path/to/config.json')
 */
class ConfigLoader {
  constructor(config_path) {
    const config = JSON.parse(fs.readFileSync(config_path, 'utf8'));

    // Read port from config

    if (!Object.prototype.hasOwnProperty.call(config, 'port')) {
      throw 'Field "port" missing from config file';
    }

    this.port = parseInt(config.port, 10);

    // Read host from config

    if (!Object.prototype.hasOwnProperty.call(config, 'host')) {
      throw 'Field "host" missing from config file';
    }

    this.host = config.host;

    // Read devices from config

    if (!Object.prototype.hasOwnProperty.call(config, 'devices')) {
      throw 'Field "devices" missing from config file, use [] for 0 devices';
    }

    this.devices = config.devices;

    // Read theme from config

    this.theme = 'default';

    if (Object.prototype.hasOwnProperty.call(config, 'theme')) {
      const config_theme = config.theme.toLowerCase();

      // Set the theme if it's valid
      if (valid_themes.includes(config_theme)) {
        this.theme = config_theme;
      }
    }
  }
}

module.exports = ConfigLoader;
