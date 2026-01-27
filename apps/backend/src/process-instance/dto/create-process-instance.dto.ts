export class CreateProcessInstanceDto {
  workflowId: string;
  context?: Record<string, any>;
  createdBy?: string;
  trigger?: string; // Optional trigger to determine initial path
}
