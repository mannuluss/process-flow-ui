import './procesos-node-styles.scss';

import { Handle, type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { Button, Flex, theme, Typography } from 'antd';
import { PlusOutlined, ThunderboltOutlined } from '@ant-design/icons';
import type { NodeHandler } from '@process-flow/common';

import { ProcesoCustomNode } from './types';
import { useCommand } from '../../actions/manager/CommandContext';
import { RuleTypeIcon } from '../../../shared/components/RuleTypeIcon';

const { Text } = Typography;

interface HandlerItemProps {
  nodeId: string;
  handler: NodeHandler;
  onEditHandler: (nodeId: string, handlerId: string) => void;
}

/**
 * Renders a handler item for each output of the node.
 */
const HandlerItem: React.FC<HandlerItemProps> = ({
  nodeId,
  handler,
  onEditHandler,
}) => {
  const { token } = theme.useToken();
  const trigger = handler.trigger || 'Sin configurar';
  const rules = handler.rules || [];

  const { getEdges } = useReactFlow();
  const connectedEdges = getEdges().filter(
    edge => edge.source === nodeId && edge.sourceHandle === handler.id
  );
  const isConnected = connectedEdges.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditHandler(nodeId, handler.id);
  };

  return (
    <Flex
      align="center"
      gap={8}
      onClick={handleClick}
      className="nodrag nopan"
      style={{
        padding: '6px 8px',
        backgroundColor: token.colorBgContainer,
        borderRadius: token.borderRadiusSM,
        border: `1px solid ${handler.trigger ? token.colorWarningBorder : 'transparent'}`,
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = token.colorBorderSecondary;
        e.currentTarget.style.backgroundColor = token.colorFillQuaternary;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = handler.trigger
          ? 'transparent'
          : token.colorWarningBorder;
        e.currentTarget.style.backgroundColor = token.colorBgContainer;
      }}
    >
      {/* Bolt icon and trigger name */}
      <Flex
        align="center"
        gap={4}
        style={{
          borderRight:
            rules.length > 0
              ? `1px solid ${token.colorBorderSecondary}`
              : 'none',
          paddingRight: rules.length > 0 ? 8 : 0,
        }}
      >
        <ThunderboltOutlined
          style={{
            fontSize: 14,
            color: handler.trigger
              ? token.colorTextSecondary
              : token.colorWarning,
          }}
        />
        <Text
          style={{
            fontSize: 10,
            fontFamily: 'monospace',
            fontWeight: 600,
            color: handler.trigger
              ? token.colorTextSecondary
              : token.colorWarning,
            fontStyle: handler.trigger ? 'normal' : 'italic',
          }}
        >
          {trigger}
        </Text>
      </Flex>

      {/* Rule type icons */}
      {rules.length > 0 && (
        <Flex align="center" gap={4}>
          {rules.map((rule, index) => (
            <RuleTypeIcon key={index} type={rule.type} size={12} />
          ))}
        </Flex>
      )}
      {/* Handle for the edge connection */}
      <Handle
        type="source"
        position={Position.Right}
        id={handler.id}
        style={{
          width: 10,
          height: 10,
          backgroundColor: isConnected
            ? token.colorPrimary
            : token.colorBorderSecondary,
          border: `2px solid ${isConnected ? token.colorBorderSecondary : token.colorPrimary}`,
          right: -7,
        }}
      />
    </Flex>
  );
};

export function CustomProcessNode({
  id,
  data,
  selected,
}: NodeProps<ProcesoCustomNode>) {
  const { token } = theme.useToken();
  const { commandManager, generateContextApp } = useCommand();
  const { getEdges } = useReactFlow();

  const incomingEdges = getEdges().filter(edge => edge.target === id);
  const haveIncoming = incomingEdges?.length > 0;

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

      {/* Node header with label */}
      <Flex
        align="center"
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
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
