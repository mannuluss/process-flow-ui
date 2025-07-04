import { useCommand } from '@commands/manager/CommandContext';
import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';
import { Panel } from '@xyflow/react';

export default function ButtonAddNode() {
  const { commandManager, generateContextApp } = useCommand();

  const handleAdd = () => {
    commandManager.executeCommand('createNode', generateContextApp('Node'));
  };

  return (
    <Panel position="bottom-right">
      <Fab variant="extended" sx={{ m: 2 }} onClick={() => handleAdd()}>
        <AddIcon sx={{ mr: 1 }} />
        Agregar nodo
      </Fab>
    </Panel>
  );
}
