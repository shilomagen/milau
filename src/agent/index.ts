// src/agent/index.ts

// Set environment variables for Azure OpenAI
import * as dotenv from "dotenv";
dotenv.config();

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import {
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_DEPLOYMENT_NAME,
  AZURE_OPENAI_ENDPOINT,
} from "../config";

/**
 * Initialize an Azure OpenAI-powered agent
 */
export async function initializeAgent() {
  // Ensure environment variables are set
  if (!AZURE_OPENAI_API_KEY) {
    throw new Error("AZURE_OPENAI_API_KEY environment variable is required");
  }
  if (!AZURE_OPENAI_ENDPOINT) {
    throw new Error("AZURE_OPENAI_ENDPOINT environment variable is required");
  }
  if (!AZURE_OPENAI_DEPLOYMENT_NAME) {
    throw new Error(
      "AZURE_OPENAI_DEPLOYMENT_NAME environment variable is required"
    );
  }

  // Define tools for the agent
  const agentTools = [new TavilySearchResults({ maxResults: 3 })];

  // Initialize Azure OpenAI model
  const agentModel = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: AZURE_OPENAI_API_KEY,
    modelName: AZURE_OPENAI_DEPLOYMENT_NAME,
    configuration: {
      baseURL: AZURE_OPENAI_ENDPOINT,
      defaultHeaders: {
        "api-key": AZURE_OPENAI_API_KEY,
      },
    },
  });

  // Initialize memory for the agent
  const agentCheckpointer = new MemorySaver();

  // Create the agent
  const agent = createReactAgent({
    llm: agentModel,
    tools: agentTools,
    checkpointSaver: agentCheckpointer,
  });

  return agent;
}

/**
 * Send a message to the agent
 */
export async function queryAgent(
  agent: any,
  message: string,
  threadId: string = "default"
) {
  const agentFinalState = await agent.invoke(
    { messages: [new HumanMessage(message)] },
    { configurable: { thread_id: threadId } }
  );

  return {
    response:
      agentFinalState.messages[agentFinalState.messages.length - 1].content,
    state: agentFinalState,
  };
}
