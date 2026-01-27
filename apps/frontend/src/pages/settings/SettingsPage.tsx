import React, { useState } from 'react';
import { Layout, Menu, Typography, theme } from 'antd';
import { DataSourcesList } from '../../features/settings/components/DataSourcesList';
import { DataSourceEditor } from '../../features/settings/components/DataSourceEditor';
import { useDataSources } from '../../features/settings/hooks/useDataSources';

const { Sider, Content } = Layout;
const { Text } = Typography;

const SettingsPage: React.FC = () => {
  const { token } = theme.useToken();
  const [selectedKey, setSelectedKey] = useState('data-sources');
  const [view, setView] = useState<'list' | 'edit' | 'create'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Use the hook to get data sources so we can find the one being edited
  const { dataSources, createDataSource, updateDataSource } = useDataSources();

  const handleEdit = (id: string) => {
    setEditingId(id);
    setView('edit');
  };

  const handleCreate = () => {
    setEditingId(null);
    setView('create');
  };

  const handleBack = () => {
    setView('list');
    setEditingId(null);
  };

  const settingsMenu = [
    { key: 'general', label: 'General' },
    { key: 'data-sources', label: 'Fuentes de Datos' },
    { key: 'users', label: 'Usuarios y Permisos' },
    { key: 'integrations', label: 'Integraciones' },
    { key: 'audit', label: 'Registros y Auditoría' },
  ];

  const renderContent = () => {
    if (selectedKey !== 'data-sources') {
      return (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Text type="secondary">Sección en construcción</Text>
        </div>
      );
    }

    if (view === 'list') {
      return <DataSourcesList onEdit={handleEdit} onCreate={handleCreate} />;
    }

    const initialData =
      view === 'edit'
        ? dataSources.find(item => item.id === editingId)
        : undefined;

    return (
      <DataSourceEditor
        initialData={initialData}
        onCancel={handleBack}
        onSave={async data => {
          if (view === 'edit' && editingId) {
            await updateDataSource(editingId, data);
          } else {
            await createDataSource(data);
          }
          handleBack();
        }}
      />
    );
  };

  return (
    <Layout style={{ background: 'transparent', height: '100%' }}>
      <Sider
        width={240}
        style={{
          background: 'transparent',
          borderRight: `1px solid ${token.colorBorder}`,
          marginRight: 24,
        }}
      >
        <div style={{ padding: '0 16px 16px 0' }}>
          <Text
            type="secondary"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Categorías
          </Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            setSelectedKey(key);
            setView('list'); // Reset view when changing category
          }}
          style={{
            background: 'transparent',
            borderRight: 'none',
          }}
          items={settingsMenu.map(item => ({
            key: item.key,
            label: item.label,
          }))}
        />
      </Sider>

      <Content>{renderContent()}</Content>
    </Layout>
  );
};

export default SettingsPage;
