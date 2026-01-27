import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { DataSourceService } from './data-source.service';
import { DataSourceController } from './data-source.controller';
import { DataSource } from './entities/data-source.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DataSource]), HttpModule],
  controllers: [DataSourceController],
  providers: [DataSourceService],
  exports: [DataSourceService],
})
export class DataSourceModule {}
