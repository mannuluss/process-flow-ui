import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource as TypeOrmDataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateDataSourceDto } from './dto/create-data-source.dto';
import { UpdateDataSourceDto } from './dto/update-data-source.dto';
import {
  DataSource,
  DataSourceStatus,
  DataSourceType,
} from './entities/data-source.entity';

@Injectable()
export class DataSourceService {
  constructor(
    @InjectRepository(DataSource)
    private dataSourceRepository: Repository<DataSource>,
    private readonly httpService: HttpService,
    private readonly typeOrmDataSource: TypeOrmDataSource, // To execute raw SQL
  ) {}

  async create(createDataSourceDto: CreateDataSourceDto) {
    const dataSource = this.dataSourceRepository.create({
      ...createDataSourceDto,
      status: DataSourceStatus.PENDING,
    });
    return this.dataSourceRepository.save(dataSource);
  }

  findAll() {
    return this.dataSourceRepository.find();
  }

  findOne(id: string) {
    return this.dataSourceRepository.findOneBy({ id });
  }

  async update(id: string, updateDataSourceDto: UpdateDataSourceDto) {
    await this.dataSourceRepository.update(id, updateDataSourceDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.dataSourceRepository.delete(id);
  }

  async testConnection(id: string, params: Record<string, any> = {}) {
    const dataSource = await this.findOne(id);
    if (!dataSource) {
      throw new BadRequestException(`Data source with ${id} not found`);
    }

    try {
      let result: any;
      if (dataSource.sourceType === DataSourceType.SQL) {
        result = await this.executeSql(dataSource.querySql, params);
      } else {
        result = await this.executeApi(dataSource, params);
      }

      // Update status to SUCCESS
      await this.dataSourceRepository.update(id, {
        status: DataSourceStatus.SUCCESS,
      });

      return {
        status: 'success',
        message: 'Connection successful',
        data: result,
      };
    } catch (error) {
      // Update status to ERROR
      await this.dataSourceRepository.update(id, {
        status: DataSourceStatus.ERROR,
      });

      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async execute(id: string, params: Record<string, any> = {}) {
    const dataSource = await this.findOne(id);
    if (!dataSource) {
      throw new BadRequestException('Data source not found');
    }

    if (dataSource.sourceType === DataSourceType.SQL) {
      return this.executeSql(dataSource.querySql, params);
    } else {
      return this.executeApi(dataSource, params);
    }
  }

  private async executeSql(sql: string, params: Record<string, any>) {
    // WARNING: This is vulnerable to SQL Injection if params are not handled correctly.
    // TypeORM's query method supports parameter replacement ($1, $2, etc. or @param) depending on driver.
    // For dynamic SQL from user input, we must be extremely careful.
    // Here we assume 'params' are safe or the SQL is static.
    // A better approach for V2 is to use a parser or specific parameter syntax like :paramName

    // TODO: Find a way to avoid SQL injection. Currently using simple string replacement.
    const processedSql = this.replaceParamsInString(sql, params);

    return this.typeOrmDataSource.query(processedSql);
  }

  private async executeApi(
    dataSource: DataSource,
    params: Record<string, any>,
  ) {
    const { apiUrl, apiMethod, apiHeaders } = dataSource;

    // Replace params in URL
    const url = this.replaceParamsInString(apiUrl, params);

    // Replace params in Body/Data if needed (for POST/PUT)
    // Currently we just send params as data, but we might want to support body templates in the future.
    // For now, let's keep sending params as data, but maybe we should filter out the ones used in URL?
    // The current implementation sends all params as body.

    const response = await firstValueFrom(
      this.httpService.request({
        url,
        method: apiMethod as any,
        headers: apiHeaders,
        data: params, // Send params as body for POST/PUT
      }),
    );

    // Apply mapping if needed (responsePath)
    const responsePath = dataSource.mappingConfig?.responsePath;
    if (responsePath) {
      return responsePath.split('.').reduce((o, i) => o?.[i], response.data);
    }

    return response.data;
  }

  private replaceParamsInString(
    text: string,
    context: Record<string, any>,
  ): string {
    if (!text) return text;
    return text.replace(/:([a-zA-Z0-9_]+)/g, (match, key) => {
      return context[key] !== undefined ? String(context[key]) : match;
    });
  }
}
