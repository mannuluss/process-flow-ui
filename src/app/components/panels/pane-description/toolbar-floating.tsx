import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { ActionsToolbar } from '../../menuContext/constant/menu.const';
import { useCommand } from '@commands/manager/CommandContext';
import { useAppSelector } from 'src/store/store';
import './pane-description.scss';

const actions = ActionsToolbar;

export default function ToolbarFloating() {
  const { commandManager, generateContextApp } = useCommand();
  const selected = useAppSelector(state => state.selection);

  const context = generateContextApp(
    selected.selectedNode ? 'Node' : 'Edge',
    selected.selectedEdge ?? (selected.selectedNode as any)
  );

  return (
    <div className="pane-actions">
      <ButtonGroup
        variant="contained"
        aria-label="Buttons for actions on flow"
        color="inherit"
      >
        {actions
          .filter(act => (act.show ? act.show(context) : true))
          .map(act => (
            <Tooltip title={act.title} key={act.title}>
              <Button
                onClick={() =>
                  commandManager.executeCommand(act.commandId, context)
                }
              >
                {act.icon}
              </Button>
            </Tooltip>
          ))}
      </ButtonGroup>
    </div>
  );
}
