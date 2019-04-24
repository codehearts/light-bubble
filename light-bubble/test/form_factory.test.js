const form_factory = require('../form_factory.js');

jest.mock('../forms/boolean_form.js');

beforeEach(() => {
  jest.clearAllMocks();
});

it('throws for unknown makers', () => {
  expect(() => form_factory('unknown', '', '', '', []))
    .toThrow('Unknown device maker "unknown"');
});

it('throws for unknown models', () => {
  expect(() => form_factory('tuya', 'unknown', '', '', []))
    .toThrow('Unknown model "unknown" for device maker "tuya"');
});

it('creates a boolean form for tuya outlets', () => {
  const BooleanForm = require('../forms/boolean_form.js');

  const fields = ['Overhead Lights', 'Bedside Lamp'];
  const expected_fields = [
    {'name': fields[0], 'state': undefined},
    {'name': fields[1], 'state': undefined}
  ];

  expect(form_factory('tuya', 'outlet', 'Bedroom', 'form-3', fields))
    .toBe(BooleanForm.mock.instances[0]);
  expect(BooleanForm).toHaveBeenCalledWith('Bedroom', 'form-3', expected_fields);
});
