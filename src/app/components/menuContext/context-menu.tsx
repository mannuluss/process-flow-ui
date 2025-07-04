import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import { Edge } from '@xyflow/react';
import React, { forwardRef, useImperativeHandle } from 'react';
import { AppNode } from 'src/app/customs/nodes/types.ts';

import { useCommand } from '../../actions/manager/CommandContext.tsx';
import { ContextMenuActionByType } from './constant/menu.const';
import {
  ContextMenuAction,
  MenuActionEventContext,
  TypeContextMenu,
} from './interface/contextActionEvent';

export interface ContextMenuRef {
  handleContextMenu: (
    evt: React.MouseEvent,
    object: AppNode | Edge,
    type: TypeContextMenu
  ) => void;
}

const ContextMenu = forwardRef((_props, ref) => {
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
    actions?: ContextMenuAction[];
    type: TypeContextMenu;
    object: any;
  } | null>(null);
  const { commandManager, generateContextApp } = useCommand();

  // Expone métodos al padre
  useImperativeHandle(
    ref,
    () =>
      ({
        handleContextMenu: (evt, objeto, type) => {
          evt.preventDefault();
          showMenu(evt, objeto, type);
          // aquí podrías cambiar estado, hacer fetch, etc.
        },
      }) as ContextMenuRef
  );
  const showMenu = (evt: React.MouseEvent, object, type: TypeContextMenu) => {
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: evt.clientX + 2,
            mouseY: evt.clientY - 6,
            actions: ContextMenuActionByType[type],
            type: type,
            object,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );

    // Prevent text selection lost after opening the context menu on Safari and Firefox
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      setTimeout(() => {
        selection.addRange(range);
      });
    }
  };

  const handleClose = (act: ContextMenuAction) => {
    setContextMenu(null);
    if (!act) return;

    const contextArgs = generateContextApp(
      contextMenu?.type,
      contextMenu?.object
    );

    if (act.commandId) {
      commandManager.executeCommand(act.commandId, contextArgs);
    }
    if (act.action) {
      act?.action(contextArgs);
    }
  };

  const contextApp: MenuActionEventContext = generateContextApp(
    contextMenu?.type,
    contextMenu?.object
  );

  return (
    <Menu
      open={contextMenu !== null}
      onClose={() => handleClose(null)}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
    >
      {contextMenu?.actions
        .filter(a => (a.show ? a.show(contextApp) : true))
        .map((act, i) => (
          <MenuItem key={i} onClick={() => handleClose(act)}>
            <ListItemIcon>{act.icon}</ListItemIcon>
            {act.title}
          </MenuItem>
        ))}
    </Menu>
  );
});

export default ContextMenu;
