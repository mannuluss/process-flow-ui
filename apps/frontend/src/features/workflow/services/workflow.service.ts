import { apiClient } from '../../../core/api/client';
import type {
  Workflow,
  CreateWorkflowDto,
  UpdateWorkflowDto,
} from '@process-flow/common';

class WorkflowService {
  private readonly baseUrl = '/workflow';

  async getAll(): Promise<Workflow[]> {
    const response = await apiClient.get<Workflow[]>(this.baseUrl);
    return response.data;
  }

  async getOne(id: string): Promise<Workflow> {
    const response = await apiClient.get<Workflow>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreateWorkflowDto): Promise<Workflow> {
    const response = await apiClient.post<Workflow>(this.baseUrl, data);
    return response.data;
  }

  async update(id: string, data: UpdateWorkflowDto): Promise<Workflow> {
    const response = await apiClient.patch<Workflow>(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async duplicate(id: string): Promise<Workflow> {
    // Fetch the workflow first
    const response = await apiClient.get<Workflow>(`${this.baseUrl}/${id}`);
    const original = response.data;

    // Create a copy
    const copy = {
      ...original,
      id: undefined,
      name: `${original.name} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined,
    };

    const createResponse = await apiClient.post<Workflow>(this.baseUrl, copy);
    return createResponse.data;
  }
}

export const workflowService = new WorkflowService();
export type { Workflow, CreateWorkflowDto, UpdateWorkflowDto };
