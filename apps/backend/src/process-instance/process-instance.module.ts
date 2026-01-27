import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessInstanceService } from './process-instance.service';
import { ProcessInstanceController } from './process-instance.controller';
import { ProcessInstance } from './entities/process-instance.entity';
import { WorkflowModule } from '../workflow/workflow.module';
import { EngineModule } from '../engine/engine.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProcessInstance]),
    WorkflowModule,
    EngineModule,
  ],
  controllers: [ProcessInstanceController],
  providers: [ProcessInstanceService],
})
export class ProcessInstanceModule {}
