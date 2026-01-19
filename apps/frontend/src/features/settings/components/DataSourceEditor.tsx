import React, { useState } from 'react';
import {
  Flex,
  Typography,
  Input,
  Card,
  theme,
  Button,
  Form,
  message,
  Table,
} from 'antd';
import {
  DatabaseOutlined,
  ApiOutlined,
  CheckCircleFilled,
  ArrowLeftOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { SqlEditor } from '../../../shared/components/SqlEditor';
import { ApiEditor } from './ApiEditor';
import { DataSource } from '@process-flow/common';
import { dataSourceService } from '../services/dataSource.service';

const { Title, Text } = Typography;

interface DataSourceEditorProps {
  initialData?: Partial<DataSource>;
  onCancel: () => void;
  onSave: (data: Partial<DataSource>) => void;
}

export const DataSourceEditor: React.FC<DataSourceEditorProps> = ({
  initialData,
  onCancel,
  onSave,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const sourceType = Form.useWatch('sourceType', form);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Helper to convert headers object to array for Form.List
  const getInitialValues = () => {
    const values = {
      sourceType: 'SQL',
      mappingConfig: { valueField: null, labelField: null, tableName: null },
      ...initialData,
    };
    return values;
  };

  const preparePayload = (values: any) => {
    // Convert headers list back to object
    const apiHeaders =
      values.apiHeadersList?.reduce((acc: any, curr: any) => {
        if (curr.key) acc[curr.key] = curr.value;
        return acc;
      }, {}) || {};

    return {
      ...values,
      // Ensure we only send relevant fields based on type
      querySql:
        values.sourceType === 'SQL' && !values.mappingConfig?.tableName
          ? values.querySql
          : null,
      apiUrl: values.sourceType === 'API' ? values.apiUrl : undefined,
      apiMethod: values.sourceType === 'API' ? values.apiMethod : undefined,
      apiHeaders: values.sourceType === 'API' ? apiHeaders : undefined,
      mappingConfig: values.mappingConfig ?? null,
    };
  };

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    const payload = preparePayload(values);
    onSave(payload);
  };

  const handleTest = async () => {
    try {
      const values = await form.validateFields();
      setTesting(true);
      setTestResult(null);

      const payload = preparePayload(values);
      const result = await dataSourceService.testConfig(payload);

      if (result.status === 'success') {
        message.success('Conexión exitosa');
        setTestResult(result.data);
      } else {
        message.error(`Error: ${result.message}`);
        setTestResult({ error: result.message });
      }
    } catch (error) {
      console.error(error);
      message.error('Error al validar o probar la configuración');
    } finally {
      setTesting(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={getInitialValues()}
    >
      <Flex vertical gap={24} style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <div>
            <Flex align="center" gap={12}>
              <Button
                icon={<ArrowLeftOutlined />}
                type="text"
                onClick={onCancel}
              />
              <Title level={2} style={{ margin: 0 }}>
                {initialData
                  ? 'Editar Fuente de Datos'
                  : 'Nueva Fuente de Datos'}
              </Title>
            </Flex>
            <Text type="secondary" style={{ marginLeft: 44 }}>
              Configure los detalles de conexión y mapeo para esta fuente.
            </Text>
          </div>
          {initialData && initialData.status && (
            <TagStatus status={initialData.status} />
          )}
        </Flex>

        {/* Basic Info Card */}
        <Card
          title="Información Básica"
          bordered
          style={{
            background: token.colorBgContainer,
            borderColor: token.colorBorder,
          }}
        >
          <Flex gap={24} wrap="wrap">
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Form.Item
                name="id"
                label="ID Lógico"
                rules={[{ required: true, message: 'El ID es requerido' }]}
                help="Identificador único usado en las reglas de negocio."
              >
                <Input
                  prefix={
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '18px',
                        color: token.colorTextSecondary,
                      }}
                    >
                      fingerprint
                    </span>
                  }
                  placeholder="Ej. DS_ROLES"
                />
              </Form.Item>
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Form.Item
                name="name"
                label="Nombre Visible"
                rules={[{ required: true, message: 'El nombre es requerido' }]}
              >
                <Input
                  prefix={
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: '18px',
                        color: token.colorTextSecondary,
                      }}
                    >
                      badge
                    </span>
                  }
                  placeholder="Ej. Usuarios Activos"
                />
              </Form.Item>
            </div>
          </Flex>
          <Form.Item name="description" label="Descripción">
            <Input.TextArea
              rows={2}
              placeholder="Descripción opcional de la fuente de datos"
            />
          </Form.Item>
        </Card>

        {/* Type Selection */}
        <Card
          variant="borderless"
          style={{
            background: `${token.colorBgContainer}80`,
            borderColor: token.colorBorder,
          }}
        >
          <Form.Item name="sourceType" label="Tipo de Fuente">
            <TypeSelector />
          </Form.Item>
        </Card>

        {/* Specific Editor */}
        <Card
          bordered
          style={{
            background: token.colorBgContainer,
            borderColor: token.colorBorder,
          }}
        >
          {sourceType === 'SQL' ? (
            <SqlEditor
              namePath={['mappingConfig']}
              watchPath={['mappingConfig']}
            />
          ) : (
            <ApiEditor />
          )}
        </Card>

        {/* Test Results */}
        <Card
          title="Prueba de Conexión"
          size="small"
          extra={
            <Button
              icon={<PlayCircleOutlined />}
              onClick={handleTest}
              loading={testing}
            >
              Probar Configuración
            </Button>
          }
        >
          {testResult ? (
            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
              {Array.isArray(testResult) ? (
                <Table
                  dataSource={testResult}
                  columns={Object.keys(testResult[0] || {}).map(key => ({
                    title: key,
                    dataIndex: key,
                    key,
                    render: (text: any) =>
                      typeof text === 'object' ? JSON.stringify(text) : text,
                  }))}
                  size="small"
                  pagination={false}
                  rowKey={(_record, index) => index?.toString() || ''}
                />
              ) : (
                <pre style={{ fontSize: '12px' }}>
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <Text type="secondary">
              Los resultados de la prueba aparecerán aquí.
            </Text>
          )}
        </Card>

        {/* Footer Actions */}
        <Flex
          justify="end"
          gap={12}
          style={{
            paddingTop: 16,
            borderTop: `1px solid ${token.colorBorder}`,
          }}
        >
          <Button onClick={onCancel}>Cancelar</Button>
          <Button type="primary" htmlType="submit">
            Guardar Cambios
          </Button>
        </Flex>
      </Flex>
    </Form>
  );
};

// Custom Input Component for Type Selection to work with Form.Item
const TypeSelector = ({ value, onChange }: any) => {
  const { token } = theme.useToken();
  return (
    <Flex gap={16} wrap="wrap">
      <TypeOption
        active={value === 'SQL'}
        onClick={() => onChange?.('SQL')}
        icon={<DatabaseOutlined />}
        title="SQL Query"
        description="Consulta directa a base de datos"
        color={token.colorPrimary}
      />
      <TypeOption
        active={value === 'API'}
        onClick={() => onChange?.('API')}
        icon={<ApiOutlined />}
        title="Endpoint API"
        description="Consumo de servicios REST"
        color={token.colorPrimary}
      />
    </Flex>
  );
};

const TypeOption = ({
  active,
  onClick,
  icon,
  title,
  description,
  color,
}: any) => {
  const { token } = theme.useToken();
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        cursor: 'pointer',
        border: `1px solid ${active ? color : token.colorBorder}`,
        background: active ? `${color}1A` : token.colorBgContainer,
        padding: '16px',
        borderRadius: token.borderRadius,
        transition: 'all 0.2s',
        position: 'relative',
      }}
    >
      <Flex justify="space-between" align="start">
        <Flex gap={12}>
          <div
            style={{
              fontSize: '24px',
              color: active ? color : token.colorTextSecondary,
            }}
          >
            {icon}
          </div>
          <div>
            <Text
              strong
              style={{
                color: active ? token.colorTextBase : token.colorTextSecondary,
              }}
            >
              {title}
            </Text>
            <div
              style={{
                fontSize: '12px',
                color: token.colorTextSecondary,
                opacity: 0.8,
              }}
            >
              {description}
            </div>
          </div>
        </Flex>
        {active && <CheckCircleFilled style={{ color }} />}
      </Flex>
    </div>
  );
};

const TagStatus = ({ status }: { status: string }) => {
  const isConnected = status === 'SUCCESS';
  return (
    <div
      style={{
        padding: '4px 12px',
        borderRadius: '100px',
        background: isConnected
          ? 'rgba(82, 196, 26, 0.1)'
          : 'rgba(255, 77, 79, 0.1)',
        border: `1px solid ${isConnected ? 'rgba(82, 196, 26, 0.2)' : 'rgba(255, 77, 79, 0.2)'}`,
        color: isConnected ? '#52c41a' : '#ff4d4f',
        fontSize: '12px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'currentColor',
        }}
      />
      {isConnected ? 'Conectado' : 'Error'}
    </div>
  );
};
