import React, { useState } from 'react';
import {
  Layout,
  Flex,
  Typography,
  Button,
  Avatar,
  Dropdown,
  theme,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'src/store/store';
import { resetSidePanel } from 'src/store/sidePanelSlice';
import { useStore } from '@xyflow/react';
import { useWorkflow } from '../context/WorkflowContext';
import { useWorkflowSave } from '../hooks/useWorkflowSave';
import { useWorkflowIO, WorkflowExportData } from '../hooks/useWorkflowIO';
import { WorkflowMetadataModal } from './WorkflowMetadataModal';
import type {
  WorkflowEdge,
  WorkflowMetadata,
  WorkflowNode,
} from '@process-flow/common';
import { useCommand } from '@commands/context/CommandContext';

const { Header } = Layout;
const { Text, Title } = Typography;

export const EditorHeader: React.FC = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const nodes = useStore<any[]>(s => s.nodes);
  const edges = useStore(s => s.edges);
  const { metadata, isNew, updateMetadata } = useWorkflow();
  const { saveWorkflow, isSaving } = useWorkflowSave();
  const { exportWorkflow, triggerImport, getFileInputProps } = useWorkflowIO();
  const { commandManager, generateContextApp } = useCommand();
  const [showMetadataModal, setShowMetadataModal] = useState(false);

  const backAction = () => {
    dispatch(resetSidePanel());
    navigate('/home');
  };

  const actionSave = () => {
    // Si es nuevo workflow, mostrar modal para capturar metadata
    if (isNew) {
      setShowMetadataModal(true);
    } else {
      // Si ya existe, guardar directamente
      handleSave();
    }
  };

  const handleSave = async () => {
    await saveWorkflow({
      nodes,
      edges: edges as WorkflowEdge[],
      onSuccess: workflowId => {
        console.log('Workflow saved with ID:', workflowId);
        // Actualizar URL si es nuevo
        if (isNew) {
          navigate(`/editor/${workflowId}`, { replace: true });
        }
      },
    });
  };

  const handleMetadataConfirm = async (values: WorkflowMetadata) => {
    // Actualizar contexto primero
    updateMetadata(values);
    setShowMetadataModal(false);

    // Guardar con los valores nuevos directamente (no esperar a que se actualice el estado)
    await saveWorkflow({
      nodes,
      edges: edges as WorkflowEdge[],
      metadata: {
        name: values.name,
        description: values.description,
      },
      onSuccess: workflowId => {
        navigate(`/editor/${workflowId}`, { replace: true });
      },
    });
  };

  const handleEditMetadata = () => {
    setShowMetadataModal(true);
  };

  const handleExport = () => {
    exportWorkflow({
      name: metadata.name,
      description: metadata.description,
      nodes: nodes as WorkflowNode[],
      edges: edges as WorkflowEdge[],
    });
  };

  const handleImport = () => {
    triggerImport((data: WorkflowExportData) => {
      // Update metadata from imported workflow with "(copy)" suffix
      updateMetadata({
        name: `${data.workflow.name} (copy)`,
        description: data.workflow.description,
      });

      // Load nodes and edges to canvas
      commandManager.executeCommand(
        'loadData',
        generateContextApp('Graph', {
          nodes: data.workflow.definition.nodes || [],
          edges: data.workflow.definition.edges || [],
        })
      );
    });
  };

  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#112218', // Matching mockup background
        borderBottom: `1px solid ${token.colorBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        zIndex: 50,
      }}
    >
      {/* Left Section: Back, Title, Breadcrumbs */}
      <Flex align="center" gap={16}>
        <Button
          type="text"
          icon={
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 24 }}
            >
              arrow_back
            </span>
          }
          onClick={() => backAction()}
          style={{ color: token.colorTextSecondary }}
        />
        <div style={{ width: 1, height: 32, background: token.colorBorder }} />
        <Flex vertical>
          <Flex align="center" gap={8}>
            <span
              className="material-symbols-outlined"
              style={{ color: token.colorPrimary, fontSize: 20 }}
            >
              account_tree
            </span>
            <Title
              level={5}
              style={{ margin: 0, color: token.colorTextBase, lineHeight: 1 }}
            >
              {metadata.name}
            </Title>
            <Button
              type="text"
              size="small"
              icon={
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16 }}
                >
                  edit
                </span>
              }
              onClick={handleEditMetadata}
              style={{
                color: token.colorTextSecondary,
                padding: '0 4px',
                height: 'auto',
              }}
            />
          </Flex>
          <Flex align="center" gap={8}>
            <Text style={{ fontSize: 12, color: token.colorTextSecondary }}>
              {isNew ? 'Sin guardar' : 'Guardado'}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Right Section: Save, Menu, User */}
      <Flex align="center" gap={12}>
        <Button
          type="primary"
          icon={
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}
            >
              save
            </span>
          }
          style={{
            color: token.colorBgBase,
            fontWeight: 'bold',
            boxShadow: 'none',
          }}
          onClick={actionSave}
          loading={isSaving}
          disabled={isSaving}
        >
          Guardar
        </Button>

        <Dropdown
          menu={{
            items: [
              {
                key: 'import',
                label: 'Importar JSON',
                icon: (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    file_upload
                  </span>
                ),
                onClick: handleImport,
              },
              {
                key: 'export',
                label: 'Exportar JSON',
                icon: (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    file_download
                  </span>
                ),
                onClick: handleExport,
              },
            ],
          }}
        >
          <Button
            type="text"
            icon={
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20 }}
              >
                more_vert
              </span>
            }
            style={{
              color: token.colorTextBase,
              backgroundColor: token.colorBorderSecondary,
            }}
          />
        </Dropdown>

        <div
          style={{
            width: 1,
            height: 32,
            background: token.colorBorder,
            margin: '0 8px',
          }}
        />

        <Avatar
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlVcKPlbJqg1OTpxFJ47ozi-UXs9RyQ6g0xglWPjQWD6LoIavxNGdeg7uUQFdvpcRufnjn43wSghG5Tgm4YJhBZEhErX4Voj_NtQuc2Oql9_Z5tuRzWVlcoYDbAOEC9u51Xv8afk0xPZGSD6jUZwoDPjcNt0evgVUSfOh8ZmMZr1ANW6APa0feRf19zd7VgIy1321uHVbJxAqtpMf9K3fULI8BrwskeVY6uOPq_Kb6DgOIXlIKnGoniprB-vZ5y7jMxcS_9gu0-lE"
          style={{
            border: `2px solid ${token.colorBorder}`,
            cursor: 'pointer',
          }}
        />
      </Flex>

      <WorkflowMetadataModal
        open={showMetadataModal}
        initialValues={metadata}
        onConfirm={handleMetadataConfirm}
        onCancel={() => setShowMetadataModal(false)}
        confirmLoading={isSaving}
      />

      {/* Hidden file input for import */}
      <input {...getFileInputProps()} />
    </Header>
  );
};
