# light-bubble
An afternoon's hack to control my bedroom lighting without invasive apps.

## Docker Setup
Build the container, then run it on port 49160 (or whatever port you want):

```
docker build -t light-bubble .
docker run -p 49160:8080 -d light-bubble
```

## Roadmap
- [ ] Specify devices (id, key, and ip) and switches (names) in config file
- [ ] Display error messages
