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
    querySql: string;
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

/**
 * Represents an output handler for a process node.
 * Each handler defines a possible transition from this node.
 */
export interface NodeHandler {
  /** Unique identifier for the handler (used as sourceHandle in edges) */
  id: string;
  /** Name of the trigger event (e.g., "BTN_SUBMIT", "auto_approve") */
  trigger: string;
  /** Validation rules that must pass before the transition */
  rules?: Rule[];
}

export interface ProcessNodeData {
  label: string;
  description?: string;
  /**
   * Material icon name for the node (e.g., 'CheckCircle', 'Send', 'Settings').
   * Used to visually identify the node type.
   */
  icon?: string;
  /**
   * Optional human-readable identifier (slug) for the node.
   * Useful if you want to reference nodes by code instead of UUID.
   */
  code?: string;
  metadata?: Record<string, any>;
  /** Output handlers for this node - defines possible transitions */
  handlers?: NodeHandler[];
}

/**
 * Edge data is now simplified since trigger/rules are stored in node handlers.
 * The edge only needs to reference which handler it connects from.
 */
export interface ProcessEdgeData {
  /**
   * Optional metadata for the edge (visual styling, labels, etc.)
   */
  metadata?: Record<string, any>;
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
