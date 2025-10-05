import { Button, Space, Tooltip } from 'antd';
import { ActionsToolbar } from '../menuContext/constant/menu.const';
import { useCommand } from '@commands/manager/CommandContext';
import { useAppSelector } from 'src/store/store';
import './toolbar-floating.style.scss';

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
      <Space.Compact>
        {actions
          .filter(act => (act.show ? act.show(context) : true))
          .map(act => (
            <Tooltip title={act.title} key={act.title}>
              <Button
                icon={act.icon}
                onClick={() =>
                  commandManager.executeCommand(act.commandId, context)
                }
              />
            </Tooltip>
          ))}
      </Space.Compact>
    </div>
  );
}
