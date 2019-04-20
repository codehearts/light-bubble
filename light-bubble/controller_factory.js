/**
 * Map of device makers to their models, then models to controller classes
 */
const maker_map = new Map([
  ['tuya', new Map([
    ['device', require('tuyapi')],
    ['outlet', require('./controllers/tuya_outlet.js')]
  ])]
]);

/**
 * Creates a controller object for a given device make/model
 * @param {String} make Maker of the device
 * @param {String} model Generic model name (e.g. "outlet", not "ABC123")
 * @param {Object} device_config Any config arguments for the device class
 * @returns {Controller} Controller for the specified device
 * @throws {String} When the device make or model is unsupported
 * @example
 * const outlet = controller_factory('tuya', 'outlet', {id: 123, key: 456})
 */
function controller_factory(make, model, device_config) {
  const model_map = maker_map.get(make);

  if (model_map === undefined) {
    throw `Unknown device maker "${make}"`;
  }

  const Device = model_map.get('device');
  const Controller = model_map.get(model);

  if (Controller === undefined) {
    throw `Unknown model "${model}" for device maker "${make}"`;
  }

  const device = new Device(device_config);
  return new Controller(device);
}

module.exports = controller_factory;
