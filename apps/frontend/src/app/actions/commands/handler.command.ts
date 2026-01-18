import type { NodeHandler } from '@process-flow/common';
import { v4 as uuidv4 } from 'uuid';

import type { AppNode } from '../../customs/nodes/types';
import { CommandContext } from '../interfaces/command.event';
import { CommandHandler } from '../interfaces/command.interfaces';
import { store } from 'src/store/store';
import { openSidePanel } from 'src/store/sidePanelSlice';

/**
 * Context for handler-specific commands
 */
export interface HandlerCommandContext {
  nodeId: string;
  handlerId?: string;
  handler?: NodeHandler;
}

/**
 * Helper to safely get handlers from node data
 */
const getNodeHandlers = (node: AppNode): NodeHandler[] => {
  return (node.data as { handlers?: NodeHandler[] }).handlers || [];
};

/**
 * Creates a new empty handler and adds it to the node.
 */
export const addHandlerCommand: CommandHandler = (
  context: CommandContext<HandlerCommandContext>
) => {
  const { nodeId } = context.object;
  if (!nodeId) {
    console.error('addHandlerCommand: nodeId is required');
    return false;
  }

  const newHandler: NodeHandler = {
    id: uuidv4(),
    trigger: '',
    rules: [],
  };

  context.state.setNodes(nodes =>
    nodes.map(node => {
      if (node.id === nodeId) {
        const currentHandlers = getNodeHandlers(node as AppNode);
        return {
          ...node,
          data: {
            ...node.data,
            handlers: [...currentHandlers, newHandler],
          },
        } as AppNode;
      }
      return node;
    })
  );

  return true;
};

/**
 * Opens the side panel to edit a specific handler.
 */
export const editHandlerCommand: CommandHandler = (
  context: CommandContext<HandlerCommandContext>
) => {
  const { nodeId, handlerId } = context.object;
  if (!nodeId || !handlerId) {
    console.error('editHandlerCommand: nodeId and handlerId are required');
    return false;
  }

  // Find the node and handler
  const nodes = context.state.getNodes();
  const node = nodes.find(n => n.id === nodeId) as AppNode | undefined;
  if (!node) {
    console.error('editHandlerCommand: node not found');
    return false;
  }

  const handlers = getNodeHandlers(node);
  const handler = handlers.find(h => h.id === handlerId);
  if (!handler) {
    console.error('editHandlerCommand: handler not found');
    return false;
  }

  // Open side panel with handler context
  store.dispatch(
    openSidePanel({
      type: 'handler',
      nodeId,
      handlerId,
      handler,
    })
  );

  return true;
};

/**
 * Updates a handler's data within a node.
 */
export const updateHandlerCommand: CommandHandler = (
  context: CommandContext<HandlerCommandContext>
) => {
  const { nodeId, handlerId, handler } = context.object;
  if (!nodeId || !handlerId || !handler) {
    console.error(
      'updateHandlerCommand: nodeId, handlerId, and handler are required'
    );
    return false;
  }

  context.state.setNodes(nodes =>
    nodes.map(node => {
      if (node.id === nodeId) {
        const currentHandlers = getNodeHandlers(node as AppNode);
        const updatedHandlers = currentHandlers.map(h =>
          h.id === handlerId ? { ...h, ...handler } : h
        );
        return {
          ...node,
          data: {
            ...node.data,
            handlers: updatedHandlers,
          },
        } as AppNode;
      }
      return node;
    })
  );

  return true;
};

/**
 * Removes a handler from a node.
 * Also removes any edges that use this handler as sourceHandle.
 */
export const removeHandlerCommand: CommandHandler = (
  context: CommandContext<HandlerCommandContext>
) => {
  const { nodeId, handlerId } = context.object;
  if (!nodeId || !handlerId) {
    console.error('removeHandlerCommand: nodeId and handlerId are required');
    return false;
  }

  // Remove handler from node
  context.state.setNodes(nodes =>
    nodes.map(node => {
      if (node.id === nodeId) {
        const currentHandlers = getNodeHandlers(node as AppNode);
        return {
          ...node,
          data: {
            ...node.data,
            handlers: currentHandlers.filter(h => h.id !== handlerId),
          },
        } as AppNode;
      }
      return node;
    })
  );

  // Remove edges that use this handler
  context.state.setEdges(edges =>
    edges.filter(
      edge => !(edge.source === nodeId && edge.sourceHandle === handlerId)
    )
  );

  return true;
};
