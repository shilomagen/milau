import type { CodegenConfig } from "@graphql-codegen/cli";
// Import config directly
import "./src/config";

const config: CodegenConfig = {
  schema: {
    "https://api.monday.com/v2/get_schema": {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  },

  documents: ["src/monday/graphql/operations/**/*.graphql"],
  generates: {
    "./src/generated/schema.ts": {
      plugins: ["typescript"],
      config: {
        skipTypename: false,
        // Add any scalar mappings if needed
        scalars: {
          DateTime: "string",
          JSON: "Record<string, any>",
        },
      },
    },
    "./src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        skipTypename: false,
        scalars: {
          DateTime: "string",
          JSON: "Record<string, any>",
        },
        documentMode: "string",
        requestSDK: "graphql-request",
        // Add these configuration options to generate SDK
        rawRequest: false,
        importRequestFrom: "graphql-request",
        // Generate the SDK class
        generateSDK: true,
        sdkClass: true,
      },
    },
    "./src/generated/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
