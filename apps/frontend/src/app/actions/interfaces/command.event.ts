import { Edge, ReactFlowInstance } from '@xyflow/react';
import { RootState } from 'src/store/store';

import { AppNode } from '../../customs/nodes/types';

/**
 * Los tipos de menus contextuales soportados por la aplicacion
 */
export type TypeContextApp = 'Node' | 'Edge' | 'Graph';

export interface CommandContext<T = any> {
  type: TypeContextApp;
  state: ReactFlowInstance<AppNode, Edge>;
  object: T;
  appStore: RootState;
}
