import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProcessInstanceDto } from './dto/create-process-instance.dto';
import { UpdateProcessInstanceDto } from './dto/update-process-instance.dto';
import {
  ProcessInstance,
  ProcessStatus,
} from './entities/process-instance.entity';
import { WorkflowService } from '../workflow/workflow.service';
import { EngineService } from '../engine/engine.service';

@Injectable()
export class ProcessInstanceService {
  constructor(
    @InjectRepository(ProcessInstance)
    private processInstanceRepository: Repository<ProcessInstance>,
    private readonly workflowService: WorkflowService,
    private readonly engineService: EngineService,
  ) {}

  async create(createProcessInstanceDto: CreateProcessInstanceDto) {
    const { workflowId, context, trigger } = createProcessInstanceDto;

    // 1. Fetch Workflow Definition
    const workflow = await this.workflowService.findOne(workflowId);
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${workflowId} not found`);
    }

    // 2. Determine Initial Node using Engine
    const initialNodeId = await this.engineService.getInitialNode(
      workflow.definition,
      trigger ?? null,
      context || {},
    );

    // 3. Create Instance
    const instance = this.processInstanceRepository.create({
      ...createProcessInstanceDto,
      currentNodeId: initialNodeId,
      status: ProcessStatus.ACTIVE,
    });

    return this.processInstanceRepository.save(instance);
  }

  async transition(
    id: string,
    trigger: string,
    context: Record<string, any> = {},
  ) {
    // 1. Fetch Instance
    const instance = await this.findOne(id);
    if (!instance) {
      throw new NotFoundException(`Process Instance with ID ${id} not found`);
    }

    if (instance.status !== ProcessStatus.ACTIVE) {
      throw new BadRequestException(
        `Process Instance is not active (Status: ${instance.status})`,
      );
    }

    // 2. Fetch Workflow
    const workflow = await this.workflowService.findOne(instance.workflowId);
    if (!workflow) {
      throw new NotFoundException(
        `Workflow with ID ${instance.workflowId} not found`,
      );
    }

    // 3. Merge Context (Instance Context + Request Context)
    const mergedContext = { ...instance.context, ...context };

    // 4. Determine Next Node using Engine
    const nextNodeId = await this.engineService.evaluateTransition(
      workflow.definition,
      instance.currentNodeId,
      trigger,
      mergedContext,
    );

    // 5. Update Instance
    instance.currentNodeId = nextNodeId;
    instance.context = mergedContext;

    // Check if final node
    const nextNode = workflow.definition.nodes.find((n) => n.id === nextNodeId);
    if (nextNode?.data?.isFinal) {
      instance.status = ProcessStatus.COMPLETED;
    }

    return this.processInstanceRepository.save(instance);
  }

  findAll() {
    return this.processInstanceRepository.find();
  }

  findOne(id: string) {
    return this.processInstanceRepository.findOneBy({ id });
  }

  update(id: string, updateProcessInstanceDto: UpdateProcessInstanceDto) {
    return this.processInstanceRepository.update(id, updateProcessInstanceDto);
  }

  remove(id: string) {
    return this.processInstanceRepository.delete(id);
  }
}
