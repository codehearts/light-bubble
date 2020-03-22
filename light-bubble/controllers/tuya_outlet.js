/**
 * Represents a Tuya wireless power outlet/strip
 *
 * This class wraps a `TuyaDevice` from the `tuyapi` package and provides an
 * interface to control the device as a power outlet/strip
 * @class
 * @param {TuyaDevice} device Tuya device to control as an outlet
 * @example
 * const outlet = new TuyaOutlet(yourTuyaDevice)
 */
class TuyaOutlet {
  constructor(device) {
    this.device = device;
    this.states = undefined;

    device.on('error', () => {});
  }

  /**
   * Connects and fetches the initial device status
   * This must be called before using the object
   * @returns {Promise} No value on resolution, or device error on rejection
   * @example
   * const outlet = new TuyaOutlet(device)
   * await outlet.connect().catch(console.error) // Outlet is ready to use now
   */
  async connect() {
    try {
      await this.device.connect();

      const device_status = await this.device.get({schema: true});
      this.index_dps_map = Object.keys(device_status.dps);
      this.states = this.index_dps_map.map(dps_index => device_status.dps[dps_index]);
    } catch (e) {
      return Promise.reject(e.message);
    }
  }

  /**
   * Disconnects the device
   * @returns {Promise} No value on resolution
   * @example
   * const outlet = new TuyaOutlet(device)
   * await outlet.connect().catch(console.error) // Outlet connected
   * await outlet.disconnect(); // Outlet disconnected
   */
  async disconnect() {
    this.device.disconnect();
    this.states = undefined;
  }

  /**
   * Returns the current outlet states for the device, in order of the config
   * @example
   * const states = outlet.getOutletStates()
   * @returns {Array}
   * Array of boolean states
   */
  getStates() {
    return this.states;
  }

  /**
   * Sets the state of an individual outlet
   * @param {Number} index Index of the outlet to set, starting at 1
   * @param {Boolean} setting True to turn on, false to turn off
   * @returns {Promise} No value on resolution, or device error on rejection
   * @example
   * await outlet.setState(1, true).catch(console.error)
   */
  async setState(index, state) {
    const dps_index = this.index_dps_map[index];
    const device_status = await this.device.set({dps: dps_index, set: state});
    this.states = this.index_dps_map.map(dps_index => device_status.dps[dps_index]);
  }
}

module.exports = TuyaOutlet;
