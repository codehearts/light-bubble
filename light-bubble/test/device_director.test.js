const DeviceDirector = require('../device_director.js');

jest.mock('../controller_factory.js');
jest.mock('../form_factory.js');

const controller_factory = require('../controller_factory.js');
const form_factory = require('../form_factory.js');

let device_director;
const devices = [
  {
    'make': 'make 1',
    'model': 'model 1',
    'config': {'id': 123},
    'title': 'title 1',
    'fields': ['field 1.1', 'field 1.2']
  },
  {
    'make': 'make 2',
    'model': 'model 2',
    'config': {'id': 456},
    'title': 'title 2',
    'fields': ['field 2.1', 'field 2.2']
  }
];

beforeEach(() => {
  jest.clearAllMocks();

  controller_factory.mockImplementation(() => {
    return {
      'connect': jest.fn().mockResolvedValue(),
      'setState': jest.fn(),
      'states': [true, false]
    };
  });

  // Stub the field UIDs for each form_factory call
  form_factory
    .mockReturnValueOnce({
      'fields': [
        {'uid': 'form-1-field-0'},
        {'uid': 'form-1-field-1'}
      ],
      'setErrorMessage': jest.fn()
    })
    .mockReturnValueOnce({
      'fields': [
        {'uid': 'form-2-field-0'},
        {'uid': 'form-2-field-1'}
      ],
      'setErrorMessage': jest.fn()
    });

  device_director = new DeviceDirector(devices);
});

it('creates a controller for each config in order', () => {
  expect(controller_factory)
    .toHaveBeenNthCalledWith(1, devices[0].make, devices[0].model, devices[0].config);

  expect(controller_factory)
    .toHaveBeenNthCalledWith(2, devices[1].make, devices[1].model, devices[1].config);
});

it('stores controllers in config order', () => {
  const values = device_director.controllers.values();

  expect(values.next().value).toBe(controller_factory.mock.results[0].value);

  expect(values.next().value).toBe(controller_factory.mock.results[1].value);
});

it('maps UIDs to controllers', () => {
  expect(device_director.controllers.get('form-1'))
    .toBe(controller_factory.mock.results[0].value);

  expect(device_director.controllers.get('form-2'))
    .toBe(controller_factory.mock.results[1].value);
});

it('creates a form for each config in order with a unique id', () => {
  expect(form_factory)
    .toHaveBeenNthCalledWith(
      1, devices[0].make, devices[0].model, devices[0].title, 'form-1', devices[0].fields);

  expect(form_factory)
    .toHaveBeenNthCalledWith(
      2, devices[1].make, devices[1].model, devices[1].title, 'form-2', devices[1].fields);
});

it('stores forms in config order', () => {
  const values = device_director.forms.values();

  expect(values.next().value).toBe(form_factory.mock.results[0].value);

  expect(values.next().value).toBe(form_factory.mock.results[1].value);
});

it('connects all devices', () => {
  device_director.connectAll();

  expect(device_director.controllers.get('form-1').connect).toHaveBeenCalled();
  expect(device_director.controllers.get('form-2').connect).toHaveBeenCalled();
});

it('sets form field states once the device connects', async () => {
  await device_director.connectAll();

  expect(device_director.forms.get('form-1').fields[0].state).toBe(true);
  expect(device_director.forms.get('form-1').fields[1].state).toBe(false);
  expect(device_director.forms.get('form-2').fields[0].state).toBe(true);
  expect(device_director.forms.get('form-2').fields[1].state).toBe(false);
});

it('sets form error message if device fails to connect', async () => {
  controller_factory.mock.results[0].value.connect
    .mockReset().mockRejectedValueOnce('Error 1');
  controller_factory.mock.results[1].value.connect
    .mockReset().mockRejectedValueOnce('Error 2');

  await device_director.connectAll();
  await controller_factory.mock.results[0].value.connect;
  await controller_factory.mock.results[1].value.connect;

  expect(device_director.forms.get('form-1').setErrorMessage)
    .toHaveBeenCalledWith('Error 1');
  expect(device_director.forms.get('form-2').setErrorMessage)
    .toHaveBeenCalledWith('Error 2');
});

it('maps UIDs to forms', () => {
  expect(device_director.forms.get('form-1'))
    .toBe(form_factory.mock.results[0].value);

  expect(device_director.forms.get('form-2'))
    .toBe(form_factory.mock.results[1].value);
});

it('sets controller state from field UID', () => {
  device_director.setFieldState('form-1-field-0', true);
  expect(controller_factory.mock.results[0].value.setState)
    .toHaveBeenCalledWith(0, true);

  device_director.setFieldState('form-1-field-1', false);
  expect(controller_factory.mock.results[0].value.setState)
    .toHaveBeenCalledWith(1, false);

  device_director.setFieldState('form-2-field-0', false);
  expect(controller_factory.mock.results[1].value.setState)
    .toHaveBeenCalledWith(0, false);

  device_director.setFieldState('form-2-field-1', true);
  expect(controller_factory.mock.results[1].value.setState)
    .toHaveBeenCalledWith(1, true);
});

it('throws when setting unknown field uid', async () => {
  await expect(device_director.setFieldState('unknown', true))
    .rejects.toEqual('Unable to set state of unknown form field "unknown"');
});
