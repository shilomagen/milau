/**
 * Main entry point for the application
 */
import { server } from "./server";
import { validateEnv } from "./config";

const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

const main = (): void => {
  // Validate environment variables
  try {
    validateEnv();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred during environment validation");
    }
    process.exit(1);
  }

  console.log(greet("TypeScript"));
  console.log("TypeScript project with strict configuration is running!");

  // Start the Express server
  server.start();
  console.log(
    "Express server initialized with webhook endpoint at POST /webhook"
  );
};

main();
