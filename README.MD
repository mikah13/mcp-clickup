# ClickUp MCP Server

[![smithery badge](https://smithery.ai/badge/@mikah13/mcp-clickup)](https://smithery.ai/server/@mikah13/mcp-clickup)

MCP Server for the ClickUp API, enabling Claude to interact with ClickUp workspaces.

## Tools

1. `clickup_authenticate`
   - Authenticate with ClickUp API using an API token and workspace ID
   - Required inputs:
     - `api_token` (string): ClickUp API token for authentication
     - `workspace_id` (string): ClickUp workspace ID for authentication
   - Returns: User information and authentication status

2. `clickup_get_task`
   - Retrieve a task from ClickUp by task ID
   - Required inputs:
     - `api_token` (string): ClickUp API token for authentication
     - `task_id` (string): The ID of the ClickUp task to retrieve
   - Returns: Detailed task information including description, status, and metadata

3. `clickup_get_task_by_custom_id`
   - Retrieve a task from ClickUp by custom ID
   - Required inputs:
     - `api_token` (string): ClickUp API token for authentication
     - `custom_id` (string): The custom ID of the ClickUp task to retrieve
     - `workspace_id` (string): The workspace ID required for the API request
   - Returns: Detailed task information including description, status, and metadata

4. `clickup_get_tasks`
   - Retrieve multiple tasks from ClickUp by their IDs
   - Required inputs:
     - `api_token` (string): ClickUp API token for authentication
     - `workspace_id` (string): ClickUp workspace ID
     - `task_ids` (string[]): List of task IDs to retrieve
   - Returns: List of tasks with their complete information

## Setup

1. Get your ClickUp API Token:
   - Log in to your ClickUp account
   - Go to Settings → Apps
   - Click "Generate API Token"
   - Copy your API token

2. Get your Workspace ID:
   - Open ClickUp in your browser
   - The Workspace ID is in the URL: `https://app.clickup.com/{workspace_id}/home`
   - It's a number that starts with a number

### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`:

#### npx

```json
{
  "mcpServers": {
    "clickup": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-clickup"
      ],
      "env": {
        "CLICKUP_API_TOKEN": "your-api-token",
        "CLICKUP_WORKSPACE_ID": "your-workspace-id"
      }
    }
  }
}
```

#### docker

```json
{
  "mcpServers": {
    "clickup": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "CLICKUP_API_TOKEN",
        "-e",
        "CLICKUP_WORKSPACE_ID",
        "mcp/clickup"
      ],
      "env": {
        "CLICKUP_API_TOKEN": "your-api-token",
        "CLICKUP_WORKSPACE_ID": "your-workspace-id"
      }
    }
  }
}
```

### Troubleshooting

If you encounter errors, verify that:
1. Your API token is valid and has not expired
2. The workspace ID is correct
3. You have the necessary permissions in the ClickUp workspace
4. The task IDs you're trying to access exist and are accessible to you

## Build

Docker build:

```bash
docker build -t mcp/clickup .
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
