import React from 'react';
import { Flex, Form, Input, Typography } from 'antd';
import { MonacoEditorWrapper } from '../../../../../../shared/components/MonacoEditorWrapper';

const { Text } = Typography;

interface SqlCheckFieldsProps {
  fieldName: number;
}

export const SqlCheckFields: React.FC<SqlCheckFieldsProps> = ({
  fieldName,
}) => {
  return (
    <Flex vertical gap={16}>
      <div>
        <Text
          type="secondary"
          style={{ fontSize: 11, display: 'block', marginBottom: 8 }}
        >
          Query SQL (debe retornar 1 para aprobar, 0 para rechazar)
        </Text>
        <Form.Item name={[fieldName, 'params', 'querySql']} noStyle>
          <MonacoEditorWrapper height="150px" language="sql" />
        </Form.Item>
      </div>
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
