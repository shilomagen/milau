import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Monday.com configuration
export const MONDAY_API_TOKEN = process.env["MONDAY_API_TOKEN"] || "";

// Azure OpenAI configuration
export const AZURE_OPENAI_API_KEY = process.env["AZURE_OPENAI_API_KEY"] || "";
export const AZURE_OPENAI_ENDPOINT = process.env["AZURE_OPENAI_ENDPOINT"] || "";
export const AZURE_OPENAI_DEPLOYMENT_NAME =
  process.env["AZURE_OPENAI_DEPLOYMENT_NAME"] || "";

// Validate required environment variables
export function validateEnv(): void {
  const requiredEnvVars = {
    MONDAY_API_TOKEN,
    AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_DEPLOYMENT_NAME,
  };

  const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([name]) => name);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
  }
}
