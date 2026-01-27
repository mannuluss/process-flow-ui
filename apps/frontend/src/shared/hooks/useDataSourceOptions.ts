import { useState, useEffect, useCallback } from 'react';
import { dataSourceService } from '../../features/settings/services/dataSource.service';

export interface DataSourceStatus {
  id: string;
  label: string;
}

interface UseDataSourceOptionsReturn {
  options: DataSourceStatus[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener opciones desde un DataSource
 * @param dataSourceId - ID del DataSource (ej: "DS_STATUS")
 * @param params - Parámetros opcionales para la query
 */
export const useDataSourceOptions = (
  dataSourceId: string,
  params?: Record<string, any>
): UseDataSourceOptionsReturn => {
  const [options, setOptions] = useState<DataSourceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOptions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await dataSourceService.executeQuery(dataSourceId, params);
      setOptions(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar opciones';
      setError(message);
      console.error(`Error fetching DataSource ${dataSourceId}:`, err);
    } finally {
      setLoading(false);
    }
  }, [dataSourceId, params]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const refetch = useCallback(async () => {
    await fetchOptions();
  }, [fetchOptions]);

  return { options, loading, error, refetch };
};
