import './designer-toolbar.style.scss';
import { Button, Space, Tooltip } from 'antd';
import { ActionsToolbar } from 'src/app/components/menuContext/constant/menu.const';
import { useCommand } from '@commands/context/CommandContext';
import { useAppSelector } from 'src/store/store';

const actions = ActionsToolbar;

export default function DesignerToolbar(): JSX.Element {
  const { commandManager, generateContextApp } = useCommand();
  const selected = useAppSelector(state => state.selection);

  const context = generateContextApp(
    selected.selectedNode ? 'Node' : 'Edge',
    selected.selectedEdge ?? (selected.selectedNode as any)
  );

  return (
    <Space
      direction="vertical"
      size={8}
      align="center"
      aria-hidden
      className="designer-toolbar"
    >
      <Space direction="vertical">
        {actions
          .filter(act => (act.show ? act.show(context) : true))
          .map((act, i) => (
            <Tooltip title={act.title} key={i} placement="right">
              <Button
                type="default"
                icon={act.icon}
                size="large"
                aria-label={act.title}
                onClick={() =>
                  commandManager.executeCommand(act.commandId, context)
                }
              />
            </Tooltip>
          ))}
      </Space>
    </Space>
  );
}
