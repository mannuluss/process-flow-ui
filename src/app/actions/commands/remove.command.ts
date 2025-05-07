import { Edge } from "@xyflow/react";
import { sendMessage } from "src/core/services/message.service";
import { EventFlowTypes } from "src/core/types/message";
import { AppNode } from "src/nodes/types";
import { MenuActionEvent } from "src/components/menuContext/interface/contextActionEvent";

export function removeEdgeCommand(context: MenuActionEvent<Edge>) {
  console.info("[GRAPH] removeEdgeCommand", context);
  const newedges = context.state
    .getEdges()
    .filter((e) => e.id !== context.object.id);
  context.state.setEdges(newedges);
  sendMessage({ type: EventFlowTypes.DELETE_EDGE, payload: context.object });
}

export function RemoveNodeCommand(context: MenuActionEvent<AppNode>) {
  console.info("[GRAPH] removeNodeCommand", context);
  const newnodes = context.state
    .getNodes()
    .filter((n) => n.id !== context.object.id);
  const newedges = context.state
    .getEdges()
    .filter(
      (e) => e.source !== context.object.id && e.target !== context.object.id
    );
  context.state.setNodes(newnodes);
  context.state.setEdges(newedges);
}
