import React from 'react';
import { Flex, Form, Select, Typography } from 'antd';
import { useDataSourceOptions } from '@shared/hooks/useDataSourceOptions';

const { Text } = Typography;

interface DocumentStatusFieldsProps {
  fieldName: number;
}

export const DocumentStatusFields: React.FC<DocumentStatusFieldsProps> = ({
  fieldName,
}) => {
  const { options: documentOptions, loading: loadingDocs } =
    useDataSourceOptions('DS_DOCUMENT');
  const { options: statusOptions, loading: loadingStatus } =
    useDataSourceOptions('DS_DOCUMENT_STATUS');

  return (
    <Flex vertical gap={8}>
      <Form.Item
        name={[fieldName, 'params', 'documentId']}
        label={<Text style={{ fontSize: 11 }}>Documento</Text>}
        style={{ marginBottom: 0 }}
      >
        <Select
          placeholder="Seleccione Documento"
          loading={loadingDocs}
          options={documentOptions.map(opt => ({
            label: opt.label,
            value: opt.id, // Assuming the ID is the value here
          }))}
        />
      </Form.Item>
      <Form.Item
        name={[fieldName, 'params', 'requiredStatus']}
        label={<Text style={{ fontSize: 11 }}>Estado Requerido</Text>}
        style={{ marginBottom: 0 }}
      >
        <Select
          placeholder="Seleccione Estado"
          loading={loadingStatus}
          options={statusOptions.map(opt => ({
            label: opt.label,
            value: opt.id, // Assuming value is the ID or Code
          }))}
        />
      </Form.Item>
    </Flex>
  );
};
