import './procesos-node-styles.scss';

import { Handle, type NodeProps, Position, useStore } from '@xyflow/react';
import { Button, Flex, theme, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { NodeHandler } from '@process-flow/common';

import { ProcesoCustomNode } from './types';
import { useCommand } from '../../actions/manager/CommandContext';
import { HandlerItem } from './HandlerItem';
import { NodeIcon } from '../../../shared/components/IconPicker';

const { Text } = Typography;

export function CustomProcessNode({
  id,
  data,
  selected,
}: NodeProps<ProcesoCustomNode>) {
  const { token } = theme.useToken();
  const { commandManager, generateContextApp } = useCommand();

  // Use useStore with selector for reactive updates when edges change
  const haveIncoming = useStore(state =>
    state.edges.some(edge => edge.target === id)
  );

  // Get handlers from node data - safely cast since we know our node type
  const handlers: NodeHandler[] =
    (data as { handlers?: NodeHandler[] }).handlers || [];

  const dirHandleTarget = Position.Left;

  const handleEditHandler = (nodeId: string, handlerId: string) => {
    // Create a minimal context with handler info as the object
    const context = generateContextApp('Node');
    commandManager.executeCommand('editHandler', {
      ...context,
      object: { nodeId, handlerId },
    });
  };

  const handleAddHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    const context = generateContextApp('Node');
    commandManager.executeCommand('addHandler', {
      ...context,
      object: { nodeId: id },
    });
  };

  return (
    <div
      className={data.initial ? 'initial-node' : ''}
      style={{
        backgroundColor: token.colorBgContainer,
        borderRadius: token.borderRadius,
        border: `1px solid ${selected ? token.colorPrimary : token.colorBorderSecondary}`,
        boxShadow: selected
          ? `0 0 12px ${token.colorPrimary}40, 0 0 4px ${token.colorPrimary}60`
          : 'none',
        transition: 'all 0.2s ease',
        minWidth: 180,
      }}
    >
      {/* Target handle */}
      <Handle
        type="target"
        position={dirHandleTarget}
        style={{
          width: 10,
          height: 10,
          backgroundColor: haveIncoming
            ? token.colorPrimary
            : token.colorBorderSecondary,
          border: `2px solid ${haveIncoming ? token.colorBorderSecondary : token.colorPrimary}`,
        }}
      />

      {/* Node header with icon and label */}
      <Flex
        align="center"
        gap={10}
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <NodeIcon name={data.icon} size={18} color={token.colorPrimary} />
        <Text
          strong
          style={{
            fontSize: 13,
            color: token.colorText,
          }}
        >
          {data.label}
        </Text>
      </Flex>

      {/* Handlers section */}
      <Flex
        vertical
        gap={6}
        style={{
          padding: '8px',
        }}
      >
        {/* Render existing handlers */}
        {handlers.map(handler => (
          <HandlerItem
            key={handler.id}
            nodeId={id}
            handler={handler}
            onEditHandler={handleEditHandler}
          />
        ))}

        {/* Add handler button */}
        <Button
          type="dashed"
          size="small"
          icon={<PlusOutlined />}
          onClick={handleAddHandler}
          className="nodrag nopan"
          style={{
            width: '100%',
            fontSize: 11,
          }}
        >
          Agregar salida
        </Button>
      </Flex>
    </div>
  );
}
