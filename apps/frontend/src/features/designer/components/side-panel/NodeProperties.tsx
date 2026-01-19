import React from 'react';
import { useReactFlow, useStore } from '@xyflow/react';
import { AppNode } from 'src/app/customs/nodes/types';
import { NodeHandler } from '@process-flow/common';
import { Button, Flex, theme } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCommand } from '@commands/manager/CommandContext';
import { useNodeForm } from './node/hooks/useNodeForm';
import {
  HandlersList,
  InitialNodeHeader,
  RegularNodeHeader,
} from './node/components';
import type { PanelProps } from './types';
import { PanelHeader } from './components';
import { isInitialNodeType } from 'src/core/utils/workflow';

export const NodeProperties: React.FC<PanelProps<AppNode>> = ({
  payload,
  onClose,
}) => {
  const { getEdges, getNodes } = useReactFlow();
  const { token } = theme.useToken();
  const { commandManager, generateContextApp } = useCommand();

  // Check if this is the initial node
  const isInitialNode = isInitialNodeType(payload);

  // Use the extracted form hook
  const { form, handleValuesChange, flushSave } = useNodeForm({
    payload,
    isInitialNode,
  });

  // Subscribe to node changes to get reactive updates for handlers
  const currentNode = useStore(state =>
    state.nodes.find(n => n.id === payload.id)
  ) as AppNode | undefined;

  // Get handlers from the current node (reactive) or fallback to payload
  const payloadData = payload.data as any;
  const currentData = currentNode?.data as any;
  const handlers: NodeHandler[] =
    currentData?.handlers || payloadData?.handlers || [];
  const nodes = getNodes();
  const edges = getEdges();

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
    const targetNode = nodes.find(n => n.id === edge.target);
    return (targetNode?.data as any)?.label || edge.target;
  };

  return (
    <Flex
      vertical
      style={{ height: '100%', backgroundColor: token.colorBgContainer }}
    >
      <PanelHeader title="Propiedades de Nodo" onClose={handleClose} />

      {/* Content */}
      <Flex vertical flex={1} style={{ overflowY: 'auto' }}>
        {/* Node Header - Different for initial node */}
        <div
          style={{
            padding: '24px',
            backgroundColor: isInitialNode
              ? `${token.colorSuccess}10`
              : token.colorFillQuaternary,
            borderBottom: `1px solid ${isInitialNode ? token.colorSuccessBorder : token.colorBorderSecondary}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {isInitialNode ? (
            <InitialNodeHeader />
          ) : (
            <RegularNodeHeader
              form={form}
              onValuesChange={handleValuesChange}
            />
          )}
        </div>

        {/* Handlers List */}
        <HandlersList
          handlers={handlers}
          getTargetLabel={getTargetLabel}
          onAddHandler={handleAddHandler}
          onEditHandler={handleEditHandler}
        />
      </Flex>

      {/* Footer - Hidden for initial node */}
      {!isInitialNode && (
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
      )}
    </Flex>
  );
};
