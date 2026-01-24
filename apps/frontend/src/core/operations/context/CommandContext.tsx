import {
  CommandContext as CommandContextArgs,
  TypeContextApp,
} from '@commands/interfaces/command.event';
import { GraphData } from '@core/types/message';
import { Edge, useReactFlow } from '@xyflow/react';
import React, { createContext, ReactNode, useContext } from 'react';
import { AppNode } from 'src/app/customs/nodes/types';
import { useAppSelector } from 'src/store/store';

import commandManagerInstance, { CommandManager } from '../command.manager';

// Define the shape of the context data
interface CommandContextType {
  commandManager: CommandManager;
  generateContextApp: (
    type?: TypeContextApp,
    object?: AppNode | Edge<any> | GraphData
  ) => CommandContextArgs;
}

// Create the context with a default undefined value
const CommandContext = createContext<CommandContextType | undefined>(undefined);

// Create a custom hook to use the command context
//TODO: revisar este error de eslint de vite
// eslint-disable-next-line react-refresh/only-export-components
export const useCommand = (): CommandContextType => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useCommand must be used within a CommandProvider');
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
  const store = useAppSelector(state => state);

  const generateContextApp = (
    type?: TypeContextApp,
    object?: AppNode | Edge<any> | GraphData
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
