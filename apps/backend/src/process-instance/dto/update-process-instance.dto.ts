import { PartialType } from '@nestjs/mapped-types';
import { CreateProcessInstanceDto } from './create-process-instance.dto';

export class UpdateProcessInstanceDto extends PartialType(
  CreateProcessInstanceDto,
) {}
