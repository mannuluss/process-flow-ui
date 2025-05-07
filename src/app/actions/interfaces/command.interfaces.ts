import { CommandContext } from "./command.event";

/**
 * Interfaz base para todos los comandos.
 * Define los métodos esenciales que cada comando debe implementar.
 * @template TArgs - El tipo de los argumentos esperados por el método execute y canExecute. Por defecto es 'any'.
 * @template TResult - El tipo del valor devuelto por el método execute. Por defecto es 'void'.
 */
export interface ICommand<TArgs = any, TResult = void> {
  /**
   * Identificador único para el comando (opcional pero recomendado).
   * Puede ser útil para registrar y buscar comandos.
   */
  id?: string;

  /**
   * Ejecuta la lógica principal del comando.
   * @param args - Argumentos necesarios para la ejecución del comando.
   * @returns El resultado de la ejecución del comando, si lo hubiera.
   */
  execute(args?: TArgs): TResult;

  /**
   * Determina si el comando puede ejecutarse en el estado actual de la aplicación.
   * Útil para habilitar/deshabilitar elementos de la UI asociados a este comando.
   * @param args - Argumentos que podrían influir en si el comando puede ejecutarse.
   * @returns `true` si el comando puede ejecutarse, `false` en caso contrario.
   * Si no se implementa, se asume que siempre se puede ejecutar (`true`).
   */
  canExecute?(args?: TArgs): boolean;

  /**
   * (Opcional) Ejecuta la lógica para deshacer la acción del comando.
   * Implementar si se necesita funcionalidad de deshacer/rehacer.
   */
  // undo?(args?: TArgs): void;

  /**
   * (Opcional) Determina si la acción del comando puede deshacerse.
   * @returns `true` si el comando puede deshacerse, `false` en caso contrario.
   */
  // canUndo?(): boolean;
}

/**
 * Tipo para un manejador de comandos simple basado en funciones.
 * Puede ser una alternativa a usar clases para comandos sencillos.
 * @template TArgs - El tipo de los argumentos esperados por la función.
 * @template TResult - El tipo del valor devuelto por la función.
 */
export type CommandHandler<TArgs = CommandContext, TResult = void> = (args?: TArgs) => TResult;

/**
 * (Opcional) Interfaz para un registro o gestor centralizado de comandos.
 * Facilitaría la invocación de comandos por ID desde cualquier lugar.
 */
export interface ICommandRegistry {
  /**
   * Registra un comando en el registro.
   * @param commandId - El identificador único del comando.
   * @param command - La instancia del comando a registrar.
   */
  registerCommand(commandId: string, command: ICommand<any, any> | CommandHandler<any, any>): void;

  /**
   * Obtiene un comando registrado por su ID.
   * @param commandId - El identificador único del comando.
   * @returns La instancia del comando o `undefined` si no se encuentra.
   */
  getCommand(commandId: string): ICommand<any, any> | CommandHandler<any, any> | undefined;

  /**
   * Ejecuta un comando registrado por su ID.
   * @param commandId - El identificador único del comando.
   * @param args - Los argumentos para la ejecución del comando.
   * @returns El resultado de la ejecución del comando o `undefined` si el comando no existe.
   */
  executeCommand<TArgs = any, TResult = void>(commandId: string, args?: TArgs): TResult | undefined;

  /**
   * Comprueba si un comando registrado puede ejecutarse.
   * @param commandId - El identificador único del comando.
   * @param args - Los argumentos para la comprobación.
   * @returns `true` si el comando puede ejecutarse, `false` si no puede o no existe.
   */
  canExecuteCommand(commandId: string, args?: any): boolean;
}
