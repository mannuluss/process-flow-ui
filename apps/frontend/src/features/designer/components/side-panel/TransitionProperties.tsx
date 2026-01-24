import React from 'react';
import { RuleType } from '@process-flow/common';
import {
  Button,
  Card,
  Dropdown,
  Flex,
  Form,
  Input,
  List,
  theme,
  Typography,
} from 'antd';
import {
  PlusCircleOutlined,
  ThunderboltOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { RuleTypeIcon } from '../../../../shared/components/RuleTypeIcon';
import { useTransitionForm } from './transition/hooks/useTransitionForm';
import {
  RoleCheckFields,
  DocumentStatusFields,
  SqlCheckFields,
  ApiCheckFields,
} from './transition/rule-editors';
import { useCommand } from '@commands/context/CommandContext';
import { PanelHeader } from './components';
import type { PanelProps, HandlerPayload } from './types';

const { Text } = Typography;

export const TransitionProperties: React.FC<PanelProps<HandlerPayload>> = ({
  payload,
  onClose,
}) => {
  const { token } = theme.useToken();
  const { commandManager, generateContextApp } = useCommand();

  const handleUpdate = (updatedHandler: typeof payload.handler) => {
    const context = generateContextApp('Node');
    commandManager.executeCommand('updateHandler', {
      ...context,
      object: {
        nodeId: payload.nodeId,
        handlerId: payload.handlerId,
        handler: updatedHandler,
      },
    });
  };

  const handleDelete = () => {
    const context = generateContextApp('Node');
    commandManager.executeCommand('removeHandler', {
      ...context,
      object: {
        nodeId: payload.nodeId,
        handlerId: payload.handlerId,
      },
    });
    onClose();
  };

  const { form, handleValuesChange, flushSave, getRule, ruleTypeMenuItems } =
    useTransitionForm({
      handler: payload.handler,
      onUpdate: handleUpdate,
    });

  // Flush pending saves before closing
  const handleClose = () => {
    flushSave();
    onClose();
  };

  return (
    <Flex
      vertical
      style={{ height: '100%', backgroundColor: token.colorBgContainer }}
    >
      <PanelHeader title="Propiedades de Transición" onClose={handleClose} />

      {/* Content */}
      <Flex vertical flex={1} style={{ overflowY: 'auto' }}>
        <Form
          form={form}
          layout="vertical"
          style={{ height: '100%' }}
          onValuesChange={handleValuesChange}
        >
          {/* Trigger Section */}
          <div
            style={{
              padding: '24px',
              backgroundColor: token.colorFillQuaternary,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Flex gap="middle" align="start">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: token.borderRadius,
                  backgroundColor: token.colorBgContainer,
                  border: `1px solid ${token.colorWarning}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: token.boxShadow,
                }}
              >
                <ThunderboltOutlined
                  style={{ fontSize: 20, color: token.colorWarning }}
                />
              </div>
              <Flex vertical flex={1}>
                <Form.Item
                  name="trigger"
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
                      Evento (Trigger)
                    </Text>
                  }
                  style={{ marginBottom: 8 }}
                >
                  <Input
                    placeholder="Ej: BTN_SUBMIT"
                    style={{ fontFamily: 'monospace' }}
                  />
                </Form.Item>
                <Text type="secondary" style={{ fontSize: 10 }}>
                  Identificador del evento que dispara esta transición.
                </Text>
              </Flex>
            </Flex>
          </div>

          {/* Rules List */}
          <div style={{ padding: '24px' }}>
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: 16 }}
            >
              <Text
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: token.colorTextSecondary,
                  fontWeight: 'bold',
                }}
              >
                Reglas de Validación
              </Text>
              <Dropdown menu={{ items: ruleTypeMenuItems }} trigger={['click']}>
                <Button
                  type="text"
                  size="small"
                  icon={<PlusCircleOutlined />}
                  style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: token.colorPrimary,
                    backgroundColor: token.colorPrimaryBg,
                  }}
                >
                  NUEVA REGLA
                </Button>
              </Dropdown>
            </Flex>

            <Form.List name="rules">
              {(fields, { remove }) => (
                <List
                  dataSource={fields}
                  locale={{ emptyText: 'No hay reglas configuradas.' }}
                  renderItem={(field, index) => {
                    const rule = getRule(index);

                    return (
                      <Card
                        size="small"
                        style={{
                          marginBottom: 8,
                          backgroundColor: token.colorBgContainer,
                          borderColor: token.colorBorderSecondary,
                        }}
                        styles={{ body: { padding: '12px' } }}
                      >
                        <Flex
                          justify="space-between"
                          align="center"
                          style={{ marginBottom: 12 }}
                        >
                          <Flex align="center" gap="small">
                            <RuleTypeIcon type={rule?.type} />
                            <Text strong style={{ fontSize: 12 }}>
                              {rule?.type}
                            </Text>
                          </Flex>
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        </Flex>

                        {rule?.type === RuleType.ROLE_CHECK && (
                          <RoleCheckFields fieldName={field.name} />
                        )}

                        {rule?.type === RuleType.DOCUMENT_STATUS_CHECK && (
                          <DocumentStatusFields fieldName={field.name} />
                        )}

                        {rule?.type === RuleType.SQL_CHECK_CUSTOM && (
                          <SqlCheckFields fieldName={field.name} />
                        )}

                        {rule?.type === RuleType.API_CHECK_CUSTOM && (
                          <ApiCheckFields fieldName={field.name} />
                        )}
                      </Card>
                    );
                  }}
                />
              )}
            </Form.List>
          </div>
        </Form>
      </Flex>

      {/* Footer */}
      <div
        style={{
          padding: '16px',
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          backgroundColor: token.colorBgContainer,
          zIndex: 10,
        }}
      >
        <Button
          danger
          icon={<DeleteOutlined />}
          block
          onClick={handleDelete}
          style={{
            backgroundColor: token.colorErrorBg,
            borderColor: token.colorErrorBorder,
          }}
        >
          Eliminar Transición
        </Button>
      </div>
    </Flex>
  );
};
