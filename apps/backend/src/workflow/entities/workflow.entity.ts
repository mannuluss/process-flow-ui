import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { WorkflowDefinition } from '@process-flow/common';

@Entity('workflows')
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 1 })
  version: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column('jsonb')
  definition: WorkflowDefinition;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
