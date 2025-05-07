import type { NodeTypes } from '@xyflow/react';
import { StartNode } from './NodeStart';

export const nodeTypes = {
  'start': StartNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
