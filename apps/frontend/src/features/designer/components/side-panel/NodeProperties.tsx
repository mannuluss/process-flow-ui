import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import debounce from 'lodash.debounce';
import { AppNode } from 'src/app/customs/nodes/types';
import { NodeHandler } from '@process-flow/common';
import { Button, Card, Flex, Form, Input, List, theme, Typography } from 'antd';
import {
  CloseOutlined,
  PlusOutlined,
  ThunderboltFilled,
  RightOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { RuleTypeIcon } from '../../../../shared/components/RuleTypeIcon';
import { useCommand } from '@commands/manager/CommandContext';
import type { PanelProps } from './types';

const { Text, Title } = Typography;

export const NodeProperties: React.FC<PanelProps<AppNode>> = ({
  payload,
  onClose,
}) => {
  const { getEdges, getNodes } = useReactFlow();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const { commandManager, generateContextApp } = useCommand();

  // Get handlers from node data
  const handlers: NodeHandler[] = (payload.data as any).handlers || [];
  const nodes = getNodes();
  const edges = getEdges();

  useEffect(() => {
    form.setFieldsValue({
      label: payload.data.label || '',
    });
  }, [payload, form]);

  // Ref para mantener payload actualizado en el closure del debounce
  const payloadRef = useRef(payload);
  useEffect(() => {
    payloadRef.current = payload;
  }, [payload]);

  // Debounced save function
  const debouncedSave = useMemo(
    () =>
      debounce((values: { label: string }) => {
        const updatedNode: AppNode = {
          ...payloadRef.current,
          data: {
            ...payloadRef.current.data,
            label: values.label,
          },
        };
        commandManager.executeCommand(
          'updateNode',
          generateContextApp('Node', updatedNode)
        );
      }, 400),
    [commandManager, generateContextApp]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  const handleValuesChange = useCallback(
    (_changedValues: unknown, allValues: { label: string }) => {
      debouncedSave(allValues);
    },
    [debouncedSave]
  );

  const flushSave = useCallback(() => {
    debouncedSave.flush();
  }, [debouncedSave]);

  const handleClose = () => {
    flushSave();
    onClose();
  };

  const handleDelete = () => {
    commandManager.executeCommand(
      'removeNode',
      generateContextApp('Node', payload)
    );
    onClose();
  };

  const handleEditHandler = (handler: NodeHandler) => {
    const context = generateContextApp('Node');
    commandManager.executeCommand('editHandler', {
      ...context,
      object: { nodeId: payload.id, handlerId: handler.id },
    });
  };

  const handleAddHandler = () => {
    const context = generateContextApp('Node');
    commandManager.executeCommand('addHandler', {
      ...context,
      object: { nodeId: payload.id },
    });
  };

  // Helper to get target node label for a handler
  const getTargetLabel = (handler: NodeHandler): string | null => {
    const edge = edges.find(
      e => e.source === payload.id && e.sourceHandle === handler.id
    );
    if (!edge) return null;
    const targetNode = nodes.find(n => n.id === edge.target) as AppNode;
    return targetNode?.data?.label || edge.target;
  };

  return (
    <Flex
      vertical
      style={{ height: '100%', backgroundColor: token.colorBgContainer }}
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        style={{
          padding: '16px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Propiedades de Nodo
        </Title>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleClose}
          style={{ color: token.colorTextSecondary }}
        />
      </Flex>

      {/* Content */}
      <Flex vertical flex={1} style={{ overflowY: 'auto' }}>
        {/* Node Header / Icon */}
        <div
          style={{
            padding: '24px',
            backgroundColor: token.colorFillQuaternary,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
          >
            <Flex gap="middle" align="center">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: token.borderRadius,
                  backgroundColor: token.colorBgContainer,
                  border: `1px solid ${token.colorPrimary}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: token.boxShadow,
                }}
              >
                <AppstoreAddOutlined
                  style={{ fontSize: 20, color: token.colorPrimary }}
                />
              </div>
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
        </div>

        {/* Handlers List */}
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
              Handlers de Salida
            </Text>
            <Button
              type="text"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddHandler}
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: token.colorPrimary,
                backgroundColor: token.colorPrimaryBg,
              }}
            >
              AGREGAR
            </Button>
          </Flex>

          <List
            dataSource={handlers}
            locale={{ emptyText: 'No hay handlers de salida configurados.' }}
            renderItem={handler => {
              const triggerName = handler.trigger || 'Sin Evento';
              const targetLabel = getTargetLabel(handler);
              const rules = handler.rules || [];
              const ruleCount = rules.length;

              return (
                <Card
                  hoverable
                  size="small"
                  variant="borderless"
                  onClick={() => handleEditHandler(handler)}
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
                            <Text type="secondary">
                              Sin reglas (Transición directa)
                            </Text>
                          )}
                        </Card>
                      </Flex>
                    </Flex>
                    <RightOutlined
                      style={{ color: token.colorTextQuaternary }}
                    />
                  </Flex>
                </Card>
              );
            }}
          />
        </div>
      </Flex>

      {/* Footer */}
      <div
        style={{
          padding: '16px',
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          backgroundColor: token.colorBgContainer,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
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
          Eliminar Nodo
        </Button>
      </div>
    </Flex>
  );
};
