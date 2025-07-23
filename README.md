# Fittrek

Track your workouts on virtual hikes.

Fittrek is hosted at https://fit.zkrueger.com

## Development Instructions

To host a mirror of this website, follow the below instructions.

### Environment file

The file `.env` should be populated with API keys from the Fitbit API:

```
FITBIT_CLIENT_ID=...
FITBIT_CLIENT_SECRET=...
FITBIT_CALLBACK=https://<DOMAIN>/auth/fitbit/callback
SESSION_SECRET=...
```

### Running the application

The application can be run with docker-compose.

```
docker-compose up -d --build
```

### Linting

This repository uses ESLint.

```
npx eslint
```
