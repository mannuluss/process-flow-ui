import { Panel, useReactFlow } from "@xyflow/react";

import "./panel-flow-state.scss";
import { Button, Paper } from "@mui/material";
import { ActionsMenuWindow } from "../menuContext/constant/menu.const";
import {
  ContextMenuAction,
  MenuActionEventContext,
} from "../menuContext/interface/contextActionEvent";
import { AppNode } from "src/nodes/types";
import { useAppSelector } from "src/store/store";
import commandManager from "@commands/manager/command.manager";

export default function PanelFlowState() {
  //const [open, setOpen] = React.useState(false);

  const { selectedEdge, selectedNode } = useAppSelector(
    (state) => state.selection
  );
  const reacFlowContext = useReactFlow<AppNode>();
  const store = useAppSelector((state) => state);

  const contextApp: MenuActionEventContext = {
    type: selectedEdge ? "Edge" : "Node",
    object: selectedEdge || selectedNode,
    state: reacFlowContext,
    appStore: store,
  };

  const handleclick = (acton: ContextMenuAction) => {
    if (acton.commandId) {
      commandManager.executeCommand(acton.commandId, contextApp);
    }
    if (acton.action) {
      return acton.action(contextApp);
    }
  };

  return (
    <Panel position="top-right">
      <Paper elevation={3}>
        <div className="panel-container">
          {ActionsMenuWindow.filter((action) =>
            action.show ? action.show(contextApp) : true
          ).map((action, i) => (
            <Button
              key={i}
              variant="contained"
              onClick={() => {
                handleclick(action);
              }}
            >
              {action.title}
            </Button>
          ))}
        </div>
      </Paper>
      {/* <SwipeableDrawer
        anchor={"bottom"}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        {list(anchor)}
      </SwipeableDrawer> */}
    </Panel>
  );
}
