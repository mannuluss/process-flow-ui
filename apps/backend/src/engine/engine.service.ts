import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource as TypeOrmDataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DataSourceService } from '../data-source/data-source.service';
import {
  Rule,
  RuleType,
  RoleCheckRule,
  DocumentStatusCheckRule,
  SqlCheckRule,
  ApiCheckRule,
  NodeHandler,
  WorkflowDefinition,
} from '@process-flow/common';

@Injectable()
export class EngineService {
  constructor(
    private readonly dataSourceService: DataSourceService,
    private readonly typeOrmDataSource: TypeOrmDataSource,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Determines the initial node for a new process instance.
   * It looks for a node of type 'initial' and evaluates its handlers to find
   * a valid outgoing transition.
   */
  async getInitialNode(
    definition: WorkflowDefinition,
    trigger: string | null,
    context: Record<string, any>,
  ): Promise<string> {
    // 1. Find the 'initial' node (The entry point of the graph)
    const initialNode = definition.nodes.find((n) => n.type === 'initial');

    if (!initialNode) {
      throw new BadRequestException(
        'Workflow definition has no "initial" node defined.',
      );
    }

    // 2. Get handlers from the initial node
    const handlers: NodeHandler[] = initialNode.data?.handlers || [];

    // 3. Evaluate handlers to find a valid transition
    for (const handler of handlers) {
      // Check Trigger - skip if trigger doesn't match
      if (handler.trigger && handler.trigger !== trigger) {
        continue;
      }

      // Check Rules
      const rulesPassed = await this.evaluateRules(
        handler.rules || [],
        context,
      );
      if (!rulesPassed) {
        continue;
      }

      // Find the edge that connects from this handler (sourceHandle === handler.id)
      const edge = definition.edges.find(
        (e) => e.source === initialNode.id && e.sourceHandle === handler.id,
      );

      if (edge) {
        return edge.target;
      }
    }

    throw new BadRequestException(
      `No valid initial path found for trigger "${trigger}".`,
    );
  }

  /**
   * Evaluates transitions from a current node based on a trigger and context.
   * Reads handlers from the node's data and finds the matching edge by sourceHandle.
   */
  async evaluateTransition(
    definition: WorkflowDefinition,
    currentNodeId: string,
    trigger: string,
    context: Record<string, any>,
  ): Promise<string> {
    // 1. Find the current node
    const currentNode = definition.nodes.find((n) => n.id === currentNodeId);

    if (!currentNode) {
      throw new BadRequestException(`Node "${currentNodeId}" not found.`);
    }

    // 2. Get handlers from the current node
    const handlers: NodeHandler[] = currentNode.data?.handlers || [];

    // 3. Evaluate handlers to find a valid transition
    for (const handler of handlers) {
      // Check Trigger - skip if trigger doesn't match
      if (handler.trigger !== trigger) {
        continue;
      }

      // Check Rules
      const rulesPassed = await this.evaluateRules(
        handler.rules || [],
        context,
      );
      if (!rulesPassed) {
        continue;
      }

      // Find the edge that connects from this handler (sourceHandle === handler.id)
      const edge = definition.edges.find(
        (e) => e.source === currentNodeId && e.sourceHandle === handler.id,
      );

      if (edge) {
        return edge.target;
      }
    }

    throw new BadRequestException(
      `No valid transition found from node "${currentNodeId}" for trigger "${trigger}".`,
    );
  }

  /**
   * Evaluates a list of rules against a context.
   * Returns true if ALL rules pass (AND logic).
   */
  async evaluateRules(
    rules: Rule[],
    context: Record<string, any>,
  ): Promise<boolean> {
    for (const rule of rules) {
      const passed = await this.evaluateRule(rule, context);
      if (!passed) {
        return false;
      }
    }
    return true;
  }

  private async evaluateRule(
    rule: Rule,
    context: Record<string, any>,
  ): Promise<boolean> {
    switch (rule.type) {
      case RuleType.ROLE_CHECK:
        return this.evaluateRoleCheck(rule, context);
      case RuleType.DOCUMENT_STATUS_CHECK:
        return this.evaluateDocumentStatusCheck(rule, context);
      case RuleType.SQL_CHECK_CUSTOM:
        return this.evaluateSqlCheck(rule, context);
      case RuleType.API_CHECK_CUSTOM:
        return this.evaluateApiCheck(rule, context);
      default:
        return true;
    }
  }

  private evaluateRoleCheck(
    rule: RoleCheckRule,
    context: Record<string, any>,
  ): boolean {
    const userRoles = context.user?.roles || [];
    return rule.params.allowedRoles.some((role) => userRoles.includes(role));
  }

  private evaluateDocumentStatusCheck(
    rule: DocumentStatusCheckRule,
    context: Record<string, any>,
  ): boolean {
    const documents = context.documents || [];
    const doc = documents.find((d: any) => d.id === rule.params.documentId);
    return doc && doc.status === rule.params.requiredStatus;
  }

  private async evaluateSqlCheck(
    rule: SqlCheckRule,
    context: Record<string, any>,
  ): Promise<boolean> {
    try {
      let sql = rule.params.querySql;

      // TODO: Find a way to avoid SQL injection. Currently using simple string replacement.
      // We should implement a proper parser or use TypeORM parameters if possible.
      sql = this.replaceParamsInString(sql, context);

      const result = await this.typeOrmDataSource.query(sql);
      return result && result.length > 0;
    } catch (error) {
      console.error('SQL Check Error:', error);
      return false;
    }
  }

  private async evaluateApiCheck(
    rule: ApiCheckRule,
    context: Record<string, any>,
  ): Promise<boolean> {
    try {
      const { endpoint, method, body, expectedField, expectedValue } =
        rule.params;

      const url = this.replaceParamsInString(endpoint, context);
      const data = this.replaceParamsInObject(body, context);

      const response = await firstValueFrom(
        this.httpService.request({
          url,
          method: method as any,
          data,
        }),
      );

      const actualValue = expectedField
        .split('.')
        .reduce((o, i) => o?.[i], response.data);

      // Loose equality check to handle string/number differences
      return actualValue == expectedValue;
    } catch (error) {
      console.error('API Check Error:', error);
      return false;
    }
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

  private replaceParamsInObject(obj: any, context: Record<string, any>): any {
    if (!obj) return obj;
    if (typeof obj === 'string') {
      return this.replaceParamsInString(obj, context);
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => this.replaceParamsInObject(item, context));
    }
    if (typeof obj === 'object') {
      const newObj = {};
      for (const key in obj) {
        newObj[key] = this.replaceParamsInObject(obj[key], context);
      }
      return newObj;
    }
    return obj;
  }
}
