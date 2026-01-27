import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Table,
  Tag,
  Dropdown,
  MenuProps,
  message,
  Flex,
  Tabs,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DownloadOutlined,
  UploadOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  workflowService,
  Workflow,
} from '../../features/workflow/services/workflow.service';
import {
  useWorkflowIO,
  WorkflowExportData,
} from '../../features/workflow/hooks/useWorkflowIO';
import { WorkflowNode, WorkflowEdge } from '@process-flow/common';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);
  const { exportWorkflow, triggerImport, getFileInputProps } = useWorkflowIO();

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const data = await workflowService.getAll();
      setWorkflows(data);
    } catch (error) {
      console.error(error);
      message.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleCreateFlow = () => {
    navigate('/editor/new');
  };

  const handleOpen = (id: string) => {
    navigate(`/editor/${id}`);
  };

  const handleDuplicate = async (id: string) => {
    try {
      await workflowService.duplicate(id);
      message.success('Workflow duplicated');
      fetchWorkflows();
    } catch (error) {
      console.error(error);
      message.error('Failed to duplicate workflow');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await workflowService.delete(id);
      message.success('Workflow deleted');
      fetchWorkflows();
    } catch (error) {
      console.error(error);
      message.error('Failed to delete workflow');
    }
  };

  const handleExport = async (id: string) => {
    try {
      const workflow = await workflowService.getOne(id);
      exportWorkflow({
        name: workflow.name,
        description: workflow.description,
        nodes: (workflow.definition?.nodes || []) as WorkflowNode[],
        edges: (workflow.definition?.edges || []) as WorkflowEdge[],
      });
    } catch (error) {
      console.error(error);
      message.error('Failed to prepare export');
    }
  };

  const handleGlobalImport = () => {
    triggerImport(async (data: WorkflowExportData) => {
      try {
        setLoading(true);
        await workflowService.create({
          name: `${data.workflow.name} (copy)`,
          description: data.workflow.description,
          definition: data.workflow.definition,
        });
        message.success('Workflow importado y creado correctamente');
        fetchWorkflows();
        // Opcional: navegar al editor si el usuario lo prefiere
        // navigate(`/editor/${newWorkflow.id}`);
      } catch (error) {
        console.error(error);
        message.error('Error al crear el workflow importado');
      } finally {
        setLoading(true);
        fetchWorkflows();
      }
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Workflow) => (
        <a
          onClick={() => handleOpen(record.id)}
          style={{ fontWeight: 'bold', color: 'white' }}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Last Edited',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Workflow) => {
        const items: MenuProps['items'] = [
          {
            key: 'open',
            label: 'Open',
            icon: <EditOutlined />,
            onClick: () => handleOpen(record.id),
          },
          {
            key: 'duplicate',
            label: 'Duplicate',
            icon: <CopyOutlined />,
            onClick: () => handleDuplicate(record.id),
          },
          {
            key: 'export',
            label: 'Export JSON',
            icon: <DownloadOutlined />,
            onClick: () => handleExport(record.id),
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(record.id),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button
              type="text"
              icon={<MoreOutlined style={{ color: '#93c8a8' }} />}
            />
          </Dropdown>
        );
      },
    },
  ];

  const items = [
    { key: 'all', label: 'All Flows' },
    { key: 'active', label: 'Active' },
    { key: 'drafts', label: 'Drafts' },
    { key: 'archived', label: 'Archived' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Heading */}
      <Flex
        justify="space-between"
        align="end"
        style={{ marginBottom: '32px' }}
      >
        <div>
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            Mis Flujos
          </Title>
          <Paragraph
            style={{ color: '#93c8a8', margin: '8px 0 0 0', fontSize: '16px' }}
          >
            Manage and edit your existing process flows. Create logic diagrams
            for your automations.
          </Paragraph>
        </div>
        <Flex gap={12}>
          <Button
            icon={<UploadOutlined />}
            size="large"
            onClick={handleGlobalImport}
            style={{
              background: 'transparent',
              borderColor: '#244732',
              color: '#93c8a8',
              fontWeight: 'bold',
            }}
          >
            Importar
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleCreateFlow}
            style={{
              background: '#30e87a',
              borderColor: '#30e87a',
              color: '#112117',
              fontWeight: 'bold',
            }}
          >
            Crear Nuevo Flujo
          </Button>
        </Flex>
      </Flex>

      {/* Filters */}
      <Tabs
        defaultActiveKey="all"
        items={items}
        style={{ marginBottom: '24px', color: '#93c8a8' }}
        tabBarStyle={{ borderBottom: '1px solid #244732' }}
      />

      {/* Table Layout */}
      <Table
        columns={columns}
        dataSource={workflows}
        rowKey="id"
        loading={loading}
      />

      {/* Hidden file input for import */}
      <input {...getFileInputProps()} />
    </div>
  );
};

export default HomePage;
