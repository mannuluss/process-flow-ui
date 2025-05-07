import { sendMessage } from "src/core/services/message.service";
import { EventFlowTypes } from "src/core/types/message";

/**
 * Cuando se guarda el grafo, se envia un mensaje al padre para que se entere de que se ejecuto el comando
 * de guardar el grafo.
 */
export default function SaveCommand(context) {
  // setLoading(true);
  const data = {
    nodes: context.object.nodes,
    conections: context.object.edges,
  };
  console.info("[GRAPH] SaveCommand", data);
  sendMessage({ type: EventFlowTypes.SAVE_GRAPH, payload: data });
}
