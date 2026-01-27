import React from 'react';
import { theme } from 'antd';
import Editor from '@monaco-editor/react';

interface MonacoEditorWrapperProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string | number;
  language?: string;
}

export const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({
  value,
  onChange,
  height = '300px',
  language = 'sql',
}) => {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        position: 'relative',
        border: `1px solid ${token.colorBorder}`,
        borderRadius: token.borderRadiusLG,
        overflow: 'hidden',
        height: height,
      }}
    >
      <Editor
        height="100%"
        defaultLanguage={language}
        value={value}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          lineNumbers: 'off',
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
        }}
        onChange={val => onChange?.(val || '')}
      />
    </div>
  );
};
