import { CommandContext } from '@commands/interfaces/command.event';
import { ICommand, ICommandRegistry, CommandHandler } from '../interfaces/command.interfaces';

/**
 * Gestor centralizado para registrar y ejecutar comandos.
 * Implementa la interfaz ICommandRegistry.
 */
export class CommandManager implements ICommandRegistry {
  private commands = new Map<string, ICommand<any, any> | CommandHandler<any, any>>();

  /**
   * Registra un comando en el gestor.
   * Si ya existe un comando con el mismo ID, se sobrescribirá y se mostrará una advertencia en la consola.
   * @param commandId - El identificador único del comando. Debe ser proporcionado.
   * @param command - La instancia del comando a registrar.
   */
  registerCommand(commandId: string, command: ICommand<any, any> | CommandHandler<any, any>): void {
    if (!commandId) {
      console.error('Command registration failed: commandId is required.');
      return;
    }
    if (this.commands.has(commandId)) {
      console.warn(`CommandManager: Command with ID "${commandId}" already registered. Overwriting.`);
    }
    this.commands.set(commandId, command);
    console.log(`Command registered: ${commandId}`);
  }

  /**
   * Obtiene un comando registrado por su ID.
   * @param commandId - El identificador único del comando.
   * @returns La instancia del comando o `undefined` si no se encuentra.
   */
  getCommand(commandId: string): ICommand<any, any> | CommandHandler<any, any> | undefined {
    return this.commands.get(commandId);
  }

  /**
   * Ejecuta un comando registrado por su ID, si es posible.
   * Verifica si el comando existe y si `canExecute` (si está implementado) devuelve `true`.
   * @param commandId - El identificador único del comando.
   * @param args - Los argumentos para la ejecución del comando.
   * @returns El resultado de la ejecución del comando o `undefined` si el comando no existe o no puede ejecutarse.
   */
  executeCommand<TArgs = CommandContext, TResult = void>(commandId: string, args?: TArgs): TResult | undefined {
    const command = this.getCommand(commandId);
    if (!command) {
      console.error(`CommandManager: Command with ID "${commandId}" not found.`);
      return undefined;
    }

    if (typeof command === 'function') {
      // Es un CommandHandler
      return command(args) as TResult;
    } else {
      // Es un ICommand
      if (this.canExecuteCommand(commandId, args)) {
        try {
          console.log(`Executing command: ${commandId}`, args);
          return command.execute(args) as TResult;
        } catch (error) {
          console.error(`CommandManager: Error executing command "${commandId}".`, error);
          return undefined;
        }
      } else {
        console.warn(`CommandManager: Command "${commandId}" cannot be executed in the current state.`);
        return undefined;
      }
    }
  }

  /**
   * Comprueba si un comando registrado puede ejecutarse.
   * @param commandId - El identificador único del comando.
   * @param args - Los argumentos para la comprobación.
   * @returns `true` si el comando existe y su método `canExecute` (si existe) devuelve `true`,
   * o si el método `canExecute` no está implementado. Devuelve `false` si el comando no existe
   * o si `canExecute` devuelve `false`.
   */
  canExecuteCommand(commandId: string, args?: any): boolean {
    const command = this.getCommand(commandId);
    if (!command) {
      return false; // El comando no existe
    }

    if (typeof command === 'function') {
      // Para CommandHandler, asumimos que siempre se puede ejecutar si existe.
      // Podrías añadir una lógica más compleja si los CommandHandlers necesitan una función canExecute separada.
      return true;
    } else {
      // Es un ICommand
      return command.canExecute ? command.canExecute(args) : true;
    }
  }

  /**
   * (Opcional) Devuelve una lista de todos los IDs de comandos registrados.
   * @returns Un array con los IDs de los comandos.
   */
  getRegisteredCommandIds(): string[] {
    return Array.from(this.commands.keys());
  }
}

//instancia del gestor de comandos singleton
const commandManager = new CommandManager();
export default commandManager;