import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as readline from "readline";

/**
 * A simple interactive test client for testing MCP servers
 */
async function main() {
  const serverPath = process.argv[2] || "dist/mcp/monday/server.js";

  console.log(`Connecting to MCP server: ${serverPath}`);

  // Create a transport that will spawn the server process
  const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath],
  });

  // Create a client
  const client = new Client({
    name: "mcp-test-client",
    version: "1.0.0",
  });

  try {
    // Connect to the server
    await client.connect(transport);
    console.log("Connected to server successfully");

    // List available tools
    const tools = await client.listTools();
    console.log("Available tools:");
    tools.tools.forEach((tool) => {
      console.log(`- ${tool.name}: ${tool.description || "No description"}`);
      if (tool.arguments.length > 0) {
        console.log("  Arguments:");
        tool.arguments.forEach((arg) => {
          console.log(
            `  - ${arg.name}${arg.required ? " (required)" : ""}: ${
              arg.description || "No description"
            }`
          );
        });
      }
    });

    // Create a readline interface for user input
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Interactive prompt
    console.log(
      '\nEnter a tool name and JSON arguments to call (or "exit" to quit)'
    );
    console.log('Example: getBoard {"boardId": 123456789}');

    const promptUser = () => {
      rl.question("> ", async (input) => {
        if (input.toLowerCase() === "exit") {
          await transport.close();
          rl.close();
          return;
        }

        try {
          // Parse the input
          const [toolName, ...rest] = input.split(" ");
          const argsString = rest.join(" ");

          // Validate tool name
          if (!tools.tools.some((t) => t.name === toolName)) {
            console.log(`Unknown tool: ${toolName}`);
            promptUser();
            return;
          }

          // Parse arguments
          let args = {};
          try {
            args = argsString ? JSON.parse(argsString) : {};
          } catch (e) {
            console.log("Error parsing arguments. Please provide valid JSON.");
            promptUser();
            return;
          }

          // Call the tool
          console.log(`Calling ${toolName} with args:`, args);
          const result = await client.callTool({
            name: toolName,
            arguments: args,
          });

          // Display the result
          console.log("Result:");
          if (result.content) {
            result.content.forEach((content) => {
              if (content.type === "text") {
                console.log(content.text);
              } else {
                console.log(content);
              }
            });
          } else {
            console.log(result);
          }
        } catch (error) {
          console.error("Error:", error.message);
        }

        promptUser();
      });
    };

    promptUser();
  } catch (error) {
    console.error("Error connecting to server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
