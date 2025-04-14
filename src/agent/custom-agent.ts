// src/agent/custom-agent.ts

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import {
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_ENDPOINT,
  AZURE_OPENAI_DEPLOYMENT_NAME,
} from "../config";

/**
 * Initialize a custom Azure OpenAI-powered agent using StateGraph
 */
export async function initializeCustomAgent() {
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
  // Define the tools for the agent to use
  const tools = [new TavilySearchResults({ maxResults: 3 })];
  const toolNode = new ToolNode(tools);

  // Create a model and give it access to the tools
  const model = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: AZURE_OPENAI_API_KEY,
    modelName: AZURE_OPENAI_DEPLOYMENT_NAME,
    configuration: {
      baseURL: AZURE_OPENAI_ENDPOINT,
      defaultHeaders: {
        "api-key": AZURE_OPENAI_API_KEY,
      },
    },
  }).bindTools(tools);

  // Define the function that determines whether to continue or not
  function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
    // If there are no messages, we stop
    if (!messages || messages.length === 0) {
      return "__end__";
    }

    const lastMessage = messages[messages.length - 1];

    // If there's no last message or no additional_kwargs, we stop
    if (!lastMessage || !lastMessage.additional_kwargs) {
      return "__end__";
    }

    // If the LLM makes a tool call, then we route to the "tools" node
    if (lastMessage.additional_kwargs.tool_calls) {
      return "tools";
    }

    // Otherwise, we stop (reply to the user) using the special "__end__" node
    return "__end__";
  }

  // Define the function that calls the model
  async function callModel(state: typeof MessagesAnnotation.State) {
    const response = await model.invoke(state.messages);

    // We return a list, because this will get added to the existing list
    return { messages: [response] };
  }

  // Define a new graph
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent") // __start__ is a special name for the entrypoint
    .addNode("tools", toolNode)
    .addEdge("tools", "agent")
    .addConditionalEdges("agent", shouldContinue);

  // Finally, we compile it into a LangChain Runnable.
  const app = workflow.compile();

  return app;
}

/**
 * Send a message to the custom agent
 */
export async function queryCustomAgent(
  app: any,
  message: string,
  previousState: any = null
) {
  // If we have a previous state, include those messages to maintain conversation
  const messages = previousState
    ? [...previousState.messages, new HumanMessage(message)]
    : [new HumanMessage(message)];

  const finalState = await app.invoke({ messages });

  return {
    response: finalState.messages[finalState.messages.length - 1].content,
    state: finalState,
  };
}
