# Monday.com API Integration

This project includes a complete integration with the Monday.com API using GraphQL.

## Features

- Strongly typed GraphQL operations
- Generated TypeScript types for Monday.com entities
- Complete service layer for common Monday.com operations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Monday.com API token:
```
MONDAY_API_TOKEN=your_api_token_here
```

3. Generate TypeScript types from GraphQL operations:
```bash
npm run generate-gql
```

## Project Structure

- `src/graphql/operations/`: Contains GraphQL queries and mutations
- `src/generated/`: Contains generated TypeScript types and operations
- `src/services/`: Contains service classes for interacting with Monday.com
- `src/types/`: Contains custom TypeScript interfaces

## Usage

```typescript
import { mondayService } from './services/monday-service';

// Get a board
const board = await mondayService.getBoard(123456789);

// Get a user
const user = await mondayService.getUser(123456789);

// Get an item
const item = await mondayService.getItem(123456789);

// Update a column value
const updatedItem = await mondayService.updateColumnValue(123456789, 'column_id', { value: 'new value' });

// Create an item
const newItem = await mondayService.createItem(123456789, 'New Item', {
  status: { label: 'Done' },
  text: 'Hello world!'
});
```

## GraphQL Operations

The following GraphQL operations are available:

- `GetBoard`: Get a board by ID
- `GetUser`: Get a user by ID
- `GetItem`: Get an item by ID
- `ChangeColumnValue`: Update a column value
- `CreateUpdate`: Create an update on an item
- `CreateItem`: Create a new item in a board

## Running the Code Generator

If you add or modify GraphQL operations, you need to regenerate the TypeScript types:

```bash
npm run generate-gql
```

## Development

Start the development server with automatic reloading:
```bash
npm run start:dev
```

## API Client Usage

The project includes a GraphQL client for Monday.com's API that supports queries and mutations. 

### Using the Monday Service

```typescript
import { mondayService } from './src/services/monday-service';

// Get a board
const board = await mondayService.getBoard(123456789);

// Get a user
const user = await mondayService.getUser(12345678);

// Update a column value
await mondayService.updateColumnValue(123456789, 'status', { label: 'Done' });

// Run a custom query
const query = `
  query {
    me {
      id
      name
    }
  }
`;
const result = await mondayService.runQuery(query);
```

### Run the Examples

The project includes example code showing how to use the Monday.com API:

```bash
npx ts-node src/examples/monday-api-examples.ts
```

## Webhook Integration

The project includes a webhook handler for Monday.com events. To use it:

1. Set up a Monday.com app with webhook integration
2. Point the webhook URL to your server's `/webhook` endpoint
3. The webhook handler will process events and perform actions based on the event type

## Type Definitions

TypeScript type definitions for the Monday.com API are available in `src/types/monday-types.ts`.

## API Documentation

For more information on the Monday.com GraphQL API, visit:
- [Monday.com API Documentation](https://developer.monday.com/api-reference/docs)
- [Monday.com GraphQL API Explorer](https://monday.com/developers/v2/api_playground) 