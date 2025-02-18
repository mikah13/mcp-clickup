import { Tool } from '@modelcontextprotocol/sdk/types.js';

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

export { authenticateTool, getTaskTool, getTaskByCustomIdTool, getTasksTool };
