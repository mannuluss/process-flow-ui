import {
  IsString,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { WorkflowDefinition } from '@process-flow/common';

class WorkflowDefinitionDto implements WorkflowDefinition {
  @IsObject({ each: true })
  nodes: any[];

  @IsObject({ each: true })
  edges: any[];
}

export class CreateWorkflowDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ValidateNested()
  @Type(() => WorkflowDefinitionDto)
  definition: WorkflowDefinition;
}
