import { Edge } from "@xyflow/react";
import { AppNode } from "../nodes/types";
import { EventFlowTypes } from "../core/types/message";
import { sendMessage } from "../core/services/message.service";

/**
 * Cuando se guarda el grafo, se envia un mensaje al padre para que se entere de que se ejecuto el comando
 * de guardar el grafo.
 */
export default function saveGraphCommand(
  nodes: AppNode[],
  edges: Edge[]
) {
  // setLoading(true);
  const data = {
    nodes: nodes,
    conections: edges,
  };
  console.info("[GRAPH] saveGraphCommand", data);
  sendMessage(EventFlowTypes.SAVE_GRAPH, data);
}
