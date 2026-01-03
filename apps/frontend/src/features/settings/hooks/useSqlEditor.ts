import { useState, useEffect } from 'react';
import { dataSourceService } from '../services/dataSource.service';
import { message } from 'antd';

export const useSqlEditor = (initialTableName?: string) => {
  const [tables, setTables] = useState<{ label: string; value: string }[]>([]);
  const [columns, setColumns] = useState<{ label: string; value: string }[]>(
    []
  );
  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingColumns, setLoadingColumns] = useState(false);

  useEffect(() => {
    const fetchTables = async () => {
      setLoadingTables(true);
      try {
        const data = await dataSourceService.getTables();
        setTables(
          data.map(t => ({
            label: t.fullName,
            value: t.fullName,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch tables', error);
        message.error('Error al cargar las tablas');
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();
  }, []);

  const fetchColumns = async (tableName: string) => {
    if (!tableName) {
      setColumns([]);
      return;
    }
    setLoadingColumns(true);
    try {
      const data = await dataSourceService.getColumns(tableName);
      setColumns(
        data.map(c => ({
          label: `${c.columnName} (${c.dataType})`,
          value: c.columnName,
        }))
      );
    } catch (error) {
      console.error('Failed to fetch columns', error);
      message.error('Error al cargar las columnas');
    } finally {
      setLoadingColumns(false);
    }
  };

  // Fetch columns if initialTableName is provided
  useEffect(() => {
    if (initialTableName) {
      fetchColumns(initialTableName);
    }
  }, [initialTableName]);

  return {
    tables,
    columns,
    loadingTables,
    loadingColumns,
    fetchColumns,
  };
};
