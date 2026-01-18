import React from 'react';
import { theme } from 'antd';
import {
  IdcardOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  ApiOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { RuleType } from '@process-flow/common';

interface RuleTypeIconProps {
  type: RuleType;
  size?: number;
}

export const RuleTypeIcon: React.FC<RuleTypeIconProps> = ({
  type,
  size = 14,
}) => {
  const { token } = theme.useToken();

  const iconStyle = { fontSize: size };

  switch (type) {
    case RuleType.ROLE_CHECK:
      return (
        <IdcardOutlined style={{ ...iconStyle, color: token.colorWarning }} />
      );
    case RuleType.DOCUMENT_STATUS_CHECK:
      return (
        <FileTextOutlined style={{ ...iconStyle, color: token.colorInfo }} />
      );
    case RuleType.SQL_CHECK_CUSTOM:
      return (
        <DatabaseOutlined style={{ ...iconStyle, color: token.colorError }} />
      );
    case RuleType.API_CHECK_CUSTOM:
      return (
        <ApiOutlined style={{ ...iconStyle, color: token.colorSuccess }} />
      );
    default:
      return <SafetyCertificateOutlined style={iconStyle} />;
  }
};
