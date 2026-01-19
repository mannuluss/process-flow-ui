import React from 'react';
import { Flex, Form, Input, Typography, theme } from 'antd';
import type { FormInstance } from 'antd';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { IconPicker } from '../../../../../../shared/components/IconPicker';

const { Text, Title } = Typography;

/**
 * Header for Initial Node - Shows rocket icon and description
 */
export const InitialNodeHeader: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Flex gap="middle" align="center">
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: `${token.colorSuccess}15`,
          border: `2px solid ${token.colorSuccess}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <RocketLaunchIcon
          style={{
            color: token.colorSuccess,
            fontSize: 24,
            width: 24,
            height: 24,
          }}
        />
      </div>
      <Flex vertical gap={4}>
        <Title level={5} style={{ margin: 0, color: token.colorSuccess }}>
          Nodo Inicial
        </Title>
        <Text type="secondary">
          Punto de entrada del workflow. Define los activadores que inician el
          flujo.
        </Text>
      </Flex>
    </Flex>
  );
};

/**
 * Header for Regular Node - Shows form with icon picker and label input
 */
interface RegularNodeHeaderProps {
  form: FormInstance;
  onValuesChange: (changedValues: unknown, allValues: any) => void;
}

export const RegularNodeHeader: React.FC<RegularNodeHeaderProps> = ({
  form,
  onValuesChange,
}) => {
  const { token } = theme.useToken();

  return (
    <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
      <Flex gap="middle" align="center">
        <Form.Item name="icon" noStyle>
          <IconPicker size={24} />
        </Form.Item>
        <Flex vertical flex={1}>
          <Form.Item
            name="label"
            label={
              <Text
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: token.colorTextSecondary,
                  fontWeight: 'bold',
                }}
              >
                Nombre del Estado
              </Text>
            }
            style={{ marginBottom: 16 }}
          >
            <Input placeholder="Nombre del nodo" />
          </Form.Item>
        </Flex>
      </Flex>
    </Form>
  );
};
