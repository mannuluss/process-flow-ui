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

// Cache para evitar múltiples llamadas al mismo DataSource
const optionsCache = new Map<string, DataSourceStatus[]>();

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
    // Check cache first
    const cached = optionsCache.get(dataSourceId);
    if (cached) {
      setOptions(cached);
      setLoading(false);
      //se continua por si acaso para recargar las opciones
    }

    setLoading(true);
    setError(null);

    try {
      const data = await dataSourceService.executeQuery(dataSourceId, params);
      setOptions(data);
      optionsCache.set(dataSourceId, data);
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
    // Clear cache and refetch
    optionsCache.delete(dataSourceId);
    await fetchOptions();
  }, [dataSourceId, fetchOptions]);

  return { options, loading, error, refetch };
};

/**
 * Invalida el cache de un DataSource específico
 */
export const invalidateDataSourceCache = (dataSourceId: string) => {
  optionsCache.delete(dataSourceId);
};

/**
 * Limpia todo el cache de DataSources
 */
export const clearDataSourceCache = () => {
  optionsCache.clear();
};
