import {
  addEdgeCommand,
  AddNodeCommand,
  createNodeCommand,
  updateEdgeCommand,
  updateNodeCommand,
} from "./commands/add.node.command.ts";
import {
  removeEdgeCommand,
  RemoveNodeCommand,
} from "./commands/remove.command.ts";
import SaveCommand from "./commands/save.command.ts";
import {
  setInitialNodeCommand,
  unSetInitialNodeCommand,
} from "./commands/set-initial.command.ts";
import commandManager from "./manager/command.manager.ts";

/**
 * Proveedor para registrar todos los comandos de la aplicación..
 */
export function registerCommands(): void {
  // Registrar los comandos con IDs únicos;
  commandManager.registerCommand("createNode", createNodeCommand);
  commandManager.registerCommand("addNode", AddNodeCommand);
  commandManager.registerCommand("editNode", updateNodeCommand);
  commandManager.registerCommand("removeNode", RemoveNodeCommand);

  commandManager.registerCommand("addEdge", addEdgeCommand);
  commandManager.registerCommand("editEdge", updateEdgeCommand);
  commandManager.registerCommand("removeEdge", removeEdgeCommand);

  commandManager.registerCommand("saveGraph", SaveCommand);
  commandManager.registerCommand("setInitialNode", setInitialNodeCommand);
  commandManager.registerCommand("unSetInitialNode", unSetInitialNodeCommand);

  console.debug(
    "Commands registered:",
    commandManager.getRegisteredCommandIds()
  );
}
