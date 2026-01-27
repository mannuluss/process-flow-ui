import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkflowModule } from './workflow/workflow.module';
import { Workflow } from './workflow/entities/workflow.entity';
import { ProcessInstance } from './process-instance/entities/process-instance.entity';
import { DataSource } from './data-source/entities/data-source.entity';
import { ProcessInstanceModule } from './process-instance/process-instance.module';
import { DataSourceModule } from './data-source/data-source.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EngineModule } from './engine/engine.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'process_flow',
      schema: process.env.DB_SCHEMA || 'public',
      entities: [Workflow, ProcessInstance, DataSource],
      migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
      migrationsRun: process.env.DB_SYNCHRONIZE !== 'true',
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
    WorkflowModule,
    ProcessInstanceModule,
    DataSourceModule,
    EngineModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/ui',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
