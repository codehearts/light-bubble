const ConfigLoader = require('../config_loader');
const fs = require('fs');
let config_file;

jest.mock('fs');

beforeEach(() => {
  config_file = {
    'port': 80,
    'host': '0.0.0.0',
    'theme': 'default',
    'devices': [
      'device-config-1',
      'device-config-2'
    ]
  };

  JSON.parse = jest.fn(() => config_file);
});

it('reads the config file from disk', () => {
  new ConfigLoader('test.json');

  expect(fs.readFileSync).toHaveBeenCalledWith('test.json', 'utf8');
});

it('parses the config file as JSON', () => {
  new ConfigLoader('test.json');

  expect(JSON.parse).toHaveBeenCalledWith(fs.readFileSync.mock.results[0].value);
});

it('provides port value', () => {
  const config = new ConfigLoader('test.json');

  expect(config.port).toBe(80);
});

it('casts port as a base 10 integer', () => {
  config_file.port = '0123';

  const config = new ConfigLoader('test.json');

  expect(config.port).toBe(123);
});

it('throws when port field is missing', () => {
  delete config_file.port;

  expect(() => { new ConfigLoader('test.json'); })
    .toThrow('Field "port" missing from config file');
});

it('provides host value', () => {
  const config = new ConfigLoader('test.json');

  expect(config.host).toBe('0.0.0.0');
});

it('throws when host field is missing', () => {
  delete config_file.host;

  expect(() => { new ConfigLoader('test.json'); })
    .toThrow('Field "host" missing from config file');
});

it('uses default theme when config theme is invalid', () => {
  config_file.theme = 'invalid-theme-name';

  const config = new ConfigLoader('test.json');

  expect(config.theme).toEqual('default');
});

it('accepts "default" theme', () => {
  config_file.theme = 'default';

  const config = new ConfigLoader('test.json');

  expect(config.theme).toEqual('default');
});

it('accepts "non-default" theme, which exists on disk', () => {
  fs.existsSync.mockReturnValue(true);
  config_file.theme = 'non-default';

  const config = new ConfigLoader('test.json');

  expect(config.theme).toEqual('non-default');
  expect(fs.existsSync).toHaveBeenCalledWith('static/theme-non-default');
});

it('converts theme names to lowercase', () => {
  config_file.theme = 'dEfAuLt';

  const config = new ConfigLoader('test.json');

  expect(config.theme).toEqual('default');
});

it('use default theme when theme field is missing', () => {
  delete config_file.theme;

  const config = new ConfigLoader('test.json');

  expect(config.theme).toEqual('default');
});

it('provides all devices in the config', () => {
  const config = new ConfigLoader('test.json');

  expect(config.devices).toEqual(['device-config-1', 'device-config-2']);
});

it('throws when devices field is missing', () => {
  delete config_file.devices;

  expect(() => { new ConfigLoader('test.json'); })
    .toThrow('Field "devices" missing from config file, use [] for 0 devices');
});
