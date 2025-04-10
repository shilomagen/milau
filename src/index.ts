/**
 * Main entry point for the application
 */
import { server } from "./server";

const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

const main = (): void => {
  console.log(greet("TypeScript"));
  console.log("TypeScript project with strict configuration is running!");

  // Start the Express server
  server.start();
  console.log(
    "Express server initialized with webhook endpoint at POST /webhook"
  );
};

main();
