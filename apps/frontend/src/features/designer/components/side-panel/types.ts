import type { NodeHandler } from '@process-flow/common';
import type { AppNode } from '@core/designer/types';

/**
 * Base props that all panel components receive
 */
export interface PanelProps<T = any> {
  payload: T;
  onClose: () => void;
}

/**
 * Definition for registering a panel type
 */
export interface PanelDefinition {
  /** Unique identifier for this panel type */
  type: string;
  /** Function to detect if this panel handles the given payload */
  match: (payload: any) => boolean;
  /** Component to render for this panel type */
  component: React.ComponentType<PanelProps<any>>;
}
//TODO: se debe mover a cada type de la feature, no puede estar dentro del componente side panel, el no es el responsable de esto
/**
 * Payload for handler/transition panel
 */
export interface HandlerPayload {
  type: 'handler';
  nodeId: string;
  handlerId: string;
  handler: NodeHandler;
}

/**
 * Payload for node panel (the node itself)
 */
export type NodePayload = AppNode;
