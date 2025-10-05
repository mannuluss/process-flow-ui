import commandManager from '@commands/manager/command.manager';
import SaveIcon from '@mui/icons-material/Save';
import { Button } from 'antd';
import { useStore } from '@xyflow/react';

function saveAction(nodes: any[], edges: any[]) {
  commandManager.executeCommand('saveGraph', {
    object: {
      nodes,
      edges,
    },
  });
}

export default function ButtonExport() {
  const nodes = useStore<any[]>(s => s.nodes);
  const edges = useStore(s => s.edges);

  return (
    <Button
      type="primary"
      icon={<SaveIcon />}
      onClick={() => saveAction(nodes, edges)}
    >
      Exportar
    </Button>
  );
}
