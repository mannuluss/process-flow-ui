import { Edge, ReactFlowInstance } from "@xyflow/react";
import { AppNode } from "../../../nodes/types";
import { RootState } from "src/store/store";

/**
 * Los tipos de menus contextuales soportados por la aplicacion
 */
export type TypeContextMenu = "Node" | "Edge" | "Graph";

export interface CommandContext<T = any> {
  type: TypeContextMenu;
  state: ReactFlowInstance<AppNode, Edge>;
  object: T;
  appStore: RootState;
}
