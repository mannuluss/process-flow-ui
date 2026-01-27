import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { WorkflowMetadata } from '@process-flow/common';

interface WorkflowContextState {
  workflowId: string | null;
  metadata: WorkflowMetadata;
  isNew: boolean;
  isModified: boolean;
  isLoading: boolean;
  error: string | null;
}

interface WorkflowContextValue extends WorkflowContextState {
  setWorkflowId: (id: string | null) => void;
  updateMetadata: (data: Partial<WorkflowMetadata>) => void;
  setIsModified: (modified: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetWorkflow: () => void;
}

const defaultMetadata: WorkflowMetadata = {
  name: 'Nuevo Workflow',
  description: '',
  isActive: true,
};

const WorkflowContext = createContext<WorkflowContextValue | undefined>(
  undefined
);

interface WorkflowProviderProps {
  children: ReactNode;
  workflowId?: string;
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({
  children,
  workflowId: initialWorkflowId,
}) => {
  const [workflowId, setWorkflowIdState] = useState<string | null>(
    initialWorkflowId ?? null
  );
  const [metadata, setMetadata] = useState<WorkflowMetadata>(defaultMetadata);
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Empieza en true porque vamos a cargar
  const [error, setError] = useState<string | null>(null);

  const setWorkflowId = (id: string | null) => {
    setWorkflowIdState(id);
  };

  const updateMetadata = (data: Partial<WorkflowMetadata>) => {
    setMetadata(prev => ({ ...prev, ...data }));
    setIsModified(true);
  };

  const resetWorkflow = () => {
    setWorkflowIdState(null);
    setMetadata(defaultMetadata);
    setIsModified(false);
  };

  const value: WorkflowContextValue = {
    workflowId,
    metadata,
    isNew: workflowId === null,
    isModified,
    isLoading,
    error,
    setWorkflowId,
    updateMetadata,
    setIsModified,
    setIsLoading,
    setError,
    resetWorkflow,
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within WorkflowProvider');
  }
  return context;
};
