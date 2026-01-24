import { useState } from 'react';
import { message } from 'antd';
import { useWorkflow } from '../context/WorkflowContext';
import { useCommand } from '@commands/context/CommandContext';
import {
  SaveCommandContext,
  SaveCommandResult,
} from '@commands/commands/save.command';

interface SaveWorkflowOptions {
  nodes: any[];
  edges: any[];
  metadata?: {
    name: string;
    description?: string;
  };
  onSuccess?: (workflowId: string) => void;
  onError?: (error: Error) => void;
}

export const useWorkflowSave = () => {
  const { workflowId, metadata, isNew, setWorkflowId, setIsModified } =
    useWorkflow();
  const { commandManager } = useCommand();
  const [isSaving, setIsSaving] = useState(false);

  const saveWorkflow = async ({
    nodes,
    edges,
    metadata: overrideMetadata,
    onSuccess,
    onError,
  }: SaveWorkflowOptions) => {
    try {
      setIsSaving(true);

      // Use override metadata if provided, otherwise use context metadata
      const metadataToUse = overrideMetadata || {
        name: metadata.name,
        description: metadata.description,
      };

      // Execute save command with await
      const result = await commandManager.executeCommand<
        SaveCommandContext,
        Promise<SaveCommandResult>
      >('saveGraph', {
        object: { nodes, edges },
        workflowId,
        metadata: metadataToUse,
      });

      if (result.success) {
        // Update context if it was a new workflow
        if (isNew) {
          setWorkflowId(result.workflowId);
        }

        setIsModified(false);
        message.success(
          `Workflow "${metadataToUse.name}" ${isNew ? 'creado' : 'actualizado'} exitosamente`
        );
        onSuccess?.(result.workflowId);
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      message.error(`Error al ${isNew ? 'crear' : 'actualizar'} el workflow`);
      onError?.(error as Error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveWorkflow,
    isSaving,
    isNew,
  };
};
