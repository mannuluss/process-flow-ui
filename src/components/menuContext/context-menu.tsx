import { Menu, MenuItem } from "@mui/material";
import { Edge, useReactFlow } from "@xyflow/react";
import React, { forwardRef, useImperativeHandle } from "react";
import {
  ContextMenuAction,
  TypeContextMenu,
} from "./interface/contextActionEvent";
import { AppNode } from "../../nodes/types";
import { ContextMenuActionByType } from "./constant/menu.const";
import commandManager from "@commands/manager/command.manager";
import { useAppSelector } from "src/store/store";

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
  const reacFlowContext = useReactFlow<AppNode>();
  const store = useAppSelector(state => state);

  // Expone métodos al padre
  useImperativeHandle(
    ref,
    () =>
      ({
        handleContextMenu: (evt, edge, type) => {
          evt.preventDefault();
          showMenu(evt, edge, type);
          // aquí podrías cambiar estado, hacer fetch, etc.
        },
      } as ContextMenuRef)
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
    if(!act) return;

    if (act.commandId) {
      commandManager.executeCommand(act.commandId, {
        type: contextMenu?.type,
        object: contextMenu.object,
        state: reacFlowContext,
        appStore: store,
      });
    }
    if(act.action) {
      act?.action({
        type: contextMenu?.type,
        object: contextMenu.object,
        state: reacFlowContext,
        appStore: store,
      });
    }
  };

  return (
    // <div onContextMenu={handleContextMenu} style={{ cursor: "context-menu" }}>
    //   {props.children}
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
        .filter((a) => (a.show ? a.show() : true))
        .map((act, i) => (
          <MenuItem key={i} onClick={() => handleClose(act)}>
            {act.title}
          </MenuItem>
        ))}
    </Menu>
    // </div>
  );
});

export default ContextMenu;
