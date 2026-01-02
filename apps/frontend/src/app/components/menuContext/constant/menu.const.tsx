import { sendMessage } from '@core/services/message.service';
import { EventFlowTypes, GraphData } from '@core/types/message';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { CustomNodeApp } from 'src/app/customs/nodes/types';

import {
  ContextMenuAction,
  MenuActionEventContext,
  TypeContextMenu,
} from '../interface/contextActionEvent';

const ActionAddNode: ContextMenuAction = {
  title: 'Agregar nodo',
  icon: <AddIcon />,
  commandId: 'createNode',
};

const ActionEditNode: ContextMenuAction = {
  title: 'Editar nodo',
  icon: <EditIcon fontSize="small" />,
  commandId: 'editNode',
  show: context => (context.appStore.selection?.selectedNode ? true : false),
};

const ActionRemoveNode: ContextMenuAction = {
  title: 'Eliminar nodo',
  icon: <DeleteIcon fontSize="small" />,
  commandId: 'removeNode',
  show: context => (context.appStore.selection?.selectedNode ? true : false),
};

const ActionEditEdge: ContextMenuAction = {
  title: 'Editar conexión',
  icon: <EditIcon fontSize="small" />,
  commandId: 'editEdge',
  show: context => (context.appStore.selection?.selectedEdge ? true : false),
};

const ActionRemoveEdge: ContextMenuAction = {
  title: 'Eliminar conexión',
  icon: <DeleteIcon fontSize="small" />,
  commandId: 'removeEdge',
  show: context => (context.appStore.selection?.selectedEdge ? true : false),
};

export const ActionsMenuEdge: ContextMenuAction[] = [
  { ...ActionEditEdge, show: () => true },
  { ...ActionRemoveEdge, show: () => true },
];

export const ActionMakeInitialNode: ContextMenuAction = {
  icon: <PlayCircleOutlineIcon fontSize="small" />,
  title: 'Marcar como inicial',
  show: (context: MenuActionEventContext<CustomNodeApp>) => {
    return context.object ? !context.object?.data?.initial : false;
  },
  commandId: 'setInitialNode',
};

export const ActionResetInitialNode: ContextMenuAction = {
  title: 'Desmarcar como inicial',
  icon: <AutorenewIcon fontSize="small" />,
  show: (context: MenuActionEventContext<CustomNodeApp>) => {
    return context.object?.data?.initial;
  },
  commandId: 'unSetInitialNode',
};

export const ActionsMenuNode: ContextMenuAction[] = [
  ActionMakeInitialNode,
  ActionResetInitialNode,
  {
    title: 'Editar nodo',
    icon: <EditIcon fontSize="small" />,
    action: context => {
      //se le informa al padre que se va a editar un nodo.
      sendMessage({
        type: EventFlowTypes.UPDATE_NODE,
        payload: context.object,
      });
    },
  },
  {
    title: 'Eliminar nodo',
    icon: <DeleteIcon fontSize="small" />,
    commandId: 'removeNode',
  },
];

/**
 * Configuracion del menu del panel de acciones.
 */
export const ActionsMenuWindow: ContextMenuAction[] = [
  ActionAddNode,
  ActionEditNode,
  ActionRemoveNode,
  ActionEditEdge,
  ActionRemoveEdge,
  {
    title: 'Cargar ejemplo',
    icon: <InsertDriveFileIcon fontSize="small" />,
    action: async context => {
      const example: GraphData = await (
        await fetch('public/example-config.json')
      ).json();
      //se le informa al padre que se va a editar un nodo.
      context.state.setNodes(example.nodes);
      context.state.setEdges(example.connections);
    },
  },
];

export const ActionsToolbar: ContextMenuAction[] = [
  ActionEditNode,
  ActionEditEdge,
  ActionRemoveNode,
  ActionRemoveEdge,
  ActionMakeInitialNode,
  ActionResetInitialNode,
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
