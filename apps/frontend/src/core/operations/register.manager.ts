import {
  addEdgeCommand,
  AddNodeCommand,
  createNodeCommand,
  updateNodeCommand,
  openEditNodeCommand,
} from './commands/add.node.command.ts';
import {
  addHandlerCommand,
  editHandlerCommand,
  removeHandlerCommand,
  updateHandlerCommand,
} from './commands/handler.command.ts';
import { loadDataCommand } from './commands/load.config.command.ts';
import {
  removeEdgeCommand,
  RemoveNodeCommand,
} from './commands/remove.command.ts';
import SaveCommand from './commands/save.command.ts';
import {
  setInitialNodeCommand,
  unSetInitialNodeCommand,
} from './commands/set-initial.command.ts';
import commandManager from './command.manager.ts';

//TODO: estos actualmente son solo los comandos del designer, por lo que se debe crear otro manager para los comandos de la aplicacion y mover este a la carpeta de commands/designer
/**
 * Proveedor para registrar todos los comandos de la aplicación..
 */
export function registerCommands(): void {
  // Registrar los comandos con IDs únicos;
  commandManager.registerCommand('loadData', loadDataCommand);

  commandManager.registerCommand('createNode', createNodeCommand);
  commandManager.registerCommand('addNode', AddNodeCommand);
  // 'editNode' abre el panel lateral; 'updateNode' aplica los cambios al grafo
  commandManager.registerCommand('editNode', openEditNodeCommand);
  commandManager.registerCommand('updateNode', updateNodeCommand);
  commandManager.registerCommand('removeNode', RemoveNodeCommand);

  commandManager.registerCommand('addEdge', addEdgeCommand);
  commandManager.registerCommand('removeEdge', removeEdgeCommand);

  // Handler commands
  commandManager.registerCommand('addHandler', addHandlerCommand);
  commandManager.registerCommand('editHandler', editHandlerCommand);
  commandManager.registerCommand('updateHandler', updateHandlerCommand);
  commandManager.registerCommand('removeHandler', removeHandlerCommand);

  commandManager.registerCommand('saveGraph', SaveCommand);
  commandManager.registerCommand('setInitialNode', setInitialNodeCommand);
  commandManager.registerCommand('unSetInitialNode', unSetInitialNodeCommand);

  console.debug(
    'Commands registered:',
    commandManager.getRegisteredCommandIds()
  );
}
