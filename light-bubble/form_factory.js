/**
 * Map of device makers to their models, then models to form classes
 */
const maker_map = new Map([
  ['tuya', new Map([
    ['outlet', require('./forms/boolean_form.js')]
  ])]
]);

/**
 * Creates a form object for a given device make/model
 * @param {String} make Maker of the device
 * @param {String} model Generic model name (e.g. "outlet", not "ABC123")
 * @param {String} title Title for this device's user interface
 * @param {String} uid Unique identifier for the form
 * @param {Array<String>} fields Name for each field, in display order
 * @returns {Form} Form containing the given fields
 * @throws {String} When the device make or model is unsupported
 * @example
 * const fields = ['Overhead Light', 'Bedside Lamp']
 * const form = form_factory('tuya', 'outlet', 'Bedroom', 'form-3', fields)
 */
function form_factory(make, model, title, uid, fields) {
  const model_map = maker_map.get(make);

  if (model_map === undefined) {
    throw `Unknown device maker "${make}"`;
  }

  const Form = model_map.get(model);

  if (Form === undefined) {
    throw `Unknown model "${model}" for device maker "${make}"`;
  }

  const field_definitions = [];

  for (const field of fields) {
    // States are undefined until the device has connected
    field_definitions.push({'name': field, 'state': undefined});
  }

  return new Form(title, uid, field_definitions);
}

module.exports = form_factory;
