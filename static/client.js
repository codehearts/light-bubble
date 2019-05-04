/**
 * Client-side interface for controlling light-bubble
 * 
 * Creating an instance of this class has the side effect of registering event
 * listeners, removing the need to track instances of this class
 *
 * @class
 * @example
 * new LightBubble()
 */
class LightBubble {
  constructor() {
    // Attach event listeners for checkboxes to update controller states
    document.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
      checkbox.addEventListener('input', () => {
        const new_value = checkbox.checked;
        const new_state = { [checkbox.name]: new_value };

        // Checkboxes are changed once the server responds with an ok status
        checkbox.checked = !new_value;

        // Make the API request to set the controller state
        this.setControllerState(checkbox, new_state)
          .then(response => {
            if (response.ok) {
              checkbox.checked = new_value;
            }
          })
          .catch(() => { });
      });
    });
  }

  /**
   * Makes an API request to the server to set a controller's state
   *
   * The input element is given an `awaiting-response` class during the request
   * If the request fails, an error is displayed to the user
   * 
   * @param {HTMLElement} input The element which triggered the state change
   * @param {Object} state Mapping of element name attributes to values to set
   * @returns {Promise<Response>} Response on resolution, nothing on rejection
   * @example
   * const light_bubble = new LightBubble()
   * const input = document.querySelector('input[name=field-1]')
   * light_bubble.setControllerState(input, { 'field-1': true })
   *   .then(response => {
   *     if (response.ok) {
   *       input.checked = true;
   *     }
   *   })
   */
  setControllerState(input, state) {
    const form = input.closest('form');

    const request = {
      'method': form.method,
      'headers': { 'Content-Type': 'application/json' },
      'body': JSON.stringify(state)
    };

    input.classList.add('awaiting-response');

    return fetch(form.action, request)
      .then(response => {
        input.classList.remove('awaiting-response');
        return response;
      })
      .catch(error => {
        input.classList.remove('awaiting-response');

        this.displayError(error);
      });
  }

  /**
   * Injects an error message element into the DOM to display to the user
   *
   * @param {String} error_message Error message to display to the user
   * @example
   * light_bubble.displayError('Failed to connect to device')
   */
  displayError(error_message) {
    const error_element = document.createElement('p');
    error_element.classList.add('error-message');
    error_element.innerText = error_message;

    document.body.appendChild(error_element);
  }
}

new LightBubble();
