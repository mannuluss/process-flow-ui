import './initial-node-styles.scss';

import { Handle, type NodeProps, Position, useStore } from '@xyflow/react';
import { Flex, theme, Typography } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import type { NodeHandler } from '@process-flow/common';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

import { InitialCustomNode } from '@core/designer/types';
import { useCommand } from '@commands/context/CommandContext';
import { RuleTypeIcon } from '@shared/components/RuleTypeIcon';

const { Text } = Typography;

/**
 * Nodo inicial del workflow.
 * Es el punto de entrada del flujo y no puede ser eliminado.
 * Solo tiene handlers de salida que determinan hacia dónde ir según trigger/rules.
 */
export function InitialNode({
  id,
  data,
  selected,
}: NodeProps<InitialCustomNode>) {
  const { token } = theme.useToken();
  const { commandManager, generateContextApp } = useCommand();

  // Get handlers from node data
  const handlers: NodeHandler[] = data.handlers || [];

  const handleEditHandler = (nodeId: string, handlerId: string) => {
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
      className={`initial-node-container ${selected ? 'selected' : ''}`}
      style={{
        backgroundColor: token.colorBgContainer,
        borderRadius: 12,
        border: `2px solid ${selected ? token.colorSuccess : token.colorSuccessBorder}`,
        boxShadow: selected
          ? `0 0 20px ${token.colorSuccess}50, 0 0 8px ${token.colorSuccess}30, inset 0 0 20px ${token.colorSuccess}10`
          : `0 0 10px ${token.colorSuccess}20`,
        minWidth: 220,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Flex
        align="center"
        gap={12}
        style={{
          padding: '14px 16px',
          borderBottom: `1px solid ${token.colorSuccessBorder}40`,
        }}
      >
        {/* Ícono circular */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: `${token.colorSuccess}15`,
            border: `2px solid ${token.colorSuccess}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RocketLaunchIcon
            style={{
              color: token.colorSuccess,
              fontSize: 22,
            }}
          />
        </div>

        {/* Título y subtítulo */}
        <Flex vertical gap={0}>
          <Text
            strong
            style={{
              fontSize: 14,
              color: token.colorText,
              letterSpacing: '0.5px',
            }}
          >
            NODO INICIAL
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: token.colorSuccess,
              fontWeight: 500,
            }}
          >
            ACTIVADOR
          </Text>
        </Flex>
      </Flex>

      {/* Handlers de salida */}
      <Flex
        vertical
        gap={6}
        style={{
          padding: '10px 12px',
        }}
      >
        {handlers.map(handler => (
          <InitialHandlerItem
            key={handler.id}
            nodeId={id}
            handler={handler}
            onEdit={handleEditHandler}
          />
        ))}

        {/* Botón para agregar más handlers */}
        <div
          onClick={handleAddHandler}
          className="nodrag nopan add-handler-btn"
          style={{
            padding: '4px 10px',
            borderRadius: 8,
            border: `1px dashed ${token.colorSuccessBorder}`,
            backgroundColor: `${token.colorSuccess}08`,
            cursor: 'pointer',
            textAlign: 'center',
            fontSize: 11,
            color: token.colorSuccess,
            transition: 'all 0.2s ease',
          }}
        >
          + Agregar activador
        </div>
      </Flex>
    </div>
  );
}

/**
 * Handler item específico para el nodo initial
 * Similar al HandlerItem del nodo normal pero con estilo verde
 */
interface InitialHandlerItemProps {
  nodeId: string;
  handler: NodeHandler;
  onEdit: (nodeId: string, handlerId: string) => void;
}

function InitialHandlerItem({
  nodeId,
  handler,
  onEdit,
}: InitialHandlerItemProps) {
  const { token } = theme.useToken();
  const trigger = handler.trigger || 'Sin configurar';
  const rules = handler.rules || [];

  // Check if this handler is connected
  const isConnected = useStore(state =>
    state.edges.some(
      edge => edge.source === nodeId && edge.sourceHandle === handler.id
    )
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(nodeId, handler.id);
  };

  return (
    <Flex
      align="center"
      gap={8}
      onClick={handleClick}
      className="nodrag nopan initial-handler-item"
      style={{
        padding: '6px 8px',
        borderRadius: 6,
        backgroundColor: `${token.colorSuccess}12`,
        border: `1px solid ${token.colorSuccessBorder}`,
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Bolt icon and trigger name */}
      <Flex
        align="center"
        gap={4}
        style={{
          borderRight:
            rules.length > 0 ? `1px solid ${token.colorSuccessBorder}` : 'none',
          paddingRight: rules.length > 0 ? 8 : 0,
        }}
      >
        <ThunderboltOutlined
          style={{
            color: handler.trigger
              ? token.colorWarning
              : token.colorTextSecondary,
            fontSize: 12,
          }}
        />
        <Text
          style={{
            fontSize: 10,
            fontFamily: 'monospace',
            fontWeight: 600,
            color: handler.trigger
              ? token.colorWarning
              : token.colorTextSecondary,
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

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={handler.id}
        style={{
          width: 10,
          height: 10,
          right: -7,
          backgroundColor: isConnected
            ? token.colorSuccess
            : token.colorSuccessBorder,
          border: `2px solid ${token.colorSuccess}`,
        }}
      />
    </Flex>
  );
}
