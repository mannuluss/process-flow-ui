import { useCommand } from '@commands/manager/CommandContext';
import AddIcon from '@mui/icons-material/Add';
import { Button } from 'antd';
import { Panel } from '@xyflow/react';

export default function ButtonAddNode() {
  const { commandManager, generateContextApp } = useCommand();

  const handleAdd = () => {
    commandManager.executeCommand('createNode', generateContextApp('Node'));
  };

  return (
    <Panel position="bottom-right">
      <Button
        type="primary"
        icon={<AddIcon />}
        size="large"
        style={{ margin: 16 }}
        onClick={() => handleAdd()}
      >
        Agregar nodo
      </Button>
    </Panel>
  );
}
