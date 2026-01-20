import { sendMessage } from '@core/services/message.service';
import { EventFlowTypes, GraphData } from '@core/types/message';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { AppNode } from 'src/app/customs/nodes/types';
import {
  findInitialNode,
  hasConnectionFromInitial,
  isInitialNodeType,
} from 'src/core/utils/workflow';

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
  title: 'Conectar desde inicio',
  show: (context: MenuActionEventContext<AppNode>) => {
    // No mostrar para nodos de tipo initial
    if (context.object && isInitialNodeType(context.object)) return false;
    // Verificar si ya existe conexión desde initial
    const initialNode = findInitialNode(context.state?.getNodes());
    if (!initialNode) return true;
    return !hasConnectionFromInitial(
      context.state?.getEdges() || [],
      initialNode.id,
      context.object?.id || ''
    );
  },
  commandId: 'setInitialNode',
};

export const ActionResetInitialNode: ContextMenuAction = {
  title: 'Desconectar del inicio',
  icon: <LinkOffIcon fontSize="small" />,
  show: (context: MenuActionEventContext<AppNode>) => {
    // No mostrar para nodos de tipo initial
    if (context.object && isInitialNodeType(context.object)) return false;
    // Verificar si existe conexión desde initial
    const initialNode = findInitialNode(context.state?.getNodes() || []);
    if (!initialNode) return false;
    return hasConnectionFromInitial(
      context.state?.getEdges() || [],
      initialNode.id,
      context.object?.id || ''
    );
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
    // No permitir eliminar nodo initial
    show: context => !context.object || !isInitialNodeType(context.object),
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
      context.state.setEdges(example.edges);
    },
  },
];

export const ActionsToolbar: ContextMenuAction[] = [
  ActionAddNode,
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
