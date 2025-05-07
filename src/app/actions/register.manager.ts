import { addEdgeCommand, AddNodeCommand, createNodeCommand } from "./commands/add.node.command.ts";
import { RemoveNodeCommand } from "./commands/remove.command.ts";
import SaveCommand from "./commands/save.command.ts";
import commandManager from "./manager/command.manager.ts";

/**
 * Proveedor para registrar todos los comandos de la aplicación..
 */
export function registerCommands(): void {

  // Registrar los comandos con IDs únicos;
  commandManager.registerCommand("createNode", createNodeCommand);
  commandManager.registerCommand("addNode", AddNodeCommand);
  commandManager.registerCommand("removeNode", RemoveNodeCommand);//todo probar
  
  commandManager.registerCommand("addEdge", addEdgeCommand);
  commandManager.registerCommand("saveGraph", SaveCommand);

  console.debug(
    "Commands registered:",
    commandManager.getRegisteredCommandIds()
  );
}
