import { useCallback, useEffect } from 'react';
import { Connection, Edge, useReactFlow } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { subscribeMenssage } from '@core/services/message.service';
import { EventFlowTypes } from '@core/types/message';
import { useCommand } from '@commands/context/CommandContext';

/**
 * Hook para manejar la conexión entre nodos.
 * Crea edges cuando se conecta un handler de un nodo a otro nodo.
 */
export function useEdgeConnection() {
  const flow = useReactFlow();
  const { commandManager, generateContextApp } = useCommand();

  // Manejar conexión: crear edge directamente
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) {
        console.warn('useEdgeConnection: Invalid connection', connection);
        return;
      }

      const edge = {
        id: `e-${connection.source}-${connection.sourceHandle || 'default'}-${connection.target}-${uuidv4().slice(0, 8)}`,
        source: connection.source,
        sourceHandle: connection.sourceHandle,
        target: connection.target,
        targetHandle: connection.targetHandle,
        type: 'default',
      } as Edge;

      commandManager.executeCommand(
        'addEdge',
        generateContextApp('Edge', edge)
      );
    },
    [commandManager, generateContextApp]
  );

  // Suscribirse a eventos externos de ADD_EDGE
  useEffect(() => {
    const subscription = subscribeMenssage(EventFlowTypes.ADD_EDGE, event => {
      commandManager.executeCommand('addEdge', {
        state: flow,
        object: event.payload,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [flow, commandManager]);

  return { onConnect };
}
