import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { Panel, useStore } from "@xyflow/react";
import commandManager from "@commands/manager/command.manager";
import { useEffect } from "react";
import { sendMessage } from "@core/services/message.service";
import { EventFlowTypes } from "@core/types/message";

function saveAction(nodes: any[], edges: any[]) {
  commandManager.executeCommand("saveGraph", {
    object: {
      nodes,
      edges,
    },
  });
}

export default function ButtonExport() {
  const nodes = useStore<any[]>((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  useEffect(() => {
    sendMessage({
      type: EventFlowTypes.ALL_DATA,
      payload: {
        nodes,
        conections: edges,
      },
    });
  }, [nodes, edges]);

  return (
    <Panel position="top-right">
      <Button
        variant="contained"
        loadingPosition="end"
        startIcon={<SaveIcon />}
        onClick={() => saveAction(nodes, edges)}
      >
        Exportar
      </Button>
    </Panel>
  );
}
