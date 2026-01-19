import React from 'react';
import { Button, Flex, Typography, theme } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface PanelHeaderProps {
  title: string;
  onClose: () => void;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({ title, onClose }) => {
  const { token } = theme.useToken();

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        padding: '16px',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Title level={5} style={{ margin: 0 }}>
        {title}
      </Title>
      <Button
        type="text"
        icon={<CloseOutlined />}
        onClick={onClose}
        style={{ color: token.colorTextSecondary }}
      />
    </Flex>
  );
};
