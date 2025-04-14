# Model Context Protocol (MCP) Implementations

This directory contains Model Context Protocol (MCP) server implementations for integrating with various external services.

## What is MCP?

Model Context Protocol (MCP) is an open protocol that enables seamless integration between LLM applications and external data sources and tools. It provides a standardized way to connect LLMs with the context they need.

## Available Implementations

- [Monday.com](./monday/README.md) - Tools for interacting with Monday.com's GraphQL API including board management, item creation, updates, and more

## Development

### Requirements

- Node.js 16+
- npm or yarn
- The MCP SDK: `@modelcontextprotocol/sdk`

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the TypeScript files:
   ```bash
   npm run build
   ```

### Testing

Use the test client to interact with any MCP server:

```bash
# Test the Monday MCP server
npm run mcp:test-client
```

### Adding a New MCP Server

To add a new MCP server:

1. Create a new directory under `src/mcp/`
2. Implement at least:
   - `client.ts` - The API client for the external service
   - `tools.ts` - Tool definitions with schemas and handlers
   - `server.ts` - The MCP server implementation
   - `index.ts` - Exports for programmatic usage
   - `README.md` - Documentation

3. Export from the main `src/mcp/index.ts`
4. Add scripts to package.json for running the server

## Implementation Structure

MCP servers in this project follow a common structure:

1. **Client**: A typed API client for the external service
2. **Tools**: Definitions of available tools with:
   - Descriptive names (e.g., `service_action_name`)
   - Clear descriptions
   - JSON schema for parameters
   - Handler functions that call the client
3. **Server**: The MCP server that:
   - Exposes the tools to MCP clients
   - Validates parameters using Zod schemas
   - Handles requests and responses

## Integration with Claude Desktop

To use these MCP servers with Claude Desktop:

1. Build the project: `npm run build`
2. Edit your `claude_desktop_config.json`:

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

## Security Considerations

- MCP servers might have access to sensitive data
- Tool executions can modify data and create side effects
- Always review tool descriptions and arguments before execution
- Implement proper validation and authorization in production environments

## Contributing

Contributions are welcome! Please follow these steps:

1. Create a fork
2. Create a feature branch
3. Add your changes
4. Submit a pull request 