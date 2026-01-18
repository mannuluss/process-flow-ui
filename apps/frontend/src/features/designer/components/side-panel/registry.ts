import type { PanelDefinition } from './types';
import { NodeProperties } from './NodeProperties';
import { TransitionProperties } from './TransitionProperties';

/**
 * Registry of all available panel types.
 * Order matters - first match wins.
 */
export const panelRegistry: PanelDefinition[] = [
  {
    type: 'handler',
    match: p => p?.type === 'handler',
    component: TransitionProperties,
  },
  {
    type: 'node',
    match: p => p?.id && p?.position,
    component: NodeProperties,
  },
];

/**
 * Find the panel definition that matches the given payload
 */
export function findPanelDefinition(payload: any): PanelDefinition | undefined {
  return panelRegistry.find(def => def.match(payload));
}
