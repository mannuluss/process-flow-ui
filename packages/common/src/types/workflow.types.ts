import { ProcessNodeData, ProcessEdgeData } from './index';

/**
 * Represents a node in the workflow canvas
 */
export interface WorkflowNode {
  id: string;
  type: string;
  data: ProcessNodeData;
  position: { x: number; y: number };
}

/**
 * Represents an edge (connection) between nodes in the workflow
 */
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  data: ProcessEdgeData;
}

/**
 * The complete workflow definition containing all nodes and edges
 */
export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

/**
 * Metadata information for a workflow (used for create/update operations)
 */
export interface WorkflowMetadata {
  name: string;
  description?: string;
  isActive?: boolean;
}

/**
 * Complete workflow entity (as stored in database)
 */
export interface Workflow extends WorkflowMetadata {
  id: string;
  version: number;
  definition: WorkflowDefinition;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Payload for creating a new workflow
 */
export interface CreateWorkflowDto extends WorkflowMetadata {
  definition: WorkflowDefinition;
}

/**
 * Payload for updating an existing workflow
 */
export interface UpdateWorkflowDto extends Partial<WorkflowMetadata> {
  definition?: WorkflowDefinition;
}
