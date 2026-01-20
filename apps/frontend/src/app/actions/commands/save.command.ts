import { workflowService } from '../../../features/workflow/services/workflow.service';
import type { WorkflowDefinition } from '@process-flow/common';

export interface SaveCommandContext {
  object: {
    nodes: any[];
    edges: any[];
  };
  workflowId?: string | null;
  metadata: {
    name: string;
    description?: string;
  };
}

export interface SaveCommandResult {
  success: boolean;
  workflowId: string;
  workflow: any;
}

/**
 * Comando para guardar el workflow (create o update).
 * Retorna una promesa para poder hacer await desde el caller.
 */
export default async function SaveCommand(context: SaveCommandContext) {
  const definition: WorkflowDefinition = {
    nodes: context.object.nodes,
    edges: context.object.edges,
  };

  console.info('[GRAPH] SaveCommand - definition:', definition);
  console.info('[GRAPH] SaveCommand - metadata:', context.metadata);

  const isNew = !context.workflowId;

  if (isNew) {
    // Create new workflow
    const created = await workflowService.create({
      name: context.metadata.name,
      description: context.metadata.description,
      definition,
    });

    console.info('[GRAPH] Workflow created:', created.id);
    return { success: true, workflowId: created.id, workflow: created };
  } else {
    // Update existing workflow
    const updated = await workflowService.update(context.workflowId!, {
      name: context.metadata.name,
      description: context.metadata.description,
      definition,
    });

    console.info('[GRAPH] Workflow updated:', context.workflowId);
    return { success: true, workflowId: context.workflowId, workflow: updated };
  }
}
