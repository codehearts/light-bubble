const BooleanForm = require('../boolean_form.js');

it('sets its title on construction', () => {
  const form = new BooleanForm('Testing Title', 'UID', []);
  expect(form.title).toEqual('Testing Title');
});

it('sets its uid on construction', () => {
  const form = new BooleanForm('Title', 'form-1', []);
  expect(form.uid).toEqual('form-1');
});

it('sets fields titles correctly in the given order', () => {
  const fields = [
    {'name': 'field 1', 'state': false},
    {'name': 'field 2', 'state': true}
  ];
  const form = new BooleanForm('Title', 'UID', fields);

  expect(form.fields.map(field => field.title)).toEqual(['field 1', 'field 2']);
});

it('sets field states correctly in the given order', () => {
  const fields = [
    {'name': 'field 1', 'state': false},
    {'name': 'field 2', 'state': true}
  ];
  const form = new BooleanForm('Title', 'UID', fields);

  expect(form.fields.map(field => field.state)).toEqual([false, true]);
});

it('sets field UIDs correctly in the given order', () => {
  const fields = [
    {'name': 'field 1', 'state': false},
    {'name': 'field 2', 'state': true}
  ];
  const form = new BooleanForm('Title', 'form-1', fields);

  expect(form.fields.map(field => field.uid)).toEqual(['form-1-field-0', 'form-1-field-1']);
});

it('sets all field types to boolean', () => {
  const fields = [
    {'name': 'field 1', 'state': false},
    {'name': 'field 2', 'state': true}
  ];
  const form = new BooleanForm('Title', 'UID', fields);

  expect(form.fields.map(field => field.type)).toEqual(['boolean', 'boolean']);
});

it('maps field UIDs to field indices', () => {
  const fields = [
    {'name': 'field 1', 'state': false},
    {'name': 'field 2', 'state': true}
  ];
  const form = new BooleanForm('Title', 'form-1', fields);

  expect(form.getFieldByUid('form-1-field-0').title).toEqual('field 1');
  expect(form.getFieldByUid('form-1-field-1').title).toEqual('field 2');
});

it('throws when mapping invalid UIDs', () => {
  const fields = [
    {'name': 'field 1', 'state': false},
    {'name': 'field 2', 'state': true}
  ];
  const form = new BooleanForm('Title', 'form-1', fields);

  expect(() => form.getFieldByUid('form-1-field-999'))
    .toThrow('Form "form-1" has no field "form-1-field-999"');
});

it('has no error without error message', () => {
  const form = new BooleanForm('Title', 'form-1', []);

  expect(form.hasError()).toBe(false);
  expect(form.has_error).toBe(false);
});

it('has error when error message is set', () => {
  const form = new BooleanForm('Title', 'form-1', []);

  form.setErrorMessage('Test error');

  expect(form.hasError()).toBe(true);
  expect(form.has_error).toBe(true);
});

it('returns set error message', () => {
  const form = new BooleanForm('Title', 'form-1', []);

  form.setErrorMessage('Test error');

  expect(form.getErrorMessage()).toEqual('Test error');
});
