#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ClickUpClient } from './common/clickup';
import {
  authenticateTool,
  getTaskByCustomIdTool,
  getTasksTool,
  getTaskTool,
} from './common/tool';
import { ToolError, formatErrorResponse } from './common/errors';

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
          throw new ToolError('No arguments provided', 'MISSING_ARGUMENTS');
        }

        switch (request.params.name) {
          case 'clickup_authenticate': {
            const { api_token, workspace_id } = request.params.arguments as {
              api_token: string;
              workspace_id: string;
            };
            if (!api_token || !workspace_id) {
              throw new ToolError(
                'Missing required arguments: api_token and workspace_id',
                'INVALID_ARGUMENTS',
                { required: ['api_token', 'workspace_id'] }
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
              throw new ToolError(
                'Missing required arguments: api_token and task_id',
                'INVALID_ARGUMENTS',
                { required: ['api_token', 'task_id'] }
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
              throw new ToolError(
                'Missing required arguments: api_token, custom_id, and workspace_id',
                'INVALID_ARGUMENTS',
                { required: ['api_token', 'custom_id', 'workspace_id'] }
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
              throw new ToolError(
                'Missing required arguments: api_token, workspace_id, and task_ids',
                'INVALID_ARGUMENTS',
                { required: ['api_token', 'workspace_id', 'task_ids'] }
              );
            }
            const clickUpClient = new ClickUpClient(api_token, workspace_id);
            const response = await clickUpClient.getTasks(task_ids);
            return {
              content: [{ type: 'text', text: JSON.stringify(response) }],
            };
          }

          default:
            throw new ToolError(
              `Unknown tool: ${request.params.name}`,
              'UNKNOWN_TOOL'
            );
        }
      } catch (error) {
        console.error('Error executing tool:', error);
        return formatErrorResponse(error);
      }
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error('Received ListToolsRequest');
    return {
      tools: [
        authenticateTool,
        getTaskTool,
        getTaskByCustomIdTool,
        getTasksTool,
      ],
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
