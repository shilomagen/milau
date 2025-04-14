import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { tools, schemas } from "./tools";

// Create an MCP server
const server = new Server(
  {
    name: "Monday MCP Server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define the tools
const toolDefinitions = [
  {
    name: tools.getBoard.name,
    description: tools.getBoard.description,
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "number",
          description:
            "The unique numeric ID of the Monday.com board to retrieve",
        },
      },
      required: ["boardId"],
    },
  },
  {
    name: tools.getUser.name,
    description: tools.getUser.description,
    inputSchema: {
      type: "object",
      properties: {
        userId: {
          type: "number",
          description:
            "The unique numeric ID of the Monday.com user to retrieve",
        },
      },
      required: ["userId"],
    },
  },
  {
    name: tools.getItem.name,
    description: tools.getItem.description,
    inputSchema: {
      type: "object",
      properties: {
        itemId: {
          type: "number",
          description:
            "The unique numeric ID of the Monday.com item to retrieve",
        },
      },
      required: ["itemId"],
    },
  },
  {
    name: tools.updateColumnValue.name,
    description: tools.updateColumnValue.description,
    inputSchema: {
      type: "object",
      properties: {
        itemId: {
          type: "number",
          description: "The unique numeric ID of the item to update",
        },
        boardId: {
          type: "number",
          description: "The unique numeric ID of the board containing the item",
        },
        columnId: {
          type: "string",
          description:
            "The column ID to update (e.g., 'status', 'date', 'text')",
        },
        value: {
          type: "object",
          description:
            "The new value to set for the column (format depends on column type)",
        },
      },
      required: ["itemId", "boardId", "columnId", "value"],
    },
  },
  {
    name: tools.setTaskStatus.name,
    description: tools.setTaskStatus.description,
    inputSchema: {
      type: "object",
      properties: {
        itemId: {
          type: "number",
          description: "The unique numeric ID of the item/task to update",
        },
        boardId: {
          type: "number",
          description: "The unique numeric ID of the board containing the item",
        },
        statusLabel: {
          type: "string",
          description:
            "The status label to set (e.g., 'Done', 'Working on it', 'Stuck')",
        },
      },
      required: ["itemId", "boardId", "statusLabel"],
    },
  },
  {
    name: tools.createUpdate.name,
    description: tools.createUpdate.description,
    inputSchema: {
      type: "object",
      properties: {
        itemId: {
          type: "number",
          description: "The unique numeric ID of the item to add an update to",
        },
        updateText: {
          type: "string",
          description: "The text content of the update to add",
        },
      },
      required: ["itemId", "updateText"],
    },
  },
  {
    name: tools.createItem.name,
    description: tools.createItem.description,
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "number",
          description:
            "The unique numeric ID of the board where to create the item",
        },
        itemName: {
          type: "string",
          description: "The name of the new item to create",
        },
        columnValues: {
          type: "object",
          description:
            "Key-value pairs of column values to set for the new item",
        },
      },
      required: ["boardId", "itemName"],
    },
  },
];

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.log("Received ListToolsRequest");
  return {
    tools: toolDefinitions,
  };
});

server.setRequestHandler(
  CallToolRequestSchema,
  async (request: CallToolRequest) => {
    console.log("Received CallToolRequest:", request);

    try {
      if (!request.params.arguments) {
        throw new Error("No arguments provided");
      }

      switch (request.params.name) {
        case tools.getBoard.name: {
          const args = schemas.getBoard.parse(request.params.arguments);
          return await tools.getBoard.handler(args);
        }

        case tools.getUser.name: {
          const args = schemas.getUser.parse(request.params.arguments);
          return await tools.getUser.handler(args);
        }

        case tools.getItem.name: {
          const args = schemas.getItem.parse(request.params.arguments);
          return await tools.getItem.handler(args);
        }

        case tools.updateColumnValue.name: {
          const args = schemas.updateColumnValue.parse(
            request.params.arguments
          );
          return await tools.updateColumnValue.handler(args);
        }

        case tools.setTaskStatus.name: {
          const args = schemas.setTaskStatus.parse(request.params.arguments);
          return await tools.setTaskStatus.handler(args);
        }

        case tools.createUpdate.name: {
          const args = schemas.createUpdate.parse(request.params.arguments);
          return await tools.createUpdate.handler(args);
        }

        case tools.createItem.name: {
          const args = schemas.createItem.parse(request.params.arguments);
          return await tools.createItem.handler(args);
        }

        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    } catch (error) {
      console.error("Error executing tool:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
            }),
          },
        ],
        isError: true,
      };
    }
  }
);

// Export the server for testing and programmatic usage
export const mondayServer = server;

// Start the server if this file is executed directly
if (require.main === module) {
  const transport = new StdioServerTransport();
  console.log("Starting Monday MCP Server...");
  server.connect(transport).catch((error) => {
    console.error("Error connecting transport:", error);
    process.exit(1);
  });
}
