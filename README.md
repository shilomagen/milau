# TypeScript Project

A TypeScript project with strict configuration and Express server with webhook support.

## Setup

```bash
# Install dependencies
npm install
```

## Development

```bash
# Run in development mode with auto-reload
npm run dev
```

## Build and Run

```bash
# Build the project
npm run build

# Run the compiled code
npm run start
```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /webhook` - Webhook endpoint that logs all received events

## Testing the Webhook

You can test the webhook using curl:

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"event":"test","data":{"message":"Hello from webhook"}}'
```

## Project Structure

- `src/`: Source files
  - `index.ts`: Main entry point
  - `server.ts`: Express server configuration
  - `services/`: Service modules
    - `webhookService.ts`: Webhook handling service
- `dist/`: Compiled output (generated)
- `tsconfig.json`: TypeScript configuration 