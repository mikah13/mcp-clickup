import { Tool } from '@modelcontextprotocol/sdk/types.js';

const authenticateTool: Tool = {
  name: 'clickup_authenticate',
  description:
    'Authenticate with ClickUp API using an API token and workspace ID',
  inputSchema: {
    type: 'object',
  },
};

const getTaskTool: Tool = {
  name: 'clickup_get_task',
  description: 'Retrieve a task from ClickUp by task ID',
  inputSchema: {
    type: 'object',
    properties: {
      task_id: {
        type: 'string',
        description: 'The ID of the ClickUp task to retrieve',
      },
    },
    required: ['task_id'],
  },
};

const getTaskByCustomIdTool: Tool = {
  name: 'clickup_get_task_by_custom_id',
  description: 'Retrieve a task from ClickUp by custom ID',
  inputSchema: {
    type: 'object',
    properties: {
      custom_id: {
        type: 'string',
        description: 'The custom ID of the ClickUp task to retrieve',
      },
    },
    required: ['custom_id'],
  },
};

const getTasksTool: Tool = {
  name: 'clickup_get_tasks',
  description: 'Retrieve multiple tasks from ClickUp by their IDs',
  inputSchema: {
    type: 'object',
    properties: {
      task_ids: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of task IDs to retrieve',
      },
    },
    required: ['task_ids'],
  },
};

export { authenticateTool, getTaskByCustomIdTool, getTasksTool, getTaskTool };

