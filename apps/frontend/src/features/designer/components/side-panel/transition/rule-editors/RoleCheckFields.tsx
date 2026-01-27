import React from 'react';
import { Form, Select, Typography } from 'antd';
import { useDataSourceOptions } from '@shared/hooks/useDataSourceOptions';

const { Text } = Typography;

interface RoleCheckFieldsProps {
  fieldName: number;
}

export const RoleCheckFields: React.FC<RoleCheckFieldsProps> = ({
  fieldName,
}) => {
  const { options, loading } = useDataSourceOptions('DB_ROLES');

  return (
    <Form.Item
      name={[fieldName, 'params', 'allowedRoles']}
      label={<Text style={{ fontSize: 11 }}>Roles Permitidos</Text>}
      style={{ marginBottom: 0 }}
    >
      <Select
        mode="tags"
        placeholder="Seleccione roles"
        style={{ width: '100%' }}
        loading={loading}
        options={options.map(opt => ({
          label: opt.label,
          value: opt.id,
        }))}
      />
    </Form.Item>
  );
};
