const checkboxForm = `
  <form action="/action" method="test_method">
    <fieldset>
      <label>
        <input type="checkbox" name="test_checkbox">
      </label>
    </fieldset>
  </form>`;

beforeEach(() => {
  document.body.innerHTML = checkboxForm;
  global.fetch = jest.fn();
  jest.resetModules();
});

it('uses parent form action and method for API requests', () => {
  global.fetch.mockResolvedValue({ 'ok': true });

  require('../client.js'); // Module has side-effects

  document.querySelector('input').click();

  expect(global.fetch.mock.calls[0][0])
    .toBe(document.querySelector('form').action);

  expect(global.fetch.mock.calls[0][1].method)
    .toBe(document.querySelector('form').method);
});

it('adds awaiting-response class to input during network request', () => {
  // Network request remains pending
  global.fetch.mockImplementation(() => new Promise(() => { }));

  require('../client.js'); // Module has side-effects

  const input = document.querySelector('input');
  input.click();

  expect(input.classList).toContain('awaiting-response');
});

it('removes awaiting-response class from input after failed fetch', async () => {
  const input = document.querySelector('input');

  expect.assertions(2);
  global.fetch.mockRejectedValue();

  require('../client.js'); // Module has side-effects
  input.click();

  await expect(global.fetch.mock.results[0].value).rejects.toBe();
  expect(input.classList).not.toContain('awaiting-response');
});

it('removes awaiting-response class from input after ok fetch', async () => {
  const input = document.querySelector('input');

  expect.assertions(2);
  global.fetch.mockResolvedValue({ 'ok': true });

  require('../client.js'); // Module has side-effects
  input.click();

  await expect(global.fetch.mock.results[0].value).resolves.toEqual({ 'ok': true });
  expect(input.classList).not.toContain('awaiting-response');
});

it('removes awaiting-response class from input after non-ok fetch', async () => {
  const input = document.querySelector('input');

  expect.assertions(2);
  global.fetch.mockResolvedValue({ 'ok': false });

  require('../client.js'); // Module has side-effects
  input.click();

  await expect(global.fetch.mock.results[0].value).resolves.toEqual({ 'ok': false });
  expect(input.classList).not.toContain('awaiting-response');
});

it('displays an error message for failed API requests', async () => {
  const input = document.querySelector('input');

  expect.assertions(2);
  global.fetch.mockRejectedValue('test error');
        
  require('../client.js'); // Module has side-effects
  input.click();

  await expect(global.fetch.mock.results[0].value).rejects.toEqual('test error');
  expect(document.querySelector('.error-message').innerText).toEqual('test error');
});

it('sends input name and value during checkbox API request', () => {
  global.fetch.mockResolvedValue({ 'ok': true });

  require('../client.js'); // Module has side-effects

  document.querySelector('input').click();

  expect(global.fetch.mock.calls[0][1].body)
    .toEqual('{"test_checkbox":true}');
});

it('prevents change of checkbox state without network response', () => {
  // Network request remains pending
  global.fetch.mockImplementation(() => new Promise(() => { }));

  require('../client.js'); // Module has side-effects

  const input = document.querySelector('input');
  input.click();

  expect(input.checked).toBe(false);
});

it('updates checkbox state after ok fetch', async () => {
  const input = document.querySelector('input');

  expect.assertions(2);
  global.fetch.mockResolvedValue({ 'ok': true });

  require('../client.js'); // Module has side-effects
  input.click();

  await expect(global.fetch.mock.results[0].value).resolves.toEqual({ 'ok': true });
  expect(input.checked).toBe(true);
});

it('does not update checkbox state after non-ok fetch', async () => {
  const input = document.querySelector('input');

  expect.assertions(2);
  global.fetch.mockResolvedValue({ 'ok': false });

  require('../client.js'); // Module has side-effects
  input.click();

  await expect(global.fetch.mock.results[0].value).resolves.toEqual({ 'ok': false });
  expect(input.checked).toBe(false);
});
