const TuyaDevice = require('tuyapi');

class TuyaSwitch {
  /**
   * Creates a new controller for a Tuya power switch.
   *
   * @param {Object} options
   * @param {String} options.id ID of device
   * @param {String} options.ip IP of device
   * @param {String} options.key encryption key of device
   */
  constructor(options) {
    this.device = new TuyaDevice(options);
    this.switch_statuses = {};

    // Fetch the current status from the switch
    this.device.get({schema: true}).then(status => {
      console.log('Switch status received:', status);
      this.switch_statuses = status.dps;
    });
  }

  /**
   * Turns an individual outlet on or off.
   *
   * @param {Number} [outlet_number] The outlet to set (starting at 1)
   * @param {Boolean} [setting] True to turn on, false to turn off
   * @return {Promise} The promise for setting the device status
   */
  setOutlet(outlet_number, setting) {
    return this.device.set({dps: outlet_number, set: setting}).then(async () => {
      console.log(`Outlet ${outlet_number} set to ${setting}`);

      const device_status = await this.device.get({schema: true})

      console.log('Switch status received:', device_status);
      this.switch_statuses = device_status.dps;
    });
  }

  /**
   * Turns an individual outlet on.
   *
   * @param {Number} [outlet_number] The outlet to turn on (starting at 1)
   * @return {Promise} The promise for setting the device status
   */
  turnOutletOn(outlet_number) {
    return this.setOutlet(outlet_number, true);
  }

  /**
   * Turns an individual outlet off.
   *
   * @param {Number} [outlet_number] The outlet to turn off (starting at 1)
   * @return {Promise} The promise for setting the device status
   */
  turnOutletOff(outlet_number) {
    return this.setOutlet(outlet_number, false);
  }

  /**
   * Toggles the power of an individual outlet.
   *
   * @param {Number} [outlet_number] The outlet to toggle (starting at 1)
   * @return {Promise} The promise for setting the device status
   */
  toggleOutlet(outlet_number) {
    return this.setOutlet(outlet_number, !this.switch_statuses[outlet_number]);
  }

  /**
   * Returns the status of the given outlet.
   *
   * @return {Boolean} The status of the outlet.
   */
  getOutletStatus(outlet_number) {
    return this.switch_statuses[outlet_number];
  }
}

module.exports = TuyaSwitch;
