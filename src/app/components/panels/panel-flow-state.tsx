import { Panel, useReactFlow } from "@xyflow/react";

import "./panel-flow-state.scss";
import {
  Button,
  Paper,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  IconButton,
} from "@mui/material";
import { ActionsMenuWindow } from "../menuContext/constant/menu.const";
import {
  ContextMenuAction,
  MenuActionEventContext,
} from "../menuContext/interface/contextActionEvent";
import { AppNode } from "src/app/customs/nodes/types";
import { useAppSelector, useAppDispatch } from "src/store/store";
import commandManager from "@commands/manager/command.manager";
import { setCollapsePanel, setColorMode } from "src/store/configSlice";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import ButtonAddNode from "./components/button-add";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import ButtonExport from "../custom/button-export";
import ButtonImport from "../custom/button-import";

export default function PanelFlowState() {
  //const [open, setOpen] = useState(true);
  const open = useAppSelector((state) => state.config.collapsePanel);

  const { selectedEdge, selectedNode } = useAppSelector(
    (state) => state.selection
  );
  const { colorMode } = useAppSelector((state) => state.config);
  const reacFlowContext = useReactFlow<AppNode>();
  const store = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

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
  const handleColorModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: "light" | "dark" | "system"
  ) => {
    if (newMode) {
      dispatch(setColorMode(newMode));
    }
  };

  return (
    <>
      <ButtonAddNode />
      <Panel position="top-right">
        <Paper elevation={3} className="container-panel-actions">
          <IconButton onClick={() => dispatch(setCollapsePanel(!open))}>
            {(open && <OpenInFullIcon />) || <CloseFullscreenIcon />}
          </IconButton>
          <div
            className={open ? "panel-container" : "panel-container panel-close"}
          >
            <FormControl fullWidth sx={{ mb: 1 }}>
              <ToggleButtonGroup
                value={colorMode}
                exclusive
                onChange={handleColorModeChange}
                aria-label="theme selection"
                size="small"
                sx={{ width: "100%", justifyContent: "center" }}
              >
                <Tooltip title="Modo claro" placement="bottom">
                  <ToggleButton value="light" aria-label="light mode">
                    <LightModeIcon fontSize="small" />
                  </ToggleButton>
                </Tooltip>
                <Tooltip title="Modo oscuro" placement="bottom">
                  <ToggleButton value="dark" aria-label="dark mode">
                    <DarkModeIcon fontSize="small" />
                  </ToggleButton>
                </Tooltip>
                <Tooltip title="Sistema" placement="bottom">
                  <ToggleButton value="system" aria-label="system mode">
                    <AutoModeIcon fontSize="small" />
                  </ToggleButton>
                </Tooltip>
              </ToggleButtonGroup>
            </FormControl>

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

            <ButtonExport />
            <ButtonImport />
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
    </>
  );
}
