import { Edge } from "reactflow";
import { AppNode } from "../nodes/types";
import { EventFlowTypes } from "../events/manage.event";

/**
 * Cuando se guarda el grafo, se envia un mensaje al padre para que se entere de que se ejecuto el comando
 * de guardar el grafo.
 */
export default function saveGraphCommand(
  nodes: AppNode[],
  edges: Edge[],
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  // setLoading(true);
  const data = {
    nodes: nodes,
    conections: edges,
  };
  console.info("[GRAPH] saveGraphCommand", data);
  window.top?.postMessage({
    type: EventFlowTypes.SAVE_GRAPH,
    data: data,
  }, "*"
  );
}
