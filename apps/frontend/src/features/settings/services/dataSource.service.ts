import { apiClient } from '../../../core/api/client';
import { DataSource } from '@process-flow/common';

export class DataSourceService {
  async getAll(): Promise<DataSource[]> {
    const response = await apiClient.get<DataSource[]>('/data-source');
    return response.data;
  }

  async getById(id: string): Promise<DataSource> {
    const response = await apiClient.get<DataSource>(`/data-source/${id}`);
    return response.data;
  }

  async create(
    data: Omit<DataSource, 'id' | 'status' | 'createdAt' | 'updatedAt'> & {
      id: string;
    }
  ): Promise<DataSource> {
    const response = await apiClient.post<DataSource>('/data-source', data);
    return response.data;
  }

  async update(id: string, data: Partial<DataSource>): Promise<DataSource> {
    const response = await apiClient.patch<DataSource>(
      `/data-source/${id}`,
      data
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/data-source/${id}`);
  }

  async testConfig(
    config: Partial<DataSource>
  ): Promise<{ status: 'success' | 'error'; message: string; data?: any }> {
    const response = await apiClient.post<{
      status: 'success' | 'error';
      message: string;
      data?: any;
    }>('/data-source/test-config', { config });
    return response.data;
  }

  async getTables(): Promise<
    { fullName: string; tableName: string; schema: string }[]
  > {
    const response = await apiClient.get('/data-source/schema/tables');
    return response.data;
  }

  async getColumns(
    tableName: string
  ): Promise<{ columnName: string; dataType: string }[]> {
    const response = await apiClient.get(
      `/data-source/schema/tables/${tableName}/columns`
    );
    return response.data;
  }
}

export const dataSourceService = new DataSourceService();
