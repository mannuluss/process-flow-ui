import { Backdrop } from "@mui/material";
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
import { subscribeMenssage } from "@core/services/message.service";
import { CrossAppMessage, EventFlowTypes } from "@core/types/message";
import { edgeTypes } from "../../../edges";
import OnConnectEdge from "../../../edges/on-connect-event";
import { nodeTypes } from "../../../nodes";
import { AppNode } from "../../../nodes/types";
import GradientCircularProgress from "../custom/circular-gradiant";
import ContextMenu, { ContextMenuRef } from "../menuContext/context-menu";
import PanelFlowState from "../panels/panel-flow-state";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedNode,
  setSelectedEdge,
  clearSelection,
} from "../../../store/selectionSlice";
import { RootState } from "../../../store/store";
import { useCommand } from "@commands/manager/CommandContext";
import ButtonExport from "../custom/button-export";

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as AppNode[]); //useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]); //useEdgesState(initialEdges);

  const [loading, setLoading] = React.useState(false);
  const menu = React.useRef<ContextMenuRef>(null);
  const connectEdges = React.useRef<{ onConnect: OnConnect }>(null);
  const dispatch = useDispatch();
  const colorMode = useSelector((state: RootState) => state.config.colorMode);
  const { commandManager, generateContextApp } = useCommand();

  const loadData = useCallback(
    (msj: CrossAppMessage) => {
      console.info("[GRAPH] load data");
      setNodes(msj.payload.nodes);
      setEdges(msj.payload.conections);
      setLoading(msj.payload.nodes?.length === 0 ? true : false);
    },
    [setEdges, setNodes]
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
        <MiniMap />
        <Controls />
        <PanelFlowState />
        <ContextMenu ref={menu} />
        <OnConnectEdge ref={connectEdges} />
        <ButtonExport />
      </ReactFlow>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <GradientCircularProgress color="primary" />
      </Backdrop>
    </>
  );
}
