import React from 'react';
import { Button, Flex, List, Typography, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { NodeHandler } from '@process-flow/common';
import { HandlerCard } from './HandlerCard';

const { Text } = Typography;

interface HandlersListProps {
  handlers: NodeHandler[];
  getTargetLabel: (handler: NodeHandler) => string | null;
  onAddHandler: () => void;
  onEditHandler: (handler: NodeHandler) => void;
}

export const HandlersList: React.FC<HandlersListProps> = ({
  handlers,
  getTargetLabel,
  onAddHandler,
  onEditHandler,
}) => {
  const { token } = theme.useToken();

  return (
    <div style={{ padding: '24px' }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
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
          onClick={onAddHandler}
          style={{
            fontSize: 10,
            fontWeight: 'bold',
            color: token.colorPrimary,
            backgroundColor: token.colorPrimaryBg,
          }}
        >
          Agregar
        </Button>
      </Flex>

      <List
        dataSource={handlers}
        locale={{ emptyText: 'No hay handlers de salida configurados.' }}
        renderItem={handler => (
          <HandlerCard
            handler={handler}
            targetLabel={getTargetLabel(handler)}
            onClick={() => onEditHandler(handler)}
          />
        )}
      />
    </div>
  );
};
