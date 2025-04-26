import { Edge, ReactFlowInstance } from "@xyflow/react";
import { AppNode } from "../../../nodes/types";

/**
 * Los tipos de menus contextuales soportados por la aplicacion
 */
export type TypeContextMenu = "Node" | "Edge";
/**
 * El contexto del eventos que se dispara desde el menu contextual, al seleccionar una accion
 */
export interface MenuActionEvent<T = any> {
  type: TypeContextMenu;
  state: ReactFlowInstance<AppNode, Edge>;
  object: T;
}
