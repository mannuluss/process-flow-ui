import React, { useState, useEffect } from 'react';
import {
  Flex,
  Typography,
  Segmented,
  Input,
  Select,
  Space,
  theme,
  Card,
  Form,
} from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { useSqlEditor } from '../hooks/useSqlEditor';

const { Text } = Typography;

// Wrapper for Monaco Editor to work with Form.Item
const MonacoEditorWrapper = ({ value, onChange }: any) => {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        position: 'relative',
        border: `1px solid ${token.colorBorder}`,
        borderRadius: token.borderRadiusLG,
        overflow: 'hidden',
        height: '300px',
      }}
    >
      <Editor
        height="100%"
        defaultLanguage="sql"
        value={value}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
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

export const SqlEditor: React.FC = () => {
  const { token } = theme.useToken();
  const form = Form.useFormInstance();

  // Watch form values
  const tableName = Form.useWatch(['mappingConfig', 'tableName'], form);
  const idField = Form.useWatch(['mappingConfig', 'idField'], form);
  const nameField = Form.useWatch(['mappingConfig', 'nameField'], form);
  const whereClause = Form.useWatch(['mappingConfig', 'whereClause'], form);

  // Initialize mode based on whether tableName is set
  const [mode, setMode] = useState<'visual' | 'direct'>('direct');

  // Set initial mode once
  useEffect(() => {
    const initialTable = form.getFieldValue(['mappingConfig', 'tableName']);
    if (initialTable) {
      setMode('visual');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { tables, columns, loadingTables, loadingColumns } =
    useSqlEditor(tableName);

  // Update querySql when in visual mode
  useEffect(() => {
    if (mode === 'visual') {
      if (tableName && idField && nameField) {
        const sql = `SELECT ${idField}, ${nameField} FROM ${tableName} ${
          whereClause ? `WHERE ${whereClause}` : ''
        }`;
        // Only update if different to avoid loops
        const currentSql = form.getFieldValue('querySql');
        if (currentSql !== sql) {
          form.setFieldValue('querySql', sql);
        }
      }
    }
  }, [mode, tableName, idField, nameField, whereClause, form]);

  const handleTableChange = () => {
    // Clear dependent fields
    form.setFieldValue(['mappingConfig', 'idField'], undefined);
    form.setFieldValue(['mappingConfig', 'nameField'], undefined);
  };

  const handleModeChange = (val: 'visual' | 'direct') => {
    setMode(val);
    console.log('Switched mode to', val);
    if (val === 'direct') {
      // Clear visual builder fields to avoid ambiguity on backend
      form.setFieldValue(['mappingConfig', 'tableName'], undefined);
      form.setFieldValue(['mappingConfig', 'idField'], undefined);
      form.setFieldValue(['mappingConfig', 'nameField'], undefined);
      form.setFieldValue(['mappingConfig', 'whereClause'], undefined);
    }
    console.log(form.getFieldsValue());
  };

  return (
    <Flex vertical gap={24}>
      {/* Header with Mode Switcher */}
      <Flex justify="space-between" align="center" gap={20} wrap>
        <Space>
          <DatabaseOutlined style={{ color: token.colorPrimary }} />
          <Text strong>Configuración SQL</Text>
        </Space>
        <Segmented
          options={[
            { label: 'Visual Builder', value: 'visual' },
            { label: 'Direct SQL', value: 'direct' },
          ]}
          value={mode}
          onChange={val => handleModeChange(val as 'visual' | 'direct')}
        />
      </Flex>

      {/* Editor Content */}
      {mode === 'direct' ? (
        <Flex vertical gap={16}>
          <Form.Item name="querySql" noStyle>
            <MonacoEditorWrapper />
          </Form.Item>
        </Flex>
      ) : (
        <Flex vertical gap={16}>
          <Card
            size="small"
            style={{
              background: token.colorBgContainer,
              borderColor: token.colorBorder,
            }}
          >
            <Flex vertical gap={16}>
              <Flex wrap gap={16}>
                <div style={{ flex: 1 }}>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: '12px',
                      display: 'block',
                      marginBottom: 4,
                    }}
                  >
                    Table Name
                  </Text>
                  <Form.Item name={['mappingConfig', 'tableName']} noStyle>
                    <Select
                      style={{ width: '100%' }}
                      options={tables}
                      loading={loadingTables}
                      showSearch
                      placeholder="Select a table"
                      onChange={handleTableChange}
                    />
                  </Form.Item>
                </div>
                <div style={{ flex: 1 }}>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: '12px',
                      display: 'block',
                      marginBottom: 4,
                    }}
                  >
                    ID Field
                  </Text>
                  <Form.Item name={['mappingConfig', 'idField']} noStyle>
                    <Select
                      style={{ width: '100%' }}
                      options={columns}
                      loading={loadingColumns}
                      showSearch
                      placeholder="Select ID column"
                      disabled={!tableName}
                    />
                  </Form.Item>
                </div>
                <div style={{ flex: 1 }}>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: '12px',
                      display: 'block',
                      marginBottom: 4,
                    }}
                  >
                    Name Field
                  </Text>
                  <Form.Item name={['mappingConfig', 'nameField']} noStyle>
                    <Select
                      style={{ width: '100%' }}
                      options={columns}
                      loading={loadingColumns}
                      showSearch
                      placeholder="Select Name column"
                      disabled={!tableName}
                    />
                  </Form.Item>
                </div>
              </Flex>

              <div>
                <Text
                  type="secondary"
                  style={{
                    fontSize: '12px',
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  Where Filter (Optional)
                </Text>
                <Form.Item name={['mappingConfig', 'whereClause']} noStyle>
                  <Input placeholder="e.g. status = 'active'" />
                </Form.Item>
                <Text type="secondary" style={{ fontSize: '10px' }}>
                  * Use standard SQL syntax for the WHERE clause.
                </Text>
              </div>
            </Flex>
          </Card>

          <Card
            size="small"
            title="SQL Preview"
            style={{ borderColor: token.colorBorder }}
          >
            <Form.Item
              shouldUpdate={(prev, curr) => prev.querySql !== curr.querySql}
              noStyle
            >
              {({ getFieldValue }) => (
                <div
                  style={{
                    padding: 12,
                    background: token.colorFillAlter,
                    borderRadius: token.borderRadius,
                    fontFamily: 'monospace',
                    color: token.colorText,
                    minHeight: '24px',
                  }}
                >
                  {getFieldValue('querySql') || (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Select table and fields to generate SQL
                    </Text>
                  )}
                </div>
              )}
            </Form.Item>
          </Card>
        </Flex>
      )}
    </Flex>
  );
};
