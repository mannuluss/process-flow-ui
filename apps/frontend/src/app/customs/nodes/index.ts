import type { NodeTypes } from '@xyflow/react';

import { CustomProcessNode } from './CustomProcesoNode';
import { InitialNode } from './InitialNode';

export const nodeTypes = {
  proceso: CustomProcessNode,
  initial: InitialNode,
} satisfies NodeTypes;
