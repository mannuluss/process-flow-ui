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
import { subscribeMenssage } from "../../core/services/message.service";
import { EventFlowTypes } from "../../core/types/message";
import { edgeTypes } from "../../edges";
import OnConnectEdge from "../../edges/on-connect-event";
import environments from "../../environments/environments";
import { nodeTypes } from "../../nodes";
import { AppNode } from "../../nodes/types";
import { getDataGraph } from "../../services/data.graph.service";
import ButtonSave from "../custom/button-save";
import GradientCircularProgress from "../custom/circular-gradiant";
import ContextMenu, { ContextMenuRef } from "../menuContext/context-menu";
import PanelFlowState from "../panels/panel-flow-state";

export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as AppNode[]); //useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]); //useEdgesState(initialEdges);

  const [loading, setLoading] = React.useState(true);
  const menu = React.useRef<ContextMenuRef>(null);
  const connectEdges = React.useRef<{ onConnect: OnConnect }>(null);

  const loadData = useCallback(
    (msj) => {
      console.info("[GRAPH] load data");
      setNodes(msj.data.nodes);
      setEdges(msj.data.conections);
      setLoading(msj.data.nodes?.length === 0 ? true : false);
    },
    [setEdges, setNodes]
  );
  //se cargan los nodos y conexiones desde el servicio
  useEffect(() => {
    console.info("[GRAPH] init", environments);
    setLoading(true);
    // window.top.postMessage({ type: EventFlowTypes.LOAD_DATA });
    subscribeMenssage(EventFlowTypes.LOAD_DATA, loadData);
    // data por defecto
    getDataGraph().then(loadData);
  }, [loadData]); // Array vacío = solo en el primer render (como ngOnInit)

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

  return (
    <>
      <ReactFlow
        colorMode="system"
        nodes={nodes}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onContextMenuNode}
        onEdgeContextMenu={onContextMenuEdge}
        fitView
        defaultEdgeOptions={{ type: "step" } as Edge}
      >
        <Background />
        <MiniMap />
        <Controls />
        <PanelFlowState />
        {/*Button de guardar */}
        <ButtonSave />
        <ContextMenu ref={menu} />
        <OnConnectEdge ref={connectEdges} />
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
