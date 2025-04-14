import { GraphQLClient } from "graphql-request";
import { getSdk } from "../generated/graphql";

// Environment variables should be loaded by your config
const MONDAY_API_TOKEN = process.env['MONDAY_API_TOKEN'] || "";
const MONDAY_API_URL = "https://api.monday.com/v2";

// Create a GraphQL client with authentication headers
const client = new GraphQLClient(MONDAY_API_URL, {
  headers: {
    Authorization: MONDAY_API_TOKEN,
    "Content-Type": "application/json",
  },
});

// Get the typed SDK
export const mondayClient = getSdk(client);

// Example usage:
// async function getBoard(boardId: string) {
//   return mondayClient.GetBoard({ boardId });
// }
