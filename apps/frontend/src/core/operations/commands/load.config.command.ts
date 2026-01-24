import { v4 as uuidv4 } from 'uuid';
import { CommandHandler } from '@commands/interfaces/command.interfaces';
import { InitialCustomNode } from 'src/app/customs/nodes/types';
import { findInitialNode } from 'src/core/utils/workflow';

/**
 * Crea el nodo initial por defecto.
 */
const createDefaultInitialNode = (): InitialCustomNode => ({
  id: `initial-${uuidv4().slice(0, 8)}`,
  type: 'initial',
  position: { x: 50, y: 200 },
  data: {
    handlers: [],
  },
});

/**
 * Comando para cargar datos en el canvas.
 * Asegura que siempre exista un nodo initial.
 */
export const loadDataCommand: CommandHandler = context => {
  const nodes = context.object?.nodes ?? [];
  const edges = context.object?.edges ?? [];

  // Verificar si existe un nodo initial
  const hasInitialNode = !!findInitialNode(nodes);

  // Si no existe, agregar uno por defecto
  const finalNodes = hasInitialNode
    ? nodes
    : [createDefaultInitialNode(), ...nodes];

  context.state.setNodes(finalNodes);
  context.state.setEdges(edges);
  context.state.fitView();
};
