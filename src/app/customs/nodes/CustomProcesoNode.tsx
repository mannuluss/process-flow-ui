import './procesos-node-styles.scss';

import { Handle, type NodeProps, Position, useStore } from '@xyflow/react';

// import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { ProcesoCustomNode } from './types';

export function CustomProcessNode({ id, data }: NodeProps<ProcesoCustomNode>) {
  // Accede a todos los edges del store
  const edges = useStore(store => store.edges);

  // Filtra los edges para encontrar las conexiones entrantes a este nodo
  const incomingEdges = edges.filter(edge => edge.target === id);
  // Filtra los edges para encontrar las conexiones salientes de este nodo
  //const outgoingEdges = edges.filter((edge) => edge.source === id);

  const dirHandleTarget =
    incomingEdges.length <= 1 ? Position.Top : Position.Left;

  return (
    <div className={data.initial ? 'initial-node' : ''}>
      <Handle type="target" position={dirHandleTarget} />

      {data.label && <span className="selected-node-label">{data.label}</span>}

      <Handle type="source" position={Position.Bottom}>
        {/* <RadioButtonCheckedIcon className="end-indicator"/> */}
      </Handle>
    </div>
  );
}
