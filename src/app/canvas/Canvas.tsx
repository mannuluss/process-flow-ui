import { useCommand } from "@commands/manager/CommandContext";
import { subscribeMenssage } from "@core/services/message.service";
import {
  useNodesState,
  useEdgesState,
  Edge,
  OnConnect,
  NodeMouseHandler,
  EdgeMouseHandler,
  ReactFlow,
  Background,
  MiniMap,
  Controls,
} from "@xyflow/react";
import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import OnConnectEdge from "src/edges/on-connect-event";
import {
  setSelectedNode,
  setSelectedEdge,
  clearSelection,
} from "src/store/selectionSlice";
import { useAppSelector } from "src/store/store";
import LoadingBackdrop from "../components/custom/loading-backdrop";
import ContextMenu, {
  ContextMenuRef,
} from "../components/menuContext/context-menu";
import PanelFlowState from "../components/panels/panel-flow-state";
import { edgeTypes } from "../customs/edges";
import { nodeTypes } from "../customs/nodes";
import { EventManager } from "./events/EventManager";
import { CrossAppMessage, EventFlowTypes } from "@core/types/message";
import { AppNode } from "../customs/nodes/types";

export default function Canvas() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nodes, _setNodes, onNodesChange] = useNodesState([] as AppNode[]); //useNodesState(initialNodes);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [edges, _setEdges, onEdgesChange] = useEdgesState([] as Edge[]); //useEdgesState(initialEdges);

  const menu = React.useRef<ContextMenuRef>(null);
  const connectEdges = React.useRef<{ onConnect: OnConnect }>(null);
  const dispatch = useDispatch();
  const { colorMode, showPanelMinimap } = useAppSelector(
    (state) => state.config
  );
  const { commandManager, generateContextApp } = useCommand();

  const loadData = useCallback(
    (msj: CrossAppMessage) => {
      commandManager.executeCommand(
        "loadData",
        generateContextApp("Graph", msj.payload)
      );
    },
    [commandManager, generateContextApp]
  );
  //se cargan los nodos y conexiones
  useEffect(() => {
    const sub = subscribeMenssage(EventFlowTypes.LOAD_DATA, loadData);
    return () => {
      sub.unsubscribe();
    };
  }, [loadData]);

  useEffect(() => {
    const sub = subscribeMenssage(EventFlowTypes.ADD_EDGE, (msj) => {
      commandManager.executeCommand(
        "addEdge",
        generateContextApp("Edge", msj.payload)
      );
    });
    const sub2 = subscribeMenssage(EventFlowTypes.ADD_NODE, (msj) => {
      commandManager.executeCommand(
        "addNode",
        generateContextApp("Node", msj.payload)
      );
    });
    return () => {
      sub.unsubscribe();
      sub2.unsubscribe();
    };
  }, [commandManager, generateContextApp]);

  const onContextMenuNode: NodeMouseHandler<AppNode> = useCallback(
    (evt, node) => {
      menu.current?.handleContextMenu(evt, node, "Node");
    },
    []
  );

  const onContextMenuEdge: EdgeMouseHandler = useCallback((evt, edge) => {
    menu.current?.handleContextMenu(evt, edge, "Edge");
  }, []);

  const onConnect: OnConnect = useCallback((connection) => {
    connectEdges.current?.onConnect(connection);
  }, []);

  const onNodeSelect: NodeMouseHandler<AppNode> = useCallback(
    (_, node) => {
      dispatch(setSelectedNode(node));
    },
    [dispatch]
  );

  const onEdgeSelect: EdgeMouseHandler = useCallback(
    (_, edge) => {
      dispatch(setSelectedEdge(edge));
    },
    [dispatch]
  );

  //se limpia la seleccion de nodos, conexiones, etc...
  const onPaneClick = useCallback(() => {
    dispatch(clearSelection());
  }, [dispatch]);

  const onDoubleClickNode = useCallback(
    (_evt: React.MouseEvent, node: AppNode) => {
      commandManager.executeCommand(
        "editNode",
        generateContextApp("Node", node)
      );
    },
    [commandManager, generateContextApp]
  );

  const onDoubleClickEdge = useCallback(
    (_evt: React.MouseEvent, edge: Edge) => {
      commandManager.executeCommand(
        "editEdge",
        generateContextApp("Edge", edge)
      );
    },
    [commandManager, generateContextApp]
  );

  return (
    <>
      <ReactFlow
        colorMode={colorMode}
        nodes={nodes}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onContextMenuNode}
        onEdgeContextMenu={onContextMenuEdge}
        onNodeClick={onNodeSelect}
        onEdgeClick={onEdgeSelect}
        onPaneClick={onPaneClick}
        onNodeDoubleClick={onDoubleClickNode}
        onEdgeDoubleClick={onDoubleClickEdge}
        fitView
        defaultEdgeOptions={{ type: "step" } as Edge}
      >
        <Background />
        {showPanelMinimap && <MiniMap />}
        <Controls />
        <PanelFlowState />
        <ContextMenu ref={menu} />
        <OnConnectEdge ref={connectEdges} />
      </ReactFlow>

      <LoadingBackdrop />
      {/* <EventManager /> */}
      <EventManager />
    </>
  );
}
