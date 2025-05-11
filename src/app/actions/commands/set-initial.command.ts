import { CommandHandler } from "@commands/interfaces/command.interfaces";
import { sendMessage } from "@core/services/message.service";
import { EventFlowTypes } from "@core/types/message";
import { MenuActionEventContext } from "src/app/components/menuContext/interface/contextActionEvent";
import { CustomNodeStart } from "src/nodes/types";

// const strategyInitialNodeOnlyOne = (nodes, evt) => {
//   return nodes.map((n) => {
//     if (n.id !== evt.object.id) {
//       return { ...n, type: "default", initial: false } as any;
//     }
//     return n;
//   });
// };

export const setInitialNodeCommand: CommandHandler<
  MenuActionEventContext<CustomNodeStart>
> = (evt) => {
  //esto para evitar el error de que no se puede modificar el objeto porque es de solo lectura (freeze)
  const node = JSON.parse(JSON.stringify(evt.object)) as CustomNodeStart;
  node.type = "start";
  node.data.initial = true;

  evt.state.updateNode(evt.object.id, node);
  //evt.state.setNodes((nds) => strategyInitialNodeOnlyOne(nds, evt));
  sendMessage({
    type: EventFlowTypes.ALL_NODES,
    payload: evt.state.getNodes(),
  });
};

export const unSetInitialNodeCommand: CommandHandler<
  MenuActionEventContext<CustomNodeStart>
> = (evt) => {
  //esto para evitar el error de que no se puede modificar el objeto porque es de solo lectura (freeze)
  const node = JSON.parse(JSON.stringify(evt.object)) as any;
  node.type = "default";
  node.data.initial = false;

  evt.state.updateNode(evt.object.id, node);
  //evt.state.setNodes((nds) => strategyInitialNodeOnlyOne(nds, evt));
  sendMessage({
    type: EventFlowTypes.ALL_NODES,
    payload: evt.state.getNodes(),
  });
};
