import type {
  WorkflowNode,
  WorkflowEdge,
  WorkflowDefinition,
} from '@process-flow/common';

/**
 * Format version for workflow export files.
 * Increment when making breaking changes to the export format.
 */
export const WORKFLOW_EXPORT_VERSION = '1.0';

/**
 * Data structure for workflow export/import
 */
export interface WorkflowExportData {
  version: string;
  exportedAt: string;
  workflow: {
    name: string;
    description?: string;
    definition: WorkflowDefinition;
  };
}

/**
 * Input data for creating an export
 */
export interface ExportWorkflowInput {
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

/**
 * Creates a WorkflowExportData object from workflow data
 */
export const createExportData = (
  input: ExportWorkflowInput
): WorkflowExportData => {
  return {
    version: WORKFLOW_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    workflow: {
      name: input.name,
      description: input.description,
      definition: {
        nodes: input.nodes,
        edges: input.edges,
      },
    },
  };
};

/**
 * Generates a safe filename for the export
 */
export const generateExportFilename = (workflowName: string): string => {
  const safeName = workflowName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const timestamp = new Date().toISOString().slice(0, 10);
  return `workflow-${safeName}-${timestamp}.json`;
};

/**
 * Exports workflow data to a JSON file and triggers download
 */
export const exportWorkflowToJSON = (input: ExportWorkflowInput): void => {
  const exportData = createExportData(input);
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = generateExportFilename(input.name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/**
 * Validation errors for import
 */
export class WorkflowImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WorkflowImportError';
  }
}

/**
 * Validates the structure of imported workflow data
 */
export const validateWorkflowData = (
  data: unknown
): data is WorkflowExportData => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Check required top-level fields
  if (typeof obj.version !== 'string') {
    return false;
  }

  if (!obj.workflow || typeof obj.workflow !== 'object') {
    return false;
  }

  const workflow = obj.workflow as Record<string, unknown>;

  // Check workflow fields
  if (typeof workflow.name !== 'string') {
    return false;
  }

  if (!workflow.definition || typeof workflow.definition !== 'object') {
    return false;
  }

  const definition = workflow.definition as Record<string, unknown>;

  // Check definition fields
  if (!Array.isArray(definition.nodes) || !Array.isArray(definition.edges)) {
    return false;
  }

  return true;
};

/**
 * Parses a JSON file and returns the workflow data
 */
export const parseWorkflowFromJSON = (
  file: File
): Promise<WorkflowExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        if (!validateWorkflowData(data)) {
          reject(
            new WorkflowImportError(
              'El archivo no tiene un formato de workflow válido'
            )
          );
          return;
        }

        resolve(data);
      } catch (error) {
        if (error instanceof SyntaxError) {
          reject(new WorkflowImportError('El archivo no contiene JSON válido'));
        } else {
          reject(error);
        }
      }
    };

    reader.onerror = () => {
      reject(new WorkflowImportError('Error al leer el archivo'));
    };

    reader.readAsText(file);
  });
};
