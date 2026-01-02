import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Workflow } from '../../workflow/entities/workflow.entity';

export enum ProcessStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PAUSED = 'PAUSED',
}

@Entity('process_instances')
export class ProcessInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'workflow_id' })
  workflowId: string;

  @ManyToOne(() => Workflow)
  @JoinColumn({ name: 'workflow_id' })
  workflow: Workflow;

  @Column({ name: 'current_node_id' })
  currentNodeId: string;

  @Column({
    type: 'enum',
    enum: ProcessStatus,
    default: ProcessStatus.ACTIVE,
  })
  status: ProcessStatus;

  @Column('jsonb', { default: {} })
  context: Record<string, any>;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
