export enum RuleType {
  ROLE_CHECK = 'ROLE_CHECK',
  DOCUMENT_STATUS_CHECK = 'DOCUMENT_STATUS_CHECK',
  SQL_CHECK_CUSTOM = 'SQL_CHECK_CUSTOM',
  API_CHECK_CUSTOM = 'API_CHECK_CUSTOM',
}

export interface BaseRule {
  type: RuleType;
  errorMessage?: string;
}

export interface RoleCheckRule extends BaseRule {
  type: RuleType.ROLE_CHECK;
  params: {
    allowedRoles: string[];
  };
}

export interface DocumentStatusCheckRule extends BaseRule {
  type: RuleType.DOCUMENT_STATUS_CHECK;
  params: {
    documentId: string;
    requiredStatus: string;
  };
}

export interface SqlCheckRule extends BaseRule {
  type: RuleType.SQL_CHECK_CUSTOM;
  params: {
    sql: string;
    errorMessage: string;
  };
}

export interface ApiCheckRule extends BaseRule {
  type: RuleType.API_CHECK_CUSTOM;
  params: {
    endpoint: string;
    method: 'GET' | 'POST';
    body?: any;
    expectedField: string;
    expectedValue: any;
  };
}

export type Rule = RoleCheckRule | DocumentStatusCheckRule | SqlCheckRule | ApiCheckRule;

export interface ProcessNodeData {
  label: string;
  description?: string;
  isInitial?: boolean;
  isFinal?: boolean;
  metadata?: Record<string, any>;
}

export interface ProcessEdgeData {
  trigger?: string;
  rules?: Rule[];
}

export interface DataSource {
  id: string;
  name: string;
  description?: string;
  sourceType: 'SQL' | 'API';
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
  };
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
  createdAt?: Date;
  updatedAt?: Date;
}
