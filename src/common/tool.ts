import dottenv from 'dotenv';
import { defineTool } from '../utils/defineTool';
import ClickUpClient from './clickup';

dottenv.config();
const apiToken = process.env.CLICKUP_API_TOKEN;
const workspaceId = process.env.CLICKUP_WORKSPACE_ID;

if (!apiToken || !workspaceId) {
  console.error(
    'Please set CLICKUP_API_TOKEN and CLICKUP_WORKSPACE_ID environment variables'
  );
  process.exit(1);
}

const clickUpClient = new ClickUpClient(apiToken, workspaceId);

const authenticateTool = defineTool((z) => ({
  name: 'clickup_authenticate',
  description:
    'Authenticate with ClickUp API using an API token and workspace ID',
  inputSchema: {
    type: z.object({}),
  },
  handler: async (input) => {
    const response = await clickUpClient.authenticate();
    return {
      content: [{ type: 'text', text: JSON.stringify(response) }],
    };
  },
}));

const getTaskTool = defineTool((z) => ({
  name: 'clickup_get_task',
  description: 'Get a task by its ID',
  inputSchema: {
    type: z.object({
      task_id: z.string(),
    }),
  },
  handler: async (input) => {
    const { task_id } = input;
    const response = await clickUpClient.getTask(task_id);
    return {
      content: [{ type: 'text', text: JSON.stringify(response) }],
    };
  },
}));

const getTaskByCustomIdTool = defineTool((z) => ({
  name: 'clickup_get_task_by_custom_id',
  description: 'Get a task by its custom ID',
  inputSchema: {
    type: z.object({
      custom_id: z.string(),
    }),
  },
  handler: async (input) => {
    const { custom_id } = input;
    const response = await clickUpClient.getTaskByCustomId(custom_id);
    return {
      content: [{ type: 'text', text: JSON.stringify(response) }],
    };
  },
}));

const getTasksTool = defineTool((z) => ({
  name: 'clickup_get_tasks',
  description: 'Get multiple tasks by their IDs',
  inputSchema: {
    type: z.object({
      task_ids: z.array(z.string()),
    }),
  },
  handler: async (input) => {
    const { task_ids } = input;
    const response = await clickUpClient.getTasks(task_ids);
    return {
      content: [{ type: 'text', text: JSON.stringify(response) }],
    };
  },
}));

export { authenticateTool, getTaskByCustomIdTool, getTasksTool, getTaskTool };
