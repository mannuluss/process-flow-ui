import React, { useState, useEffect, useCallback } from 'react';
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
import { useSqlEditor } from '../hooks/useSqlEditor';
import { MonacoEditorWrapper } from './MonacoEditorWrapper';

const { Text } = Typography;

interface SqlEditorProps {
  showTitle?: boolean;
  namePath?: any[]; // Path relativo para Form.Item
  watchPath?: any[]; // Path completo para Form.useWatch (incluye parent)
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  showTitle = true,
  namePath,
  watchPath,
}) => {
  const { token } = theme.useToken();
  const form = Form.useFormInstance();

  const getFieldName = useCallback(
    (name: string) => {
      return namePath ? [...namePath, name] : name;
    },
    [namePath]
  );

  const getWatchPath = useCallback(
    (name: string) => {
      return watchPath
        ? [...watchPath, name]
        : namePath
          ? [...namePath, name]
          : name;
    },
    [watchPath, namePath]
  );

  // Watch form values - usar watchPath que incluye el parent completo
  const tableName = Form.useWatch(getWatchPath('tableName'), form);
  const idField = Form.useWatch(getWatchPath('idField'), form);
  const nameField = Form.useWatch(getWatchPath('nameField'), form);
  const whereClause = Form.useWatch(getWatchPath('whereClause'), form);

  // Initialize mode based on whether tableName is set
  const [mode, setMode] = useState<'visual' | 'direct'>('direct');

  // Set initial mode once
  useEffect(() => {
    const initialTable = form.getFieldValue(getWatchPath('tableName'));
    if (initialTable) {
      setMode('visual');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { tables, columns, loadingTables, loadingColumns, fetchColumns } =
    useSqlEditor(tableName);

  // Update sql field when in visual mode
  useEffect(() => {
    if (mode === 'visual') {
      if (tableName && idField && nameField) {
        const sql = `SELECT ${idField}, ${nameField} FROM ${tableName} ${
          whereClause ? `WHERE ${whereClause}` : ''
        }`;
        const currentSql = form.getFieldValue(getFieldName('sql'));
        if (currentSql !== sql) {
          form.setFieldValue(getFieldName('sql'), sql);
        }
      }
    }
  }, [mode, tableName, idField, nameField, whereClause, form, getFieldName]);

  const handleTableChange = (val: string) => {
    form.setFieldValue(getFieldName('tableName'), val);
    form.setFieldValue(getFieldName('idField'), undefined);
    form.setFieldValue(getFieldName('nameField'), undefined);
    fetchColumns(val);
  };

  const handleModeChange = (val: 'visual' | 'direct') => {
    setMode(val);
    if (val === 'direct') {
      form.setFieldValue(getFieldName('tableName'), undefined);
      form.setFieldValue(getFieldName('idField'), undefined);
      form.setFieldValue(getFieldName('nameField'), undefined);
      form.setFieldValue(getFieldName('whereClause'), undefined);
    }
  };

  return (
    <Flex vertical gap={24}>
      {/* Header with Mode Switcher */}
      <Flex justify="space-between" align="center" gap={20} wrap>
        {showTitle && (
          <Space>
            <DatabaseOutlined style={{ color: token.colorPrimary }} />
            <Text strong>Configuración SQL</Text>
          </Space>
        )}
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
          <Form.Item name={getFieldName('querySql')} noStyle>
            <MonacoEditorWrapper height="200px" language="sql" />
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
                  <Form.Item name={getFieldName('tableName')} noStyle>
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
                  <Form.Item name={getFieldName('idField')} noStyle>
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
                  <Form.Item name={getFieldName('nameField')} noStyle>
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
                <Form.Item name={getFieldName('whereClause')} noStyle>
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
            <Form.Item shouldUpdate noStyle>
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
                  {getFieldValue(getFieldName('sql')) || (
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
