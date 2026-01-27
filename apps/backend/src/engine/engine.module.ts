import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EngineService } from './engine.service';
import { DataSourceModule } from '../data-source/data-source.module';

@Module({
  imports: [DataSourceModule, HttpModule],
  providers: [EngineService],
  exports: [EngineService],
})
export class EngineModule {}
