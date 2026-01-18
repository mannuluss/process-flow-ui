import React from 'react';
import { Form, Select, Typography } from 'antd';

const { Text } = Typography;

interface RoleCheckFieldsProps {
  fieldName: number;
}

export const RoleCheckFields: React.FC<RoleCheckFieldsProps> = ({
  fieldName,
}) => {
  return (
    <Form.Item
      name={[fieldName, 'params', 'allowedRoles']}
      label={<Text style={{ fontSize: 11 }}>Roles Permitidos</Text>}
      style={{ marginBottom: 0 }}
    >
      <Select
        mode="tags"
        placeholder="Escriba y presione enter (Ej: ADMIN)"
        style={{ width: '100%' }}
        options={[
          { value: 'ADMIN', label: 'ADMIN' },
          { value: 'USER', label: 'USER' },
          { value: 'MANAGER', label: 'MANAGER' },
        ]}
      />
    </Form.Item>
  );
};
