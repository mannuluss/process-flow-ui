import React from 'react';
import { Card, Flex, Typography, theme } from 'antd';
import { ThunderboltFilled, RightOutlined } from '@ant-design/icons';
import { NodeHandler } from '@process-flow/common';
import { RuleTypeIcon } from '../../../../../../shared/components/RuleTypeIcon';

const { Text } = Typography;

interface HandlerCardProps {
  handler: NodeHandler;
  targetLabel: string | null;
  onClick: () => void;
}

export const HandlerCard: React.FC<HandlerCardProps> = ({
  handler,
  targetLabel,
  onClick,
}) => {
  const { token } = theme.useToken();

  const triggerName = handler.trigger || 'Sin Evento';
  const rules = handler.rules || [];
  const ruleCount = rules.length;

  return (
    <Card
      hoverable
      size="small"
      variant="borderless"
      onClick={onClick}
      style={{
        marginBottom: 8,
        backgroundColor: token.colorFillQuaternary,
        borderColor: token.colorBorderSecondary,
      }}
    >
      <Flex justify="space-between" align="center">
        <Flex vertical gap="small" style={{ flex: 1 }}>
          <Flex gap={8} align="center">
            <div
              style={{
                width: 32,
                height: 32,
                borderColor: token.colorWarningBorder,
                backgroundColor: token.colorWarningBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: token.colorWarning,
                flexShrink: 0,
              }}
            >
              <ThunderboltFilled />
            </div>
            <Text strong ellipsis>
              {triggerName}
            </Text>
          </Flex>
          <Flex vertical gap={8} wrap>
            {targetLabel ? (
              <Text type="secondary">
                Conectado a: <Text strong>{targetLabel}</Text>
              </Text>
            ) : (
              <Text type="warning" italic>
                Sin conexión
              </Text>
            )}

            <Card variant="outlined" size="small">
              {ruleCount > 0 ? (
                <Flex vertical gap={4} style={{ marginTop: 4 }}>
                  {rules.map((rule, idx) => (
                    <Flex key={idx} gap={8}>
                      <RuleTypeIcon type={rule.type} size={12} />
                      {rule.type}
                    </Flex>
                  ))}
                </Flex>
              ) : (
                <Text type="secondary">Sin reglas (Transición directa)</Text>
              )}
            </Card>
          </Flex>
        </Flex>
        <RightOutlined style={{ color: token.colorTextQuaternary }} />
      </Flex>
    </Card>
  );
};
