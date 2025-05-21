import { removeEdgeCommand } from "@commands/commands/remove.command";
import { sendMessage } from "@core/services/message.service";
import { EventFlowTypes } from "@core/types/message";
import {
  ContextMenuAction,
  MenuActionEventContext,
  TypeContextMenu,
} from "../interface/contextActionEvent";
import { CustomNodeStart } from "src/nodes/types";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const ActionsMenuEdge: ContextMenuAction[] = [
  {
    title: "Editar conexión",
    icon: <EditIcon fontSize="small" />,
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
    icon: <DeleteIcon fontSize="small" />,
    show: () => true,
    action: removeEdgeCommand,
  },
];
export const ActionsMenuNode: ContextMenuAction[] = [
  {
    icon: <PlayCircleOutlineIcon fontSize="small" />,
    title: "Marcar como inicial",
    show: (context: MenuActionEventContext<CustomNodeStart>) => {
      return !context.object?.data?.initial;
    },
    commandId: "setInitialNode",
  },
  {
    title: "Desmarcar como inicial",
    show: (context: MenuActionEventContext<CustomNodeStart>) => {
      return context.object?.data?.initial;
    },
    commandId: "unSetInitialNode",
  },
  {
    title: "Editar nodo",
    icon: <EditIcon fontSize="small" />,
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
    icon: <DeleteIcon fontSize="small" />,
    commandId: "removeNode",
  },
];

/**
 * Configuracion del menu del panel de acciones.
 */
export const ActionsMenuWindow: ContextMenuAction[] = [
  {
    title: "Agregar nodo",
    commandId: "createNode",
  },
  {
    title: "Editar nodo",
    icon: <EditIcon fontSize="small" />,
    commandId: "editNode",
    show: (context) =>
      context.appStore.selection?.selectedNode ? true : false,
  },
  {
    title: "Eliminar nodo",
    icon: <DeleteIcon fontSize="small" />,
    commandId: "removeNode",
    show: (context) =>
      context.appStore.selection?.selectedNode ? true : false,
  },
  {
    title: "Editar conexión",
    icon: <EditIcon fontSize="small" />,
    commandId: "editEdge",
    show: (context) =>
      context.appStore.selection?.selectedEdge ? true : false,
  },
  {
    title: "Eliminar conexión",
    icon: <DeleteIcon fontSize="small" />,
    commandId: "removeEdge",
    show: (context) =>
      context.appStore.selection?.selectedEdge ? true : false,
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
