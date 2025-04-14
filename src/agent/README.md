# Azure OpenAI Agent

This is a LangChain implementation that connects to Azure OpenAI to create AI agents that can search the web using the Tavily API.

## Setup

1. Copy the `.env.example` file to `.env` in the project root:
   ```
   cp .env.example .env
   ```

2. Update the `.env` file with your Azure OpenAI and Tavily API credentials:
   - `AZURE_OPENAI_API_KEY`: Your Azure OpenAI API key
   - `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint URL (e.g., https://your-resource-name.openai.azure.com)
   - `AZURE_OPENAI_DEPLOYMENT_NAME`: The deployment name of your model in Azure OpenAI
   - `TAVILY_API_KEY`: Your Tavily API key for web search capability

## Implementation Details

This implementation provides two types of agents:

1. **Simple ReAct Agent**: A straightforward agent using the `createReactAgent` helper from LangGraph.
   - Defined in `src/agent/index.ts`
   - Easy to initialize and use with minimal configuration

2. **Custom StateGraph Agent**: A more advanced agent using StateGraph for fine-grained control over agent behavior.
   - Defined in `src/agent/custom-agent.ts`
   - Provides more control over the execution flow and agent behavior

Both agents are configured to use Azure OpenAI instead of regular OpenAI, and they can maintain conversation context between messages.

## Running the Example

You can run the example with:

```
npx tsx src/examples/agent-example.ts
```

The example demonstrates:
- Initializing both types of agents
- Sending queries to the agents
- Handling follow-up questions with conversation context

## Usage in Your Code

To use these agents in your own code:

```typescript
import { initializeAgent, queryAgent } from './agent';
// OR for the custom agent
import { initializeCustomAgent, queryCustomAgent } from './agent/custom-agent';

// Initialize the agent
const agent = await initializeAgent();
// OR
const customAgent = await initializeCustomAgent();

// Query the agent
const result = await queryAgent(agent, "What is the weather in London?");
console.log(result.response);

// For follow-up questions, you can maintain the conversation context
const followUpResult = await queryAgent(agent, "What about New York?", "weather-thread");
// OR with the custom agent
const followUpResult = await queryCustomAgent(customAgent, "What about New York?", previousResult.state);
``` 