import { sendMessage } from '@core/services/message.service';
import { EventFlowTypes } from '@core/types/message';
import { addEdge, Edge, ReactFlowInstance } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

import { AppNode } from '../../designer/types';
import { CommandContext } from '../interfaces/command.event';
import { CommandHandler } from '../interfaces/command.interfaces';
import { store } from 'src/store/store';
import { openSidePanel } from 'src/store/sidePanelSlice';

export const generateDefaultNode = (
  type: any = 'proceso',
  state: ReactFlowInstance<AppNode, Edge>
): AppNode => {
  console.log('generateDefaultNode: generating node of type', type);
  return {
    id: uuidv4(),
    type: type,
    position: state.screenToFlowPosition({
      x: document.getElementById('root').clientWidth / 2,
      y: document.getElementById('root').clientHeight / 2,
    }),
    data: { label: `Node new` },
  };
};

/**
 * Indica que se desea crear un nodo desde el flujo de eventos
 * se usa el por defecto (el que se implemento en react)
 */
export const createNodeCommand: CommandHandler = (
  context: CommandContext<AppNode>
) => {
  const node = generateDefaultNode(
    context.appStore.config.defaultTypeNode,
    context.state
  );

  // Añadir el nodo al estado local de React Flow
  context.state.setNodes(current => [...current, node]);

  // Mantener el envío del mensaje para compatibilidad con integraciones externas
  sendMessage({ type: EventFlowTypes.CREATE_NODE, payload: node });

  // Indica que el comando creo el nodo sin problemas
  return true;
};

/**
 * Abre el panel lateral para editar el nodo (no reutiliza el slice `selection`).
 * Este comando solo coloca el payload en el store para que el panel lo consuma.
 */
export const openEditNodeCommand: CommandHandler = (
  context: CommandContext<AppNode>
) => {
  try {
    store.dispatch(openSidePanel(context.object));
  } catch (e) {
    console.error('openEditNodeCommand: failed to open side panel', e);
  }
  return false;
};

export const updateNodeCommand: CommandHandler = (
  context: CommandContext<AppNode>
) => {
  const node = context.object ?? context.appStore.selection?.selectedNode;
  if (!node) return;

  // Actualizar nodo en React Flow (estado local)
  context.state.setNodes(nodes =>
    nodes.map(n => (n.id === node.id ? node : n))
  );

  // Mantener el envío del mensaje para integraciones externas
  sendMessage({ type: EventFlowTypes.UPDATE_NODE, payload: node });
};

/**
 * Es llamado cuando se desea crear un nodo en el grafo.
 */
export const AddNodeCommand: CommandHandler = (
  context: CommandContext<AppNode>
) => {
  context.state.setNodes(current => [...current, context.object]);
};

export const addEdgeCommand: CommandHandler = (
  context: CommandContext<Edge>
) => {
  context.state.setEdges(edges => {
    if (edges.some(ed => ed.id === context.object.id)) {
      return [...edges, context.object];
    }
    return addEdge(context.object, edges);
  });
};
