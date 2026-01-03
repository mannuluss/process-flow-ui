import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DataSourceType {
  SQL = 'SQL',
  API = 'API',
}

export enum DataSourceStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

@Entity('data_sources')
export class DataSource {
  @PrimaryColumn()
  id: string; // User defined ID, e.g., 'DS_ROLES'

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: DataSourceType,
    default: DataSourceType.SQL,
    name: 'source_type',
  })
  sourceType: DataSourceType;

  @Column({ name: 'query_sql', nullable: true, type: 'text' })
  querySql: string;

  @Column({ name: 'api_url', nullable: true, type: 'text' })
  apiUrl: string;

  @Column({ name: 'api_method', nullable: true })
  apiMethod: string;

  @Column('jsonb', { name: 'api_headers', default: {} })
  apiHeaders: Record<string, string>;

  @Column('jsonb', { name: 'mapping_config', nullable: true })
  mappingConfig: {
    valueField: string;
    labelField: string;
    responsePath?: string;
    tableName?: string;
    idField?: string;
    nameField?: string;
    whereClause?: string;
  };

  @Column({
    type: 'enum',
    enum: DataSourceStatus,
    default: DataSourceStatus.PENDING,
  })
  status: DataSourceStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
