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
import { ProcessInstanceService } from './process-instance.service';
import { CreateProcessInstanceDto } from './dto/create-process-instance.dto';
import { UpdateProcessInstanceDto } from './dto/update-process-instance.dto';

@ApiTags('Process Instances')
@Controller('process-instance')
export class ProcessInstanceController {
  constructor(
    private readonly processInstanceService: ProcessInstanceService,
  ) {}

  @Post()
  create(@Body() createProcessInstanceDto: CreateProcessInstanceDto) {
    return this.processInstanceService.create(createProcessInstanceDto);
  }

  @Get()
  findAll() {
    return this.processInstanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.processInstanceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProcessInstanceDto: UpdateProcessInstanceDto,
  ) {
    return this.processInstanceService.update(id, updateProcessInstanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.processInstanceService.remove(id);
  }

  @Post(':id/transition')
  transition(
    @Param('id') id: string,
    @Body() body: { trigger: string; context?: Record<string, any> },
  ) {
    return this.processInstanceService.transition(
      id,
      body.trigger,
      body.context,
    );
  }
}
