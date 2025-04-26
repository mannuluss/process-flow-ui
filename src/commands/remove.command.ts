import { Edge } from "@xyflow/react";
import { MenuActionEvent } from "../components/menuContext/interface/contextActionEvent";

export function removeEdgeCommand(context: MenuActionEvent<Edge>) {
  console.info("[GRAPH] removeEdgeCommand", context);
  const newedges = context.state
    .getEdges()
    .filter((e) => e.id !== context.object.id);
  context.state.setEdges(newedges);
  //   window.top?.postMessage({
  //     type: "PROCESS_FLOW.REMOVE_EDGE",
  //     data: data,
  //   });
}

export function removeNodeCommand(context: MenuActionEvent) {
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
