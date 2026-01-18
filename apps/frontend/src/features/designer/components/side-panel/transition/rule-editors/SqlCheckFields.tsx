import React from 'react';
import { Flex, Form, Input, Typography } from 'antd';
import { MonacoEditorWrapper } from '../../../../../../app/components/shared/MonacoEditorWrapper';

const { Text } = Typography;

interface SqlCheckFieldsProps {
  fieldName: number;
}

export const SqlCheckFields: React.FC<SqlCheckFieldsProps> = ({
  fieldName,
}) => {
  return (
    <Flex vertical gap={8}>
      <Form.Item
        name={[fieldName, 'params', 'sql']}
        label={<Text style={{ fontSize: 11 }}>Consulta SQL</Text>}
        style={{ marginBottom: 0 }}
      >
        <MonacoEditorWrapper height="150px" />
      </Form.Item>
      <Form.Item
        name={[fieldName, 'params', 'errorMessage']}
        label={<Text style={{ fontSize: 11 }}>Mensaje de Error</Text>}
        style={{ marginBottom: 0 }}
      >
        <Input placeholder="Mensaje si la validación falla" />
      </Form.Item>
    </Flex>
  );
};
