const controller_factory = require('../controller_factory.js');

jest.mock('../controllers/tuya_outlet.js');
jest.mock('tuyapi');

beforeEach(() => {
  jest.clearAllMocks();
});

it('throws for unknown makers', () => {
  expect(() => controller_factory('unknown', '', {}))
    .toThrow('Unknown device maker "unknown"');
});

it('throws for unknown models', () => {
  expect(() => controller_factory('tuya', 'unknown', {}))
    .toThrow('Unknown model "unknown" for device maker "tuya"');
});

it('creates a tuya outlet', () => {
  const TuyaOutlet = require('../controllers/tuya_outlet.js');
  const TuyaDevice = require('tuyapi');

  const device_config = {id: 123, key: 456};

  expect(controller_factory('tuya', 'outlet', device_config))
    .toBe(TuyaOutlet.mock.instances[0]);
  expect(TuyaDevice).toHaveBeenCalledWith(device_config);
  expect(TuyaOutlet).toHaveBeenCalledWith(TuyaDevice.mock.instances[0]);
});
