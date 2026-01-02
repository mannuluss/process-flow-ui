import { WorkflowDefinition } from '../entities/workflow.entity';

export class CreateWorkflowDto {
  name: string;
  description?: string;
  definition: WorkflowDefinition;
}
