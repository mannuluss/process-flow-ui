import { useEffect, useRef } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { workflowService } from '../services/workflow.service';
import { useCommand } from '@commands/context/CommandContext';

/**
 * Hook que carga el workflow desde el backend cuando el Canvas está montado.
 * Lee el workflowId del WorkflowContext y ejecuta el comando loadData.
 *
 * Debe ser llamado dentro del Canvas para garantizar que ReactFlow esté listo.
 */
export const useWorkflowLoad = () => {
  const {
    workflowId,
    setWorkflowId,
    updateMetadata,
    setIsModified,
    setIsLoading,
    setError,
  } = useWorkflow();

  const { commandManager, generateContextApp } = useCommand();

  // Ref para evitar doble ejecución en StrictMode
  const hasLoaded = useRef(false);

  useEffect(() => {
    // Evitar doble ejecución
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadWorkflow = async () => {
      if (!workflowId) {
        // No ID means new workflow - initialize with empty canvas
        setWorkflowId(null);
        setIsModified(false);
        setIsLoading(false);

        // Initialize canvas with empty data (will create initial node)
        commandManager.executeCommand(
          'loadData',
          generateContextApp('Graph', { nodes: [], edges: [] })
        );
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const workflow = await workflowService.getOne(workflowId);

        // Update context with workflow metadata
        setWorkflowId(workflow.id);
        updateMetadata({
          name: workflow.name,
          description: workflow.description,
          isActive: workflow.isActive,
        });

        // Load nodes and edges to canvas using the command system
        if (workflow.definition) {
          commandManager.executeCommand(
            'loadData',
            generateContextApp('Graph', {
              nodes: workflow.definition.nodes || [],
              edges: workflow.definition.edges || [],
            })
          );
        }

        setIsModified(false);
      } catch (err) {
        console.error('Error loading workflow:', err);
        setError('No se pudo cargar el workflow');
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkflow();
  }, [
    workflowId,
    setWorkflowId,
    updateMetadata,
    setIsModified,
    setIsLoading,
    setError,
    commandManager,
    generateContextApp,
  ]);
};
