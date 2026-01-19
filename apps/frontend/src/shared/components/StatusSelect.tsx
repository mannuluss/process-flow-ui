import React from 'react';
import { AutoComplete, Spin } from 'antd';
import {
  useDataSourceOptions,
  DataSourceStatus,
} from '../hooks/useDataSourceOptions';

interface StatusSelectProps {
  value?: string;
  onChange?: (id: string, option?: DataSourceStatus) => void;
  placeholder?: string;
  dataSourceId?: string;
  style?: React.CSSProperties;
}

/**
 * Select de estados que carga opciones desde un DataSource.
 * Permite escribir valores custom además de seleccionar de la lista.
 */
export const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  placeholder = 'Seleccione o escriba un estado',
  dataSourceId = 'DS_STATUS',
  style,
}) => {
  const { options, loading, error } = useDataSourceOptions(dataSourceId);

  // Transform options for AutoComplete - show label, but keep id reference
  const autoCompleteOptions = options.map(opt => ({
    value: opt.label, // What user sees and types
    key: opt.id, // Internal reference
    id: opt.id,
    label: opt.label,
  }));

  // Find the label for the current value (which is an id)
  const displayValue =
    options.find(opt => opt.id === value)?.label || value || '';

  const handleChange = (val: string) => {
    // Find the option by label to get the id
    const selectedOption = options.find(opt => opt.label === val);
    if (selectedOption) {
      onChange?.(selectedOption.id, selectedOption);
    } else {
      // Custom value - use the typed text as both id and label
      onChange?.(val, { id: val, label: val });
    }
  };

  const handleSelect = (
    _val: string,
    option: { value: string; key: string; id: string; label: string }
  ) => {
    onChange?.(option.id, { id: option.id, label: option.label });
  };

  if (error) {
    console.warn(`StatusSelect error: ${error}`);
  }

  return (
    <AutoComplete
      value={displayValue}
      onChange={handleChange}
      onSelect={handleSelect}
      placeholder={placeholder}
      style={{ width: '100%', ...style }}
      options={autoCompleteOptions}
      filterOption={(inputValue, option) =>
        option?.label?.toLowerCase().includes(inputValue.toLowerCase()) ?? false
      }
      notFoundContent={loading ? <Spin size="small" /> : null}
    />
  );
};
