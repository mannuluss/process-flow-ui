import { AddNodeCommand } from "./commands/add.node.command.ts";
import { RemoveNodeCommand } from "./commands/remove.command.ts";
import SaveCommand from "./commands/save.command.ts";
import commandManager from "./manager/command.manager.ts";

/**
 * Proveedor para registrar todos los comandos de la aplicación..
 */
export function registerCommands(): void {

  // Registrar los comandos con IDs únicos;
  commandManager.registerCommand("addNode", AddNodeCommand);
  commandManager.registerCommand("removeNode", RemoveNodeCommand);
  commandManager.registerCommand("createNode", AddNodeCommand);
  commandManager.registerCommand("saveGraph", SaveCommand);

  console.debug(
    "Commands registered:",
    commandManager.getRegisteredCommandIds()
  );
}
