import React from 'react';
import { Modal, Form, Input } from 'antd';
import type { WorkflowMetadata } from '@process-flow/common';

interface WorkflowMetadataModalProps {
  open: boolean;
  initialValues?: Partial<WorkflowMetadata>;
  onConfirm: (values: WorkflowMetadata) => void;
  onCancel: () => void;
  confirmLoading?: boolean;
}

export const WorkflowMetadataModal: React.FC<WorkflowMetadataModalProps> = ({
  open,
  initialValues,
  onConfirm,
  onCancel,
  confirmLoading,
}) => {
  const [form] = Form.useForm<WorkflowMetadata>();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onConfirm(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Información del Workflow"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText="Guardar"
      cancelText="Cancelar"
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          label="Nombre"
          name="name"
          rules={[
            { required: true, message: 'El nombre es requerido' },
            { min: 3, message: 'Mínimo 3 caracteres' },
          ]}
        >
          <Input placeholder="Ej: Proceso de Aprobación" />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ max: 500, message: 'Máximo 500 caracteres' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Describe brevemente el propósito del workflow..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
