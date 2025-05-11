import { CommandHandler } from "../interfaces/command.interfaces";
import { v4 as uuidv4 } from "uuid";
import { CommandContext } from "../interfaces/command.event";
import { AppNode } from "../../../nodes/types";
import { sendMessage } from "@core/services/message.service";
import { EventFlowTypes } from "@core/types/message";
import { addEdge, Edge } from "@xyflow/react";

export const generateDefaultNode = (id?: string): AppNode => {
  return {
    id: id || uuidv4(),
    type: "default",
    position: { x: Math.random() * 100, y: Math.random() * 100 },
    data: { label: `Node ${id}` },
  };
};

/**
 * Indica que se desea crear un nodo desde el flujo de eventos
 * o si no se usa el por defecto (el que se implemento en react)
 */
export const createNodeCommand: CommandHandler = (context) => {
  if (context.appStore.config.customNodeCreate) {
    sendMessage({
      type: EventFlowTypes.CREATE_NODE,
      payload: generateDefaultNode(),
    });
    return false;
  } else {
    return true;
  }
};

export const AddNodeCommand: CommandHandler = (
  context: CommandContext<AppNode>
) => {
  console.info("[GRAPH] AddNodeCommand", context);
  context.state.setNodes((current) => [...current, context.object]);
};

export const addEdgeCommand: CommandHandler = (
  context: CommandContext<Edge>
) => {
  console.info("[GRAPH] AddEdgeCommand", context);
  context.state.setEdges((edges) => {
    if (edges.some((ed) => ed.id === context.object.id)) {
      return [...edges, context.object];
    }
    return addEdge(context.object, edges);
  });
};
