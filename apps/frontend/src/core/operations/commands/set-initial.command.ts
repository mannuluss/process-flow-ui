import { v4 as uuidv4 } from 'uuid';
import { CommandHandler } from '@commands/interfaces/command.interfaces';
import { sendMessage } from '@core/services/message.service';
import { EventFlowTypes } from '@core/types/message';
import { MenuActionEventContext } from 'src/app/components/menuContext/interface/contextActionEvent';
import { AppNode } from '../../designer/types';
import { findInitialNode, findEdgeFromInitial } from '../../utils/workflow';

/**
 * Comando para conectar un nodo al nodo initial.
 * Crea un handler en el nodo initial y un edge hacia el nodo seleccionado.
 */
export const setInitialNodeCommand: CommandHandler<
  MenuActionEventContext<AppNode>
> = evt => {
  const nodes = evt.state.getNodes();
  const targetNode = evt.object;

  // Buscar el nodo initial
  const initialNode = findInitialNode(nodes);

  if (!initialNode) {
    console.warn('No se encontró el nodo initial en el flujo');
    return;
  }

  // Verificar si ya existe una conexión hacia este nodo desde initial
  const edges = evt.state.getEdges();
  const existingEdge = findEdgeFromInitial(
    edges,
    initialNode.id,
    targetNode.id
  );

  if (existingEdge) {
    console.warn('Ya existe una conexión desde initial hacia este nodo');
    return;
  }

  // Crear un nuevo handler en el nodo initial
  const handlerId = uuidv4();
  const targetLabel =
    (targetNode.data as { label?: string })?.label || targetNode.id;
  const newHandler = {
    id: handlerId,
    name: `Ir a ${targetLabel}`,
    trigger: null,
    rules: [],
  };

  // Actualizar el nodo initial con el nuevo handler
  const updatedInitialNode = {
    ...initialNode,
    data: {
      ...initialNode.data,
      handlers: [...(initialNode.data?.handlers || []), newHandler],
    },
  };
  evt.state.updateNode(initialNode.id, updatedInitialNode);

  // Crear el edge desde el handler hacia el nodo target
  const newEdge = {
    id: `e-${initialNode.id}-${handlerId}-${targetNode.id}`,
    source: initialNode.id,
    sourceHandle: handlerId,
    target: targetNode.id,
  };
  evt.state.addEdges([newEdge]);

  sendMessage({
    type: EventFlowTypes.ALL_DATA,
    payload: {
      nodes: evt.state.getNodes(),
      edges: evt.state.getEdges(),
    },
  });
};

/**
 * Comando para desconectar un nodo del nodo initial.
 * Elimina el edge y el handler correspondiente.
 */
export const unSetInitialNodeCommand: CommandHandler<
  MenuActionEventContext<AppNode>
> = evt => {
  const nodes = evt.state.getNodes();
  const targetNode = evt.object;

  // Buscar el nodo initial
  const initialNode = findInitialNode(nodes);

  if (!initialNode) {
    return;
  }

  // Buscar el edge que conecta initial -> targetNode
  const edges = evt.state.getEdges();
  const edgeToRemove = findEdgeFromInitial(
    edges,
    initialNode.id,
    targetNode.id
  );

  if (!edgeToRemove) {
    return;
  }

  // Eliminar el handler correspondiente del nodo initial
  const handlersAfterRemoval = (initialNode.data?.handlers || []).filter(
    h => h.id !== edgeToRemove.sourceHandle
  );

  const updatedInitialNode = {
    ...initialNode,
    data: {
      ...initialNode.data,
      handlers: handlersAfterRemoval,
    },
  };
  evt.state.updateNode(initialNode.id, updatedInitialNode);

  // Eliminar el edge
  evt.state.deleteElements({ edges: [{ id: edgeToRemove.id }] });

  sendMessage({
    type: EventFlowTypes.ALL_DATA,
    payload: {
      nodes: evt.state.getNodes(),
      edges: evt.state.getEdges(),
    },
  });
};
