import React from 'react';
import { Flex, Form, Select, Typography } from 'antd';

const { Text } = Typography;

interface DocumentStatusFieldsProps {
  fieldName: number;
}

export const DocumentStatusFields: React.FC<DocumentStatusFieldsProps> = ({
  fieldName,
}) => {
  return (
    <Flex vertical gap={8}>
      <Form.Item
        name={[fieldName, 'params', 'documentId']}
        label={<Text style={{ fontSize: 11 }}>Documento</Text>}
        style={{ marginBottom: 0 }}
      >
        <Select
          placeholder="Seleccione Documento"
          options={[
            { value: 'invoice', label: 'Factura' },
            { value: 'order', label: 'Orden de Compra' },
          ]}
        />
      </Form.Item>
      <Form.Item
        name={[fieldName, 'params', 'requiredStatus']}
        label={<Text style={{ fontSize: 11 }}>Estado Requerido</Text>}
        style={{ marginBottom: 0 }}
      >
        <Select
          placeholder="Seleccione Estado"
          options={[
            { value: 'APPROVED', label: 'Aprobado' },
            { value: 'PENDING', label: 'Pendiente' },
            { value: 'REJECTED', label: 'Rechazado' },
          ]}
        />
      </Form.Item>
    </Flex>
  );
};
