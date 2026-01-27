import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSourceService } from './data-source.service';
import { CreateDataSourceDto } from './dto/create-data-source.dto';
import { UpdateDataSourceDto } from './dto/update-data-source.dto';

@ApiTags('Data Sources')
@Controller('data-source')
export class DataSourceController {
  constructor(private readonly dataSourceService: DataSourceService) {}

  @Post()
  create(@Body() createDataSourceDto: CreateDataSourceDto) {
    return this.dataSourceService.create(createDataSourceDto);
  }

  @Get()
  findAll() {
    return this.dataSourceService.findAll();
  }

  @Get('schema/tables')
  getTables() {
    return this.dataSourceService.getTables();
  }

  @Get('schema/tables/:tableName/columns')
  getColumns(@Param('tableName') tableName: string) {
    return this.dataSourceService.getColumns(tableName);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataSourceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDataSourceDto: UpdateDataSourceDto,
  ) {
    return this.dataSourceService.update(id, updateDataSourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataSourceService.remove(id);
  }

  @Post('test-config')
  testConfig(
    @Body()
    body: {
      config: Partial<CreateDataSourceDto>;
      params?: Record<string, any>;
    },
  ) {
    return this.dataSourceService.testConfig(body.config, body.params ?? {});
  }

  @Post(':id/execution')
  execute(
    @Param('id') id: string,
    @Body() body: { params?: Record<string, any> },
  ) {
    return this.dataSourceService.execute(id, body?.params ?? {});
  }
}
