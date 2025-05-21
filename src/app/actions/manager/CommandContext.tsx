import React, { createContext, useContext, ReactNode } from "react";
import commandManagerInstance, { CommandManager } from "./command.manager";
import {
  CommandContext as CommandContextArgs,
  TypeContextApp,
} from "@commands/interfaces/command.event";
import { useReactFlow } from "@xyflow/react";
import { useAppSelector } from "src/store/store";
import { AppNode } from "src/nodes/types";
import { Edge } from "@xyflow/react";

// Define the shape of the context data
interface CommandContextType {
  commandManager: CommandManager;
  generateContextApp: (
    type?: TypeContextApp,
    object?: AppNode | Edge<any>
  ) => CommandContextArgs;
}

// Create the context with a default undefined value
const CommandContext = createContext<CommandContextType | undefined>(undefined);

// Create a custom hook to use the command context
export const useCommand = (): CommandContextType => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error("useCommand must be used within a CommandProvider");
  }
  return context;
};

// Create the Provider component
interface CommandProviderProps {
  children: ReactNode;
}

export const CommandProvider: React.FC<CommandProviderProps> = ({
  children,
}) => {
  const reacFlowContext = useReactFlow<AppNode>();
  const store = useAppSelector((state) => state);

  const generateContextApp = (
    type?: TypeContextApp,
    object?: AppNode | Edge<any>
  ): CommandContextArgs => {
    return {
      type: type,
      object: object,
      state: reacFlowContext,
      appStore: store,
    };
  };

  const value = {
    commandManager: commandManagerInstance,
    generateContextApp,
  };

  return (
    <CommandContext.Provider value={value}>{children}</CommandContext.Provider>
  );
};
