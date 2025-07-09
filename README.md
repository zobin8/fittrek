# Fittrek

Track your workouts on virtual hikes.

Fittrek is hosted at https://fit.zkrueger.com

## Development Instructions

To host a mirror of this website, follow the below instructions.

### Environment file

The file `.env` should be populated with API keys from the Google API:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK=https://<DOMAIN>/auth/google/callback
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
