import { CommandContext } from "@commands/interfaces/command.event";

/**
 * Los tipos de menus contextuales soportados por la aplicacion
 */
export type TypeContextMenu = "Node" | "Edge";
/**
 * El contexto del eventos que se dispara desde el menu contextual, al seleccionar una accion
 */
export interface MenuActionEventContext<T = any> extends CommandContext<T> {}

/**
 * El contexto del menu contextual, que se muestra al hacer click derecho sobre un nodo o arista
 */
export interface ContextMenuAction {
  icon?: JSX.Element; // icono que se muestra en el menu contextual
  title: string;
  commandId?: string; // ID del comando a ejecutar (si no se desee, se puede utilizar la propiedad action directamente)
  show?: (context: MenuActionEventContext) => boolean;
  action?: (context: MenuActionEventContext<any>) => void;
}
