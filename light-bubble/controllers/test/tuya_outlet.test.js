const TuyaOutlet = require('../tuya_outlet.js');

jest.useFakeTimers();

it('squashes tuya outlet error events', () => {
  const device = {
    on: jest.fn(),
  };

  new TuyaOutlet(device);

  // Ensure the error callback does not throw
  expect(device.on).toHaveBeenNthCalledWith(1, 'error', expect.any(Function));
  expect(device.on.mock.calls[0][1]).not.toThrow();
});

it('has undefined outlet states before connecting', () => {
  const outlet = new TuyaOutlet({ on: jest.fn() });

  expect(outlet.getStates()).toBeUndefined();
});

it('reconnects on disconnect', () => {
  const device = {
    on: jest.fn(),
    connect: jest.fn().mockResolvedValue(),
  };

  // When the "disconnected" event is registered, fire it immediately
  device.on.mockImplementation((event_name, callback) => {
    if (event_name === 'disconnected') { callback(); }
  });

  // Constructing an outlet will set and fire the "disconnected" event handler
  new TuyaOutlet(device);

  jest.runOnlyPendingTimers();

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(device.connect).toHaveBeenCalledTimes(1);
});

it('does nothing if reconnect on disconnect fails', () => {
  const device = {
    on: jest.fn(),
    connect: jest.fn().mockRejectedValue(),
  };

  // When the "disconnected" event is registered, fire it immediately
  device.on.mockImplementation((event_name, callback) => {
    if (event_name === 'disconnected') { callback(); }
  });

  // Constructing an outlet will set and fire the "disconnected" event handler
  new TuyaOutlet(device);

  jest.runOnlyPendingTimers();

  expect(setTimeout).toHaveBeenCalledTimes(2);
  expect(device.connect).toHaveBeenCalledTimes(1);
});

it('connects to device on connect', async () => {
  const MockTuyaDevice = jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      connect: jest.fn().mockResolvedValue(),
      get: jest.fn().mockResolvedValue({dps: {}})
    };
  });

  const device = new MockTuyaDevice();
  const outlet = new TuyaOutlet(device);
  await outlet.connect().catch();

  jest.runOnlyPendingTimers();

  expect(setTimeout).toHaveBeenCalledTimes(2);
  expect(device.connect).toHaveBeenCalledTimes(1);
});

it('fetches status on connect', async () => {
  const MockTuyaDevice = jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      connect: jest.fn().mockResolvedValue(),
      get: jest.fn().mockResolvedValue({dps: {}})
    };
  });

  const device = new MockTuyaDevice();
  const outlet = new TuyaOutlet(device);
  await outlet.connect().catch();

  expect(device.get).toHaveBeenCalledWith({schema: true});
});

it('disconnects from device on disconnect', async () => {
  const MockTuyaDevice = jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      connect: jest.fn().mockResolvedValue(),
      get: jest.fn().mockResolvedValue({dps: {}}),
      disconnect: jest.fn().mockResolvedValue(),
    };
  });

  const device = new MockTuyaDevice();
  const outlet = new TuyaOutlet(device);
  await outlet.connect().catch();
  await outlet.disconnect().catch();

  expect(device.disconnect).toHaveBeenCalledTimes(1);
});

it('resets status on disconnect', async () => {
  const MockTuyaDevice = jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      connect: jest.fn().mockResolvedValue(),
      get: jest.fn().mockResolvedValue({dps: {}}),
      disconnect: jest.fn().mockResolvedValue(),
    };
  });

  const device = new MockTuyaDevice();
  const outlet = new TuyaOutlet(device);
  await outlet.connect().catch();
  await outlet.disconnect().catch();

  expect(device.status).toBeUndefined();
});

it('rejects with error message if connection fails', async () => {
  const MockTuyaDevice = jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      connect: jest.fn().mockResolvedValue(),
      get: jest.fn().mockRejectedValue(new Error('Test error'))
    };
  });

  const outlet = new TuyaOutlet(new MockTuyaDevice());

  expect.assertions(1);
  await expect(outlet.connect()).rejects.toEqual('Test error');
});

it('returns all outlet states with 0-based indexing from device status', async () => {
  const MockTuyaDevice = jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      connect: jest.fn().mockResolvedValue(),
      get: jest.fn().mockResolvedValue({dps: {1: true, 2: false}})
    };
  });

  const outlet = new TuyaOutlet(new MockTuyaDevice());
  await outlet.connect();

  expect(outlet.getStates()).toEqual([true, false]);
});

it('sets individual outlet states with 0-based indexing', async () => {
  const MockTuyaDevice = jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      connect: jest.fn().mockResolvedValue(),
      get: jest.fn().mockResolvedValue({dps: {1: true, 2: false}}),
      set: jest.fn().mockImplementation(options => {
        let device_status = {dps: {1: options.set, 2: false}};
        device_status.dps[options.dps] = options.set;
        return Promise.resolve(device_status);
      })
    };
  });

  const device = new MockTuyaDevice();
  const outlet = new TuyaOutlet(device);
  await outlet.connect();
  await outlet.setState(0, false);

  expect(device.set).toHaveBeenCalledWith({dps: '1', set: false});
  expect(outlet.getStates()).toEqual([false, false]);
});

it('rejects if setting state fails', async () => {
  const MockTuyaDevice = jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      connect: jest.fn().mockResolvedValue(),
      get: jest.fn().mockResolvedValue({dps: {1: true, 2: false}}),
      set: jest.fn().mockRejectedValue('Error')
    };
  });

  const outlet = new TuyaOutlet(new MockTuyaDevice());
  await outlet.connect();

  expect.assertions(1);
  await expect(outlet.setState(0, false)).rejects.toEqual('Error');
});
