import React from 'react';
import {
  Flex,
  Typography,
  Input,
  Select,
  theme,
  Button,
  Form,
  Space,
} from 'antd';
import {
  GlobalOutlined,
  LinkOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { TextArea } = Input;

export const ApiEditor: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Flex vertical gap={24}>
      {/* Header */}
      <Space>
        <GlobalOutlined style={{ color: token.colorPrimary }} />
        <Text strong>Configuración API REST</Text>
      </Space>
      {/* Configuración de Conexión */}
      <Flex vertical gap={16}>
        <Flex gap={16}>
          <div style={{ width: '120px' }}>
            <Form.Item name="apiMethod" label="Método" initialValue="GET">
              <Select
                options={[
                  { value: 'GET', label: 'GET' },
                  { value: 'POST', label: 'POST' },
                  { value: 'PUT', label: 'PUT' },
                ]}
              />
            </Form.Item>
          </div>
          <div style={{ flex: 1 }}>
            <Form.Item
              name="apiUrl"
              label="Endpoint URL"
              rules={[
                { required: true, message: 'La URL es requerida' },
                { type: 'url', message: 'URL inválida' },
              ]}
            >
              <Input
                prefix={<LinkOutlined />}
                placeholder="https://api.example.com/v1/resource"
              />
            </Form.Item>
          </div>
        </Flex>

        <div>
          <Text strong style={{ fontSize: '14px' }}>
            Headers
          </Text>
          <Form.List name="apiHeadersList">
            {(fields, { add, remove }) => (
              <div style={{ marginTop: 8 }}>
                {fields.map(({ key, name, ...restField }) => (
                  <Flex
                    key={key}
                    gap={8}
                    align="start"
                    style={{ marginBottom: 8 }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      style={{ flex: 1, marginBottom: 0 }}
                      rules={[{ required: true, message: 'Key requerida' }]}
                    >
                      <Input placeholder="Header Key (e.g. Authorization)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      style={{ flex: 1, marginBottom: 0 }}
                      rules={[{ required: true, message: 'Value requerido' }]}
                    >
                      <Input placeholder="Value" />
                    </Form.Item>
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                      danger
                    />
                  </Flex>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Agregar Header
                </Button>
              </div>
            )}
          </Form.List>
        </div>

        <Form.Item
          noStyle
          shouldUpdate={(prev, current) => prev.apiMethod !== current.apiMethod}
        >
          {({ getFieldValue }) =>
            getFieldValue('apiMethod') !== 'GET' ? (
              <Form.Item name="apiBody" label="Request Body (JSON)">
                <TextArea
                  rows={4}
                  placeholder='{ "key": "value" }'
                  style={{ fontFamily: 'monospace' }}
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>
      </Flex>
    </Flex>
  );
};
