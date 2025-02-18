import { ClickUpTask, ClickUpUser } from './type';

const BASE_URL = 'https://api.clickup.com/api/v2';

export class ClickUpClient {
  private headers: { Authorization: string; 'Content-Type': string };
  private workspaceId: string;

  constructor(apiToken: string, workspaceId: string) {
    this.headers = {
      Authorization: apiToken,
      'Content-Type': 'application/json',
    };
    this.workspaceId = workspaceId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: this.headers,
    });
    return response.json();
  }

  async authenticate(): Promise<ClickUpUser> {
    return this.request<ClickUpUser>('/user');
  }

  async getTask(taskId: string): Promise<ClickUpTask> {
    return this.request<ClickUpTask>(
      `/task/${taskId}?custom_task_ids=false&team_id=${this.workspaceId}&include_subtasks=true&include_markdown_description=true`
    );
  }

  async getTaskByCustomId(customId: string): Promise<ClickUpTask> {
    return this.request<ClickUpTask>(
      `/task/${customId}?custom_task_ids=true&team_id=${this.workspaceId}&include_subtasks=true&include_markdown_description=true`
    );
  }

  async getTasks(taskIds: string[]): Promise<{ tasks: ClickUpTask[] }> {
    const tasksUrl = `/team/${
      this.workspaceId
    }/task?include_markdown_description=true&include_subtasks=true&${taskIds
      .map((id) => `task_ids=${id}`)
      .join('&')}`;
    return this.request<{ tasks: ClickUpTask[] }>(tasksUrl);
  }
}

export default ClickUpClient;
