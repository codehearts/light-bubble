const controller_factory = require('./controller_factory.js');
const form_factory = require('./form_factory.js');

/**
 * Director for creating and managing multiple devices and user interface forms
 *
 * @class
 * @param {Object} device_configs
 * Configuration for all devices the director will create and manage
 * @example
 * const device_configs = [
 *   {
 *     "make": "tuya",
 *     "model": "outlet",
 *     "config": {
 *       "id": 123,
 *       "key": 456
 *     },
 *     "title": "Bedroom Lights",
 *     "fields": [
 *       "Overhead Light",
 *       "Bedside Lamp"
 *     ]
 *   }
 * ]
 * const device_director = new DeviceDirector(device_configs)
 */
class DeviceDirector {
  constructor(device_configs) {
    this.controllers = new Map();
    this.forms = new Map();

    this.field_uid_map = new Map();

    let device_index = 1;
    for (const device of device_configs) {
      const uid = 'form-' + device_index;

      const controller = controller_factory(
        device.make, device.model, device.config);

      const form = form_factory(
        device.make, device.model, device.title, uid, device.fields);

      this.controllers.set(uid, controller);
      this.forms.set(uid, form);

      // Map field UIDs to controller and device state indices
      form.fields.forEach((field, index) => {
        this.field_uid_map.set(field.uid, {'index': index, 'controller': controller});
      });

      device_index += 1;
    }
  }

  /**
   * Connects all managed controllers to their devices
   * @example
   * device_director = new DeviceDirector(devices)
   * device_director.connectAll()
   */
  connectAll() {
    this.controllers.forEach((controller, uid) => {
      controller.connect()
        .then(() => {
          // Form states are updated once the device has connected
          this.forms.get(uid).fields.forEach((field, index) => {
            field.state = controller.getStates()[index];
          });
        })
        .catch(e => {
          this.forms.get(uid).setErrorMessage(e);
        });
    });
  }

  /**
   * Disconnects all managed controllers from their devices
   * @example
   * device_director = new DeviceDirector(devices)
   * device_director.connectAll() // Connect them all
   * device_director.disconnectAll() // Now disconnect them
   */
  disconnectAll() {
    this.controllers.forEach((controller, uid) => {
      controller.disconnect().catch(e => {
        this.forms.get(uid).setErrorMessage(e);
      });
    });
  }

  /**
   * Sets the state associated with the field's UID
   *
   * @param {String} field_uid UID of the field to set
   * @param {Number} state State the field should be set to
   * @returns {Promise} No value on resolution, or device error on rejection
   * @example
   * device_director.setFieldState(request.field_uid, request.state)
   */
  async setFieldState(field_uid, state) {
    const field_metadata = this.field_uid_map.get(field_uid);

    if (field_metadata === undefined) {
      throw `Unable to set state of unknown form field "${field_uid}"`;
    }

    await field_metadata.controller.setState(field_metadata.index, state);
  }
}

module.exports = DeviceDirector;
