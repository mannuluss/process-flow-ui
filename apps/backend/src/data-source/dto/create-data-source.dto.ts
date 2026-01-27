import { DataSourceType } from '../entities/data-source.entity';

export class CreateDataSourceDto {
  id: string;
  name: string;
  description?: string;
  sourceType: DataSourceType;
  querySql?: string;
  apiUrl?: string;
  apiMethod?: string;
  apiHeaders?: Record<string, string>;
  mappingConfig: {
    valueField: string;
    labelField: string;
    responsePath?: string;
    tableName?: string;
    idField?: string;
    nameField?: string;
    whereClause?: string;
  };
}
