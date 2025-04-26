import type { NodeTypes } from '@xyflow/react';

import { StartNode } from './NodeStart';
import { AppNode } from './types';
// import { v4 as uuidv4 } from 'uuid';


export const initialNodes: AppNode[] = [
  { id: '1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Inicio' } },
  {
    id: '2',
    type: 'position-logger',
    position: { x: -100, y: 100 },
    data: { label: 'drag me!' },
  },
  { id: '3', position: { x: 100, y: 100 }, data: { label: 'your ideas' } },
  {
    id: '4',
    type: 'output',
    position: { x: 0, y: 200 },
    data: { label: 'with React Flow' },
  },
];

export const nodeTypes = {
  'start': StartNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
