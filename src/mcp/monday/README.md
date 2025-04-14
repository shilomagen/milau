# Monday.com MCP Server

This is a Model Context Protocol (MCP) server implementation for Monday.com. It provides tools to interact with Monday.com's GraphQL API.

## Features

This MCP server exposes the following tools:

- **monday_get_board**: Get detailed information about a Monday.com board including columns, items, and configuration
- **monday_get_user**: Get information about a Monday.com user including name, email, and profile details
- **monday_get_item**: Get detailed information about a Monday.com item including all column values
- **monday_update_column_value**: Update a specific column value of a Monday.com item (status, dates, text, etc.)
- **monday_set_task_status**: Update the status of a task/item in Monday.com as a simplified way to change status
- **monday_create_update**: Create a new update (comment) on a Monday.com item
- **monday_create_item**: Create a new item in a Monday.com board

## Setup

1. Ensure you have the `MONDAY_API_TOKEN` configured in your environment (or in the .env file)
2. Install dependencies with `npm install`

## Usage

### As a standalone server

You can run the server directly:

```bash
npm run mcp:monday
```

Or in development mode with auto-restart:

```bash
npm run mcp:monday:dev
```

### Testing with the MCP Test Client

You can use the provided test client to interact with the server:

```bash
npm run mcp:test-client
```

Example commands:
```
> monday_get_board {"boardId": 123456789}
> monday_create_item {"boardId": 123456789, "itemName": "New Task", "columnValues": {"status": {"label": "Working on it"}}}
```

### Integration with Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "monday": {
      "command": "node",
      "args": [
        "dist/mcp/monday/server.js"
      ]
    }
  }
}
```

### Programmatic Usage

```typescript
import { mondayServer } from './mcp/monday';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Connect to a transport
const transport = new StdioServerTransport();
mondayServer.connect(transport).catch(error => {
  console.error('Error connecting transport:', error);
  process.exit(1);
});
```

## Implementation

The MCP server implementation consists of:

- **client.ts**: The Monday.com GraphQL API client
- **tools.ts**: Tool definitions, schemas, and handlers
- **server.ts**: MCP server implementation with request handlers
- **index.ts**: Exports for programmatic usage

## Authentication

This server uses the Monday.com API token specified in the `MONDAY_API_TOKEN` environment variable. Make sure this is properly set before running the server.

## Security Considerations

- The Monday.com API token has full access to your Monday.com workspace
- Tools like create_item and update_column_value can modify your Monday.com data
- Always review tool calls before executing them
- Consider implementing additional validation in production environments 