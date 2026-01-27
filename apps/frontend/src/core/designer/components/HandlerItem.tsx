import { Handle, Position, useStore } from '@xyflow/react';
import { Flex, theme, Typography } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import type { NodeHandler } from '@process-flow/common';

import { RuleTypeIcon } from '../../../shared/components/RuleTypeIcon';

const { Text } = Typography;

export interface HandlerItemProps {
  nodeId: string;
  handler: NodeHandler;
  onEditHandler: (nodeId: string, handlerId: string) => void;
}

/**
 * Renders a handler item for each output of the node.
 * Uses useStore selector for reactive edge connection status.
 */
export const HandlerItem: React.FC<HandlerItemProps> = ({
  nodeId,
  handler,
  onEditHandler,
}) => {
  const { token } = theme.useToken();
  const trigger = handler.trigger || 'Sin configurar';
  const rules = handler.rules || [];

  // Use useStore with selector for reactive updates when edges change
  const isConnected = useStore(state =>
    state.edges.some(
      edge => edge.source === nodeId && edge.sourceHandle === handler.id
    )
  );

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
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.5s ease',
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
            rules.length > 0 ? `1px solid ${token.colorBorder}` : 'none',
          paddingRight: rules.length > 0 ? 8 : 0,
        }}
      >
        <ThunderboltOutlined
          style={{
            color: handler.trigger
              ? token.colorWarning
              : token.colorTextSecondary,
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
