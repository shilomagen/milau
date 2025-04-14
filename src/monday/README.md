# Monday.com Integration

This module provides a complete integration with the Monday.com API using GraphQL.

## Structure

- `graphql/operations/`: Contains GraphQL query and mutation operations
- `routes/`: Express routes for the Monday.com API
- `services/`: Service classes for interacting with Monday.com
- `types/`: TypeScript interfaces for Monday.com entities

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONDAY_API_TOKEN=your_monday_api_token_here
```

You can get your API token from Monday.com:
1. Go to your Monday.com account
2. Click on your avatar in the bottom left
3. Select "Admin" and then "API"
4. Generate or copy your API v2 Token

## Available Endpoints

The module exposes the following API endpoints:

- `GET /api/monday/boards/:boardId` - Get a board by ID
- `GET /api/monday/users/:userId` - Get a user by ID
- `GET /api/monday/items/:itemId` - Get an item by ID
- `POST /api/monday/boards/:boardId/items` - Create a new item
- `PATCH /api/monday/boards/:boardId/items/:itemId/columns/:columnId` - Update a column value
- `POST /api/monday/items/:itemId/updates` - Create an update on an item
- `POST /api/monday/query` - Run a custom GraphQL query
- `POST /api/monday/mutate` - Run a custom GraphQL mutation

## TypeScript Support

The module uses GraphQL Code Generator to generate TypeScript types from the Monday.com GraphQL schema.

To regenerate the types after modifying GraphQL operations:
```bash
npm run generate-gql
```

## Testing

You can test the API endpoints using curl or Postman. Example:

```bash
# Get a board
curl http://localhost:3000/api/monday/boards/12345678

# Create an item
curl -X POST http://localhost:3000/api/monday/boards/12345678/items \
  -H "Content-Type: application/json" \
  -d '{"name": "New Task", "columnValues": {"status": {"label": "In Progress"}}}'
``` 