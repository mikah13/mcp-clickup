#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { ClickUpTask, ClickUpUser } from './type';

const authenticateTool: Tool = {
  name: 'clickup_authenticate',
  description:
    'Authenticate with ClickUp API using an API token and workspace ID',
  inputSchema: {
    type: 'object',
    properties: {
      api_token: {
        type: 'string',
        description: 'ClickUp API token for authentication',
      },
      workspace_id: {
        type: 'string',
        description: 'ClickUp workspace ID for authentication',
      },
    },
    required: ['api_token', 'workspace_id'],
  },
};

const getTaskTool: Tool = {
  name: 'clickup_get_task',
  description: 'Retrieve a task from ClickUp by task ID',
  inputSchema: {
    type: 'object',
    properties: {
      api_token: {
        type: 'string',
        description: 'ClickUp API token for authentication',
      },
      task_id: {
        type: 'string',
        description: 'The ID of the ClickUp task to retrieve',
      },
    },
    required: ['api_token', 'task_id'],
  },
};

const getTaskByCustomIdTool: Tool = {
  name: 'clickup_get_task_by_custom_id',
  description: 'Retrieve a task from ClickUp by custom ID',
  inputSchema: {
    type: 'object',
    properties: {
      api_token: {
        type: 'string',
        description: 'ClickUp API token for authentication',
      },
      custom_id: {
        type: 'string',
        description: 'The custom ID of the ClickUp task to retrieve',
      },
      workspace_id: {
        type: 'string',
        description: 'The workspace ID required for the API request',
      },
    },
    required: ['api_token', 'custom_id', 'workspace_id'],
  },
};

const getTasksTool: Tool = {
  name: 'clickup_get_tasks',
  description: 'Retrieve multiple tasks from ClickUp by their IDs',
  inputSchema: {
    type: 'object',
    properties: {
      api_token: {
        type: 'string',
        description: 'ClickUp API token for authentication',
      },
      workspace_id: {
        type: 'string',
        description: 'ClickUp workspace ID',
      },
      task_ids: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of task IDs to retrieve',
      },
    },
    required: ['api_token', 'workspace_id', 'task_ids'],
  },
};

class ClickUpClient {
  private headers: { Authorization: string; 'Content-Type': string };
  private workspaceId: string;

  constructor(apiToken: string, workspaceId: string) {
    this.headers = {
      Authorization: apiToken,
      'Content-Type': 'application/json',
    };
    this.workspaceId = workspaceId;
  }

  async authenticate(): Promise<ClickUpUser> {
    const response = await fetch('https://api.clickup.com/api/v2/user', {
      headers: this.headers,
    });
    return response.json();
  }

  async getTask(taskId: string): Promise<ClickUpTask> {
    const response = await fetch(
      `https://api.clickup.com/api/v2/task/${taskId}?custom_task_ids=false&team_id=${this.workspaceId}&include_subtasks=true&include_markdown_description=true`,
      {
        headers: this.headers,
      }
    );
    return response.json();
  }

  async getTaskByCustomId(customId: string): Promise<ClickUpTask> {
    const response = await fetch(
      `https://api.clickup.com/api/v2/task/${customId}?custom_task_ids=true&team_id=${this.workspaceId}&include_subtasks=true&include_markdown_description=true`,
      {
        headers: this.headers,
      }
    );
    return response.json();
  }

  async getTasks(taskIds: string[]): Promise<{ tasks: ClickUpTask[] }> {
    const tasksUrl = `/team/${
      this.workspaceId
    }/task?include_markdown_description=true&include_subtasks=true&${taskIds
      .map((id) => `task_ids=${id}`)
      .join('&')}`;
    const response = await fetch(`https://api.clickup.com/api/v2${tasksUrl}`, {
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
            const { api_token, workspace_id } = request.params.arguments as {
              api_token: string;
              workspace_id: string;
            };
            if (!api_token || !workspace_id) {
              throw new Error(
                'Missing required arguments: api_token and workspace_id'
              );
            }
            const clickUpClient = new ClickUpClient(api_token, workspace_id);
            const response = await clickUpClient.authenticate();
            return {
              content: [{ type: 'text', text: JSON.stringify(response) }],
            };
          }

          case 'clickup_get_task': {
            const { api_token, task_id } = request.params.arguments as {
              api_token: string;
              task_id: string;
            };
            if (!api_token || !task_id) {
              throw new Error(
                'Missing required arguments: api_token and task_id'
              );
            }
            const clickUpClient = new ClickUpClient(api_token, '');
            const response = await clickUpClient.getTask(task_id);
            return {
              content: [{ type: 'text', text: JSON.stringify(response) }],
            };
          }

          case 'clickup_get_task_by_custom_id': {
            const { api_token, custom_id, workspace_id } = request.params
              .arguments as {
              api_token: string;
              custom_id: string;
              workspace_id: string;
            };
            if (!api_token || !custom_id || !workspace_id) {
              throw new Error(
                'Missing required arguments: api_token, custom_id, and workspace_id'
              );
            }
            const clickUpClient = new ClickUpClient(api_token, workspace_id);
            const response = await clickUpClient.getTaskByCustomId(custom_id);
            return {
              content: [{ type: 'text', text: JSON.stringify(response) }],
            };
          }

          case 'clickup_get_tasks': {
            const { api_token, workspace_id, task_ids } = request.params
              .arguments as {
              api_token: string;
              workspace_id: string;
              task_ids: string[];
            };
            if (!api_token || !workspace_id || !task_ids.length) {
              throw new Error(
                'Missing required arguments: api_token, workspace_id, and task_ids'
              );
            }
            const clickUpClient = new ClickUpClient(api_token, workspace_id);
            const response = await clickUpClient.getTasks(task_ids);
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
      tools: [authenticateTool, getTaskTool, getTaskByCustomIdTool],
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
