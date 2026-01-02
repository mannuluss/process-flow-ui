import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { Workflow } from './entities/workflow.entity';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow)
    private workflowRepository: Repository<Workflow>,
  ) {}

  create(createWorkflowDto: CreateWorkflowDto) {
    const workflow = this.workflowRepository.create(createWorkflowDto);
    return this.workflowRepository.save(workflow);
  }

  findAll() {
    return this.workflowRepository.find();
  }

  findOne(id: string) {
    return this.workflowRepository.findOneBy({ id });
  }

  update(id: string, updateWorkflowDto: UpdateWorkflowDto) {
    return this.workflowRepository.update(id, updateWorkflowDto);
  }

  remove(id: string) {
    return this.workflowRepository.delete(id);
  }
}
