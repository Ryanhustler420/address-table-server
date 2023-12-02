# xCodeClazz Load Balancer

Very simple round-robin method load balancer docker image

### Usage

```Dockerfile
FROM xcodeclazz-load-balancer:latest
COPY config.json /app/dist/config.json

...
```

> config.json

```json
{
  "servers": [
    { "name": "https://srv1.com", "capacity": 20 },
    { "name": "https://srv2.com", "capacity": 20 },
    { "name": "https://srv3.com", "capacity": 15 }
  ]
}
```

# How it works

1. User will connect to this service via socket.io
2. User will get server link if it's capacity not reached
3. User have to listen these emits
   - assignedEndpoint
   - noAvailableEndpoint

# Workflow Env

- DOCKER_USERNAME = abc
- DOCKER_PASSWORD = 123
- DOCKER_IMAGE_NAME= repo/app
- RENDER_APP_SERVICE_ID = srv_sfer...
- RENDER_PROFILE_AUTH_API_TOKEN = ghd_dse
