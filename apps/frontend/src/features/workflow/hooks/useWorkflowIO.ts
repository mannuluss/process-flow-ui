import { useRef, useCallback } from 'react';
import { message } from 'antd';
import {
  exportWorkflowToJSON,
  parseWorkflowFromJSON,
  WorkflowExportData,
  WorkflowImportError,
  ExportWorkflowInput,
} from '../utils/workflow-io.utils';

/**
 * Hook for workflow export/import functionality.
 * Provides methods for exporting workflows to JSON and importing from files.
 */
export const useWorkflowIO = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onImportCallbackRef = useRef<
    ((data: WorkflowExportData) => void) | null
  >(null);

  /**
   * Exports a workflow to a JSON file and triggers download
   */
  const exportWorkflow = useCallback((input: ExportWorkflowInput) => {
    try {
      exportWorkflowToJSON(input);
      message.success('Workflow exportado correctamente');
    } catch (error) {
      console.error('Export error:', error);
      message.error('Error al exportar el workflow');
    }
  }, []);

  /**
   * Handles the file input change event
   */
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const data = await parseWorkflowFromJSON(file);

        if (onImportCallbackRef.current) {
          onImportCallbackRef.current(data);
        }

        message.success('Workflow importado correctamente');
      } catch (error) {
        console.error('Import error:', error);
        if (error instanceof WorkflowImportError) {
          message.error(error.message);
        } else {
          message.error('Error al importar el workflow');
        }
      } finally {
        // Reset the input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    []
  );

  /**
   * Opens the file picker dialog for importing a workflow
   * @param onImport Callback function that receives the parsed workflow data
   */
  const triggerImport = useCallback(
    (onImport: (data: WorkflowExportData) => void) => {
      onImportCallbackRef.current = onImport;
      fileInputRef.current?.click();
    },
    []
  );

  /**
   * Gets the props to spread on a hidden file input element.
   * Usage: <input {...getFileInputProps()} />
   */
  const getFileInputProps = useCallback(
    () => ({
      ref: fileInputRef,
      type: 'file' as const,
      accept: '.json',
      style: { display: 'none' } as React.CSSProperties,
      onChange: handleFileChange,
    }),
    [handleFileChange]
  );

  return {
    exportWorkflow,
    triggerImport,
    getFileInputProps,
  };
};

export type { WorkflowExportData, ExportWorkflowInput };
