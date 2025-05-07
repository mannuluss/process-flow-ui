import { CommandHandler } from "../interfaces/command.interfaces";
import { v4 as uuidv4 } from "uuid";
import { CommandContext } from "../interfaces/command.event";
import { AppNode } from "../../../nodes/types";
import { sendMessage } from "src/core/services/message.service";
import { EventFlowTypes } from "src/core/types/message";

export const generateDefaultNode = (id?: string): AppNode => {
  return {
    id: id || uuidv4(),
    type: "default",
    position: { x: Math.random() * 100, y: Math.random() * 100 },
    data: { label: `Node ${id}` },
  };
};

export const AddNodeCommand: CommandHandler = (
  context: CommandContext<Node>
) => {
  console.info("[GRAPH] AddNodeCommand", context);
  const newNode = generateDefaultNode();
  console.log("agregando un nodo", newNode, context);
  if (context.appStore?.config?.customNodeCreate) {
    sendMessage({ type: EventFlowTypes.ADD_NODE, payload: newNode });
  } else {
    context.state.setNodes((current) => [...current, newNode]);
  }
};
