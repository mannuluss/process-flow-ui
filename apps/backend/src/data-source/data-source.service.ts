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
    // Initial status is PENDING
    let status = DataSourceStatus.PENDING;

    // Try to test connection immediately upon creation

    // if (
    //   createDataSourceDto.sourceType === DataSourceType.SQL &&
    //   createDataSourceDto.querySql
    // ) {
    //   await this.executeSql(createDataSourceDto.querySql, {});
    //   status = DataSourceStatus.SUCCESS;
    // } else if (
    //   createDataSourceDto.sourceType === DataSourceType.API &&
    //   createDataSourceDto.apiUrl
    // ) {
    //   // Create a temp object for execution
    //   const tempDS = { ...createDataSourceDto } as DataSource;
    //   await this.executeApi(tempDS, {});
    // }
    const exec = await this.testConfig(createDataSourceDto, {});
    if (exec.status === 'success') {
      status = DataSourceStatus.SUCCESS;
    } else {
      status = DataSourceStatus.ERROR;
    }

    const dataSource = this.dataSourceRepository.create({
      ...createDataSourceDto,
      status,
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
    // If critical config changed, re-test
    let status: DataSourceStatus | undefined;

    const exec = await this.testConfig(updateDataSourceDto, {});
    if (exec.status === 'success') {
      status = DataSourceStatus.SUCCESS;
    } else {
      status = DataSourceStatus.ERROR;
    }

    await this.dataSourceRepository.update(id, {
      ...updateDataSourceDto,
      ...(status && { status }),
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.dataSourceRepository.delete(id);
  }

  async testConfig(
    config: Partial<CreateDataSourceDto>,
    params: Record<string, any> = {},
  ) {
    try {
      let result: any;
      if (config.sourceType === DataSourceType.SQL) {
        // Check if we have a visual builder config
        if (config.mappingConfig?.tableName) {
          const { tableName, idField, nameField, whereClause } =
            config.mappingConfig;
          if (!tableName || !idField || !nameField) {
            throw new BadRequestException(
              'Table Name, ID Field and Name Field are required for Visual Builder',
            );
          }
          const sql = `SELECT ${idField} as id, ${nameField} as name FROM ${tableName} ${whereClause ? `WHERE ${whereClause}` : ''}`;
          result = await this.executeSql(sql, params);
        } else {
          if (!config.querySql)
            throw new BadRequestException(
              'SQL Query is required or Visual Builder config is incomplete',
            );
          result = await this.executeSql(config.querySql, params);
        }
      } else {
        if (!config.apiUrl)
          throw new BadRequestException('API URL is required');
        // Create a temporary object that looks like a DataSource
        const tempDataSource = { ...config } as DataSource;
        result = await this.executeApi(tempDataSource, params);
      }

      return {
        status: 'success',
        message: 'Connection successful',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  async getTables() {
    const query = `
      SELECT table_schema || '.' || table_name as "fullName", table_name as "tableName", table_schema as "schema"
      FROM information_schema.tables
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
      AND table_type = 'BASE TABLE'
      ORDER BY table_schema, table_name
    `;
    return this.typeOrmDataSource.query(query);
  }

  async getColumns(tableName: string) {
    // tableName might be "schema.table" or just "table"
    let schema = 'public';
    let table = tableName;

    if (tableName.includes('.')) {
      [schema, table] = tableName.split('.');
    }

    const query = `
      SELECT column_name as "columnName", data_type as "dataType"
      FROM information_schema.columns
      WHERE table_schema = $1 AND table_name = $2
      ORDER BY ordinal_position
    `;
    return this.typeOrmDataSource.query(query, [schema, table]);
  }

  async execute(id: string, params: Record<string, any> = {}) {
    const dataSource = await this.findOne(id);
    if (!dataSource) {
      throw new BadRequestException('Data source not found');
    }

    if (dataSource.sourceType === DataSourceType.SQL) {
      // Check if we have a visual builder config
      if (dataSource.mappingConfig?.tableName) {
        const { tableName, idField, nameField, whereClause } =
          dataSource.mappingConfig;
        // We assume validation was done at creation/update
        const sql = `SELECT ${idField} as id, ${nameField} as name FROM ${tableName} ${whereClause ? `WHERE ${whereClause}` : ''}`;
        return this.executeSql(sql, params);
      }
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
