import { CommandContext } from "@commands/interfaces/command.event";

/**
 * Los tipos de menus contextuales soportados por la aplicacion
 */
export type TypeContextMenu = "Node" | "Edge";
/**
 * El contexto del eventos que se dispara desde el menu contextual, al seleccionar una accion
 */
export interface MenuActionEvent<T = any> extends CommandContext<T> {
  object: T;
}

/**
 * El contexto del menu contextual, que se muestra al hacer click derecho sobre un nodo o arista
 */
export interface ContextMenuAction {
  title: string;
  commandId?: string; // ID del comando a ejecutar (si no se desee, se puede utilizar la propiedad action directamente)
  show?: () => boolean;
  action?: (context: MenuActionEvent<any>) => void;
}