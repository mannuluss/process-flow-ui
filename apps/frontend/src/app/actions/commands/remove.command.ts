import { sendMessage } from '@core/services/message.service';
import { EventFlowTypes } from '@core/types/message';
import { Edge } from '@xyflow/react';
import { MenuActionEventContext } from 'src/app/components/menuContext/interface/contextActionEvent';
import { AppNode } from 'src/app/customs/nodes/types';
import { isInitialNodeType } from 'src/core/utils/workflow';

export function removeEdgeCommand(context: MenuActionEventContext<Edge>) {
  console.info('[GRAPH] removeEdgeCommand', context);
  const newedges = context.state
    .getEdges()
    .filter(e => e.id !== context.object.id);
  context.state.setEdges(newedges);
  sendMessage({ type: EventFlowTypes.DELETE_EDGE, payload: context.object });
}

export function RemoveNodeCommand(context: MenuActionEventContext<AppNode>) {
  console.info('[GRAPH] removeNodeCommand', context);

  // No permitir eliminar el nodo initial
  if (isInitialNodeType(context.object)) {
    console.warn('El nodo inicial no puede ser eliminado');
    return;
  }

  const newnodes = context.state
    .getNodes()
    .filter(n => n.id !== context.object.id);
  const newedges = context.state
    .getEdges()
    .filter(
      e => e.source !== context.object.id && e.target !== context.object.id
    );
  context.state.setNodes(newnodes);
  context.state.setEdges(newedges);
}
