# light-bubble
A little project to control my bedroom lighting without invasive apps.

## Configuration
Configuration is done via `config.json`. This repo includes a `config-sample.json` file which you can reference to start your own config. Available configurations are listed below:

- `port (int)`: Port for the light-bubble server to run on
- `host (str)`: Host for the light-bubble server to listen on
- `theme (str)`: Your preferred interface for light-bubble. Available themes are:
  - default: A plain and understated theme
- `devices (arr of devices)`: Configurations for individual devices, in order of appearance on the interface. Supported devices and their configurations are listed below

### Tuya Outlet Configuration

- `make (str)`: `"tuya"`
- `model (str)`: `"outlet"`
- `config (obj)`: Configuration for the Tuya outlet
  - `id (str)`: Unique ID for the device
  - `key (str)`: API key for the device
  - `ip (str)`: IP address of the device
- `title (str)`: Your name for the device
- `fields (arr of str)`: Your labels for each outlet on the device

## Local Setup
Once your configuration is set, you can start light-bubble on your configured port as follows:

```sh
npm start
```

## Docker Setup
First, move `config-sample.json` to `config.json` and configure as needed. Build the container, then run it on port 49160 (or whatever port you want):

```
docker build -t light-bubble .
docker run -p 49160:8080 -d light-bubble
```
