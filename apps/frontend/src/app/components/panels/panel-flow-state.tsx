import './panel-flow-state.scss';

import commandManager from '@commands/manager/command.manager';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { Button, Card, Segmented, Space, Tooltip } from 'antd';
import { Panel, useReactFlow } from '@xyflow/react';
import { AppNode } from 'src/app/customs/nodes/types';
import { setCollapsePanel, setColorMode } from 'src/store/configSlice';
import { useAppDispatch, useAppSelector } from 'src/store/store';

import ButtonExport from '../custom/button-export';
import ButtonImport from '../custom/button-import';
import { ActionsMenuWindow } from '../menuContext/constant/menu.const';
import {
  ContextMenuAction,
  MenuActionEventContext,
} from '../menuContext/interface/contextActionEvent';
import ButtonAddNode from './components/button-add';

export default function PanelFlowState() {
  //const [open, setOpen] = useState(true);
  const open = useAppSelector(state => state.config.collapsePanel);

  const { selectedEdge, selectedNode } = useAppSelector(
    state => state.selection
  );
  const { colorMode } = useAppSelector(state => state.config);
  const reacFlowContext = useReactFlow<AppNode>();
  const store = useAppSelector(state => state);
  const dispatch = useAppDispatch();

  const contextApp: MenuActionEventContext = {
    type: selectedEdge ? 'Edge' : 'Node',
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
  const handleColorModeChange = (value: string | number) => {
    dispatch(setColorMode(value as 'light' | 'dark' | 'system'));
  };

  return (
    <>
      <ButtonAddNode />
      <Panel position="top-right">
        <Card className="container-panel-actions">
          <Button
            icon={(open && <OpenInFullIcon />) || <CloseFullscreenIcon />}
            onClick={() => dispatch(setCollapsePanel(!open))}
          />
          <div
            className={open ? 'panel-container' : 'panel-container panel-close'}
          >
            <Space
              direction="vertical"
              style={{ width: '100%', marginBottom: 8 }}
            >
              <Segmented
                value={colorMode}
                onChange={handleColorModeChange}
                options={[
                  {
                    label: (
                      <Tooltip title="Modo claro" placement="bottom">
                        <LightModeIcon fontSize="small" />
                      </Tooltip>
                    ),
                    value: 'light',
                  },
                  {
                    label: (
                      <Tooltip title="Modo oscuro" placement="bottom">
                        <DarkModeIcon fontSize="small" />
                      </Tooltip>
                    ),
                    value: 'dark',
                  },
                  {
                    label: (
                      <Tooltip title="Sistema" placement="bottom">
                        <AutoModeIcon fontSize="small" />
                      </Tooltip>
                    ),
                    value: 'system',
                  },
                ]}
                block
              />
            </Space>

            {ActionsMenuWindow.filter(action =>
              action.show ? action.show(contextApp) : true
            ).map((action, i) => (
              <Button
                key={i}
                type="primary"
                onClick={() => {
                  handleclick(action);
                }}
                style={{ marginBottom: 8 }}
              >
                {action.title}
              </Button>
            ))}

            <ButtonExport />
            <ButtonImport />
          </div>
        </Card>

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
