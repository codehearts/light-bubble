const request = require('supertest');
const routing = require('../routing.js');

// Mock devices and their associated forms
jest.mock('../device_director.js', () => {
  const mockSetFieldState = jest.fn();

  return jest.fn(() => {
    return {
      'connectAll': jest.fn(),
      'setFieldState': mockSetFieldState,
      'forms': new Map([
        ['form-1', {
          has_error: false,
          title: 'Bedroom Outlets',
          fields: [{
            type: 'boolean',
            title: 'Overhead Light',
            uid: 'form-1-field-1',
            state: true
          }, {
            type: 'boolean',
            title: 'Bedside Lamp',
            uid: 'form-1-field-2',
            state: false
          }]
        }],
        ['form-2', {
          has_error: true,
          error_message: 'Failed to connect to device',
          title: 'Kitchen Outlets',
          fields: [{
            type: 'boolean',
            title: 'Countertop Lights',
            uid: 'form-2-field-1',
            state: true
          }, {
            type: 'boolean',
            title: 'Stovetop Light',
            uid: 'form-2-field-2',
            state: false
          }]
        }],
      ])
    };
  });
});

// Mock config values
jest.mock('../config_loader.js', () => {
  return jest.fn(() => {
    return {
      'theme': 'default'
    };
  });
});


const app = routing.app;

it('returns HTML with status 200 for GET requests to /', async () => {
  const response = await request(app).get('/');
  expect(response.status).toBe(200);
  expect(response.type).toEqual('text/html');
});

it('serves / with each form action set as /api via POST', async () => {
  const response = await request(app).get('/');
  const dom = new DOMParser().parseFromString(response.text, 'text/html');

  dom.querySelectorAll('form').forEach(form => {
    expect(form.action).toEqual('/api');
    expect(form.method).toEqual('post');
  });
});

it('serves / with each form title in order', async () => {
  const response = await request(app).get('/');
  const dom = new DOMParser().parseFromString(response.text, 'text/html');

  const forms = dom.querySelectorAll('form');
  expect(forms[0].querySelector('legend').textContent).toEqual('Bedroom Outlets');
  expect(forms[1].querySelector('legend').textContent).toEqual('Kitchen Outlets');
});

it('responds with empty 200 from /api when successful', async () => {
  expect.assertions(1);

  const mock_device_director = require('../device_director.js')();
  mock_device_director.setFieldState.mockResolvedValueOnce(null);

  await request(app)
    .post('/api')
    .send({'form-1-field-1': false})
    .expect(200)
    .then(response => {
      expect(response.body).toEqual({});
    });
});

it('responds with 500 from /api when an error occurs', async () => {
  expect.assertions(1);

  const mock_device_director = require('../device_director.js')();
  mock_device_director.setFieldState.mockRejectedValueOnce('error message');

  await request(app)
    .post('/api')
    .send({'form-1-field-1': 'invalid'})
    .expect(500)
    .then(response => expect(response.text).toEqual('error message'));
});

it('includes script tag for client.js on /', async () => {
  const response = await request(app).get('/');
  const dom = new DOMParser().parseFromString(response.text, 'text/html');

  expect(dom.querySelector('script[src="client.js"]')).not.toBeNull();
});
