const TuyaOutlet = require('../tuya_outlet.js');

it('has undefined outlet states before connecting', () => {
  const outlet = new TuyaOutlet({});

  expect(outlet.states).toBeUndefined();
});

it('connects to device on connect', async () => {
  const MockTuyaDevice = jest.fn().mockImplementation(() => {
    return {
      connect: jest.fn().mockResolvedValue(),
      get: jest.fn().mockResolvedValue({dps: {}})
    };
  });

  const device = new MockTuyaDevice();
  const outlet = new TuyaOutlet(device);
  await outlet.connect().catch();

  expect(device.connect).toHaveBeenCalledTimes(1);
});

it('fetches status on connect', async () => {
  const MockTuyaDevice = jest.fn().mockImplementation(() => {
    return {
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
      connect: jest.fn().mockResolvedValue(),
      get: jest.fn().mockRejectedValue(new Error('Test error'))
    };
  });

  const outlet = new TuyaOutlet(new MockTuyaDevice());

  expect.assertions(1);
  await expect(outlet.connect()).rejects.toEqual('Test error');
});

it('returns all outlet states from device status', async () => {
  const MockTuyaDevice = jest.fn().mockImplementation(() => {
    return {
      connect: jest.fn().mockResolvedValue(),
      get: jest.fn().mockResolvedValue({dps: {1: true, 2: false}})
    };
  });

  const outlet = new TuyaOutlet(new MockTuyaDevice());
  await outlet.connect();

  expect(outlet.getStates()).toEqual({1: true, 2: false});
});

it('sets individual outlet states', async () => {
  const MockTuyaDevice = jest.fn().mockImplementation(() => {
    return {
      connect: jest.fn().mockResolvedValue(),
      get: jest.fn().mockResolvedValue({dps: {1: true, 2: false}}),
      set: jest.fn().mockImplementation(options => Promise.resolve(options.set))
    };
  });

  const device = new MockTuyaDevice();
  const outlet = new TuyaOutlet(device);
  await outlet.connect();
  await outlet.setState(1, false);

  expect(device.set).toHaveBeenCalledWith({dps: 1, set: false});
  expect(outlet.getStates()).toEqual({1: false, 2: false});
});

it('rejects if setting state fails', async () => {
  const MockTuyaDevice = jest.fn().mockImplementation(() => {
    return {
      connect: jest.fn().mockResolvedValue(),
      get: jest.fn().mockResolvedValue({dps: {1: true, 2: false}}),
      set: jest.fn().mockRejectedValue('Error')
    };
  });

  const outlet = new TuyaOutlet(new MockTuyaDevice());
  await outlet.connect();

  expect.assertions(1);
  await expect(outlet.setState(1, false)).rejects.toEqual('Error');
});
