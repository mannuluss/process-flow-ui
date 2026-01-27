import { useState, useEffect, useCallback } from 'react';
import { dataSourceService } from '../services/dataSource.service';
import { DataSource } from '@process-flow/common';
import { message } from 'antd';

export const useDataSources = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDataSources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataSourceService.getAll();
      // Map backend data to frontend model if necessary
      // For now assuming they match or we adapt here
      const mappedData = data.map(item => ({
        ...item,
        key: item.id, // Antd table needs a key
        status: item.status || 'SUCCESS', // Default status if not provided
      }));
      setDataSources(mappedData);
    } catch (err) {
      setError('Failed to fetch data sources');
      message.error('Error loading data sources');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDataSource = async (id: string) => {
    try {
      await dataSourceService.delete(id);
      message.success('Data source deleted successfully');
      fetchDataSources(); // Refresh list
    } catch (err) {
      message.error('Failed to delete data source');
      console.error(err);
    }
  };

  const createDataSource = async (data: any) => {
    try {
      await dataSourceService.create(data);
      message.success('Data source created successfully');
      fetchDataSources();
      return true;
    } catch (err) {
      message.error('Failed to create data source');
      console.error(err);
      return false;
    }
  };

  const updateDataSource = async (id: string, data: Partial<DataSource>) => {
    try {
      await dataSourceService.update(id, data);
      message.success('Data source updated successfully');
      fetchDataSources();
      return true;
    } catch (err) {
      message.error('Failed to update data source');
      console.error(err);
      return false;
    }
  };

  useEffect(() => {
    fetchDataSources();
  }, [fetchDataSources]);

  return {
    dataSources,
    loading,
    error,
    refetch: fetchDataSources,
    deleteDataSource,
    createDataSource,
    updateDataSource,
  };
};
