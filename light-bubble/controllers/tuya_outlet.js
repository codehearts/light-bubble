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
      this.states = device_status.dps;
    } catch (e) {
      return Promise.reject(e.message);
    }
  }

  /**
   * Returns the current outlet states for the device
   * @example
   * const states = outlet.getOutletStates()
   * @returns {Object}
   * Object of numeric outlet indices to boolean states, starting from index 1
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
    this.states[index] = await this.device.set({dps: index, set: state});
  }
}

module.exports = TuyaOutlet;
