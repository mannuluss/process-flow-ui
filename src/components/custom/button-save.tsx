import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import saveGraphCommand from "../../commands/save.command";
import { Panel, useStore } from "@xyflow/react";

export default function ButtonSave() {
  const [saving, setSaving] = useState(false);
  const nodes = useStore<any[]>((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  return (
    <Panel position="bottom-right">
      <Button
        loading={saving}
        variant="contained"
        loadingPosition="end"
        startIcon={<SaveIcon />}
        onClick={() => saveGraphCommand(nodes, edges)}
      >
        Save
      </Button>
    </Panel>
  );
}
