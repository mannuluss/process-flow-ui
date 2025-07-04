import type { NodeTypes } from '@xyflow/react';

import { CustomProcessNode } from './CustomProcesoNode';

export const nodeTypes = {
  proceso: CustomProcessNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
