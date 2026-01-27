import React from 'react';
import { Flex, Form, Input, Select, Typography } from 'antd';

const { Text } = Typography;

interface ApiCheckFieldsProps {
  fieldName: number;
}

export const ApiCheckFields: React.FC<ApiCheckFieldsProps> = ({
  fieldName,
}) => {
  return (
    <Flex vertical gap={8}>
      <Flex gap={8}>
        <Form.Item
          name={[fieldName, 'params', 'method']}
          label={<Text style={{ fontSize: 11 }}>Método</Text>}
          style={{ marginBottom: 0, width: 100 }}
        >
          <Select
            options={[
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name={[fieldName, 'params', 'endpoint']}
          label={<Text style={{ fontSize: 11 }}>Endpoint</Text>}
          style={{ marginBottom: 0, flex: 1 }}
        >
          <Input placeholder="/api/check-status" />
        </Form.Item>
      </Flex>
      <Flex gap={8}>
        <Form.Item
          name={[fieldName, 'params', 'expectedField']}
          label={<Text style={{ fontSize: 11 }}>Campo Esperado</Text>}
          style={{ marginBottom: 0, flex: 1 }}
        >
          <Input placeholder="status" />
        </Form.Item>
        <Form.Item
          name={[fieldName, 'params', 'expectedValue']}
          label={<Text style={{ fontSize: 11 }}>Valor Esperado</Text>}
          style={{ marginBottom: 0, flex: 1 }}
        >
          <Input placeholder="true" />
        </Form.Item>
      </Flex>
    </Flex>
  );
};
