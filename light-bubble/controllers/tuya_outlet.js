const TuyaDevice = require('tuyapi');

class TuyaOutlet {
  /**
   * Creates a new controller for a Tuya outlet.
   *
   * @param {Object} options
   * @param {String} options.id ID of device
   * @param {String} options.ip IP of device
   * @param {String} options.key encryption key of device
   */
  constructor(options) {
    console.log('Connecting to Tuya outlet');

    this.device = new TuyaDevice(options);
    this.dps_statuses = {};

    // Fetch the current status from the outlet
    this.device.get({schema: true}).then(device_status => {
      console.log('Outlet status received:', device_status);
      this.dps_statuses = device_status.dps;
    });
  }

  /**
   * Sets the status of an individual dps.
   *
   * @param {Number} [dps] The dps to set (starting at 1)
   * @param {Boolean} [setting] True to enable, false to disable
   * @return {Promise} The promise for setting the dps status
   */
  setDps(dps, setting) {
    return this.device.set({dps: dps, set: setting}).then(async () => {
      console.log(`Outlet dps ${dps} set to ${setting}`);

      const device_status = await this.device.get({schema: true});

      console.log('Outlet status received:', device_status);
      this.dps_statuses = device_status.dps;
    });
  }

  /**
   * Toggles the status of an individual dps.
   *
   * @param {Number} [dps] The dps to toggle (starting at 1)
   * @return {Promise} The promise for setting the dps status
   */
  toggleDps(dps) {
    return this.setDps(dps, !this.dps_statuses[dps]);
  }

  /**
   * Returns the status of the given dps.
   *
   * @param {Number} [dps] The dps to return the status of (starting at 1)
   * @return {Boolean} The status of the dps.
   */
  getDpsStatus(dps) {
    return this.dps_statuses[dps];
  }
}

module.exports = TuyaOutlet;
