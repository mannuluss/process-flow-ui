import React from 'react';
import {
  Typography,
  Button,
  Input,
  Table,
  Tag,
  Space,
  theme,
  Flex,
  Popconfirm,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  DatabaseOutlined,
  ApiOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useDataSources } from '../hooks/useDataSources';
import { DataSource } from '@process-flow/common';

const { Title, Text } = Typography;

interface DataSourcesListProps {
  onEdit: (id: string) => void;
  onCreate: () => void;
}

export const DataSourcesList: React.FC<DataSourcesListProps> = ({
  onEdit,
  onCreate,
}) => {
  const { token } = theme.useToken();
  const { dataSources, loading, deleteDataSource } = useDataSources();

  const columns: ColumnsType<DataSource> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: text => (
        <Text code style={{ color: token.colorTextBase }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: text => <Text strong>{text}</Text>,
    },
    {
      title: 'Tipo',
      dataIndex: 'sourceType',
      key: 'sourceType',
      render: sourceType => (
        <Space>
          {sourceType === 'SQL' ? (
            <DatabaseOutlined style={{ color: '#1890ff' }} />
          ) : (
            <ApiOutlined style={{ color: '#722ed1' }} />
          )}
          <Text>{sourceType === 'SQL' ? 'SQL Query' : 'Endpoint API'}</Text>
        </Space>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag
          icon={
            status === 'SUCCESS' ? (
              <CheckCircleOutlined />
            ) : (
              <CloseCircleOutlined />
            )
          }
          color={status === 'SUCCESS' ? 'success' : 'error'}
          style={{
            background:
              status === 'SUCCESS'
                ? 'rgba(82, 196, 26, 0.1)'
                : 'rgba(255, 77, 79, 0.1)',
            border: `1px solid ${
              status === 'SUCCESS'
                ? 'rgba(82, 196, 26, 0.2)'
                : 'rgba(255, 77, 79, 0.2)'
            }`,
          }}
        >
          {status === 'SUCCESS' ? 'Conectado' : 'Error'}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            style={{ color: token.colorPrimary }}
            onClick={() => onEdit(record.id)}
          />
          <Popconfirm
            title="¿Estás seguro de eliminar esta fuente de datos?"
            onConfirm={() => deleteDataSource(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Flex vertical gap={24}>
      {/* Header Section */}
      <Flex justify="space-between" align="center">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Fuentes de Datos
          </Title>
          <Text type="secondary">
            Gestione conexiones SQL y endpoints API para validaciones y reglas
            de negocio.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={onCreate}
          style={{
            background: token.colorPrimary,
            color: token.colorBgBase,
            fontWeight: 'bold',
          }}
        >
          Crear Fuente
        </Button>
      </Flex>

      {/* Search Bar */}
      <div
        style={{
          background: token.colorBgContainer,
          padding: '8px',
          borderRadius: token.borderRadius,
          border: `1px solid ${token.colorBorder}`,
        }}
      >
        <Input
          prefix={
            <SearchOutlined style={{ color: token.colorTextSecondary }} />
          }
          placeholder="Buscar por nombre o ID..."
          variant="borderless"
          style={{ color: token.colorTextBase }}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={dataSources}
        loading={loading}
        pagination={false}
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadius,
          border: `1px solid ${token.colorBorder}`,
          overflow: 'hidden',
        }}
      />
    </Flex>
  );
};
