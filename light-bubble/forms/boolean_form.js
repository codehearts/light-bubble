/**
 * Represents metadata and fields for a boolean data form
 *
 * @class
 * @param {String} title Name of the form
 * @param {Number} uid Unique identifier for the form
 * @param {Array<Object>} fields
 * Fields for this form, in display order.
 * Each field must have a string `name` field and a `boolean` state field,
 * or `undefined` if the state is unknown
 * @example
 * const form_3_fields = [
 *   {'name': 'Overhead Light', 'state': false},
 *   {'name': 'Bedside Lamp', 'state': true}
 * ]
 * const form_3 = new BooleanForm('Bedroom Outlets', 'form-3', form_3_fields)
 */
class BooleanForm {
  constructor(title, uid, fields) {
    this.uid = uid;
    this.title = title;
    this.fields = [];
    this.field_indices = new Map();
    this.has_error = false;
    this.error_message = '';

    fields.forEach((field, field_number) => {
      const field_data = {
        'title': field.name,
        'state': field.state,
        'uid': `${this.uid}-field-${field_number}`,
        'type': 'boolean'
      };

      // Map the field name to the field's array index
      this.field_indices.set(field_data.uid, field_number);
      this.fields.push(field_data);
    });
  }

  /**
   * Maps a form field's UID to the field object
   *
   * @param {String} uid UID of the field to retrieve
   * @returns {Object} Field object for the UID
   * @example
   * const field = form.getFieldByUid('form-1-field-0');
   */
  getFieldByUid(uid) {
    const index = this.field_indices.get(uid);

    if (index === undefined || index < 0 || index >= this.fields.length) {
      throw `Form "${this.uid}" has no field "${uid}"`;
    }

    return this.fields[index];
  }

  /**
   * Whether the form has an error message
   *
   * @returns {Boolean} True if the form has an error message
   * @example
   * if (form.hasError()) {
   *   displayError(form.getErrorMessage());
   * }
   */
  hasError() {
    return this.error_message !== '';
  }

  /**
   * Sets an error message to associate with this form
   *
   * @param {String} Error message to associate with this form
   * @example
   * device.connect.catch(e => form.setErrorMessage(e))
   */
  setErrorMessage(error_message) {
    this.has_error = true;
    this.error_message = error_message;
  }

  /**
   * The error message associated with this form
   *
   * @returns {String} The error message associated with this form
   * @example
   * if (form.hasError()) {
   *   displayError(form.getErrorMessage());
   * }
   */
  getErrorMessage() {
    return this.error_message;
  }
}

module.exports = BooleanForm;
