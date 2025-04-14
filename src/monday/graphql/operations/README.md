# Monday.com GraphQL Operations

This directory contains the GraphQL operations used to interact with the Monday.com API.

## Operations

- **boards.graphql**: Queries for board-related operations
- **users.graphql**: Queries for user-related operations
- **items.graphql**: Queries for item-related operations
- **mutations.graphql**: Mutations for updating data

## Generating TypeScript types

To generate TypeScript types from these GraphQL operations, run:

```bash
npm run generate-gql
```

This will generate TypeScript types and operations in the `src/generated` directory based on the configuration in `codegen.ts`.

## Usage

The generated types and operations can be imported and used in your application:

```typescript
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../../generated/graphql';

const client = new GraphQLClient('https://api.monday.com/v2', {
  headers: {
    'Authorization': YOUR_API_TOKEN,
  },
});

const sdk = getSdk(client);

// Now you can use the typed operations
const getBoardResult = await sdk.GetBoard({ boardId: '12345' });
``` 