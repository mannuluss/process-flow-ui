import { Node, Edge } from '@xyflow/react';
import { InitialCustomNode } from '../../designer/types';

/**
 * Workflow node utilities
 */

/**
 * Finds the initial node in a list of nodes
 */
export const findInitialNode = (
  nodes: Node[]
): InitialCustomNode | undefined => {
  return nodes.find(n => n.type === 'initial') as InitialCustomNode | undefined;
};

/**
 * Checks if a node is the initial node type
 */
export const isInitialNodeType = (node: Node): boolean => {
  return node.type === 'initial';
};

/**
 * Checks if there's a connection from the initial node to a target node
 */
export const hasConnectionFromInitial = (
  edges: Edge[],
  initialNodeId: string,
  targetNodeId: string
): boolean => {
  return edges.some(
    e => e.source === initialNodeId && e.target === targetNodeId
  );
};

/**
 * Finds the edge connecting initial node to a target node
 */
export const findEdgeFromInitial = (
  edges: Edge[],
  initialNodeId: string,
  targetNodeId: string
): Edge | undefined => {
  return edges.find(
    e => e.source === initialNodeId && e.target === targetNodeId
  );
};

/**
 * Gets all edges originating from the initial node
 */
export const getInitialNodeConnections = (
  edges: Edge[],
  initialNodeId: string
): Edge[] => {
  return edges.filter(e => e.source === initialNodeId);
};
