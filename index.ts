#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// Tool definition for authentication
const authenticateTool: Tool = {
  name: 'clickup_authenticate',
  description: 'Authenticate with ClickUp API using an API token',
  inputSchema: {
    type: 'object',
    properties: {
      api_token: {
        type: 'string',
        description: 'ClickUp API token for authentication',
      },
    },
    required: ['api_token'],
  },
};

class ClickUpClient {
  private headers: { Authorization: string; 'Content-Type': string };

  constructor(apiToken: string) {
    this.headers = {
      Authorization: apiToken,
      'Content-Type': 'application/json',
    };
  }

  async authenticate(): Promise<any> {
    const response = await fetch('https://api.clickup.com/api/v2/user', {
      headers: this.headers,
    });
    return response.json();
  }
}

async function main() {
  console.error('Starting ClickUp MCP Server...');
  const server = new Server(
    {
      name: 'ClickUp MCP Server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      console.error('Received CallToolRequest:', request);
      try {
        if (!request.params.arguments) {
          throw new Error('No arguments provided');
        }

        switch (request.params.name) {
          case 'clickup_authenticate': {
            const { api_token } = request.params.arguments as {
              api_token: string;
            };
            if (!api_token) {
              throw new Error('Missing required argument: api_token');
            }
            const clickUpClient = new ClickUpClient(api_token);
            const response = await clickUpClient.authenticate();
            return {
              content: [{ type: 'text', text: JSON.stringify(response) }],
            };
          }

          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        console.error('Error executing tool:', error);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
        };
      }
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error('Received ListToolsRequest');
    return {
      tools: [authenticateTool],
    };
  });

  const transport = new StdioServerTransport();
  console.error('Connecting server to transport...');
  await server.connect(transport);

  console.error('ClickUp MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
