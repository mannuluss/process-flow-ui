import { removeEdgeCommand } from "@commands/commands/remove.command";
import { sendMessage } from "../../../core/services/message.service";
import { EventFlowTypes } from "../../../core/types/message";
import {
  ContextMenuAction,
  TypeContextMenu,
} from "../interface/contextActionEvent";

export const ActionsMenuEdge: ContextMenuAction[] = [
  {
    title: "Editar conexión",
    show: () => true,
    action: (context) => {
      //se le informa al padre que se va a editar un nodo.
      sendMessage({
        type: EventFlowTypes.UPDATE_EDGE,
        payload: context.object,
      });
    },
  },
  {
    title: "Eliminar conexión",
    show: () => true,
    action: removeEdgeCommand,
  },
];
export const ActionsMenuNode: ContextMenuAction[] = [
  {
    title: "Editar nodo",
    show: () => true,
    action: (context) => {
      //se le informa al padre que se va a editar un nodo.
      sendMessage({
        type: EventFlowTypes.UPDATE_NODE,
        payload: context.object,
      });
    },
  },
  {
    title: "Eliminar nodo",
    show: () => true,
    commandId: "removeNode",
  },
];

export const ActionsMenuWindow: ContextMenuAction[] = [
  {
    title: "Agregar nodo",
    commandId: "createNode",
  },
];

/**
 * Configuracion de los menus contextuales por tipo de objeto, como nodo o arista
 */
export const ContextMenuActionByType: {
  [key in TypeContextMenu]: ContextMenuAction[];
} = {
  Node: ActionsMenuNode,
  Edge: ActionsMenuEdge,
};
