import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  NodeMouseHandler,
  EdgeMouseHandler,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";
import PanelFlowState from "./components/panels/panel-flow-state";
import { getDataGraph } from "./services/data.graph.service";
import { Backdrop } from "@mui/material";
import React from "react";
import { AppNode } from "./nodes/types";
import GradientCircularProgress from "./components/custom/circular-gradiant";
import ButtonSave from "./components/custom/button-save";
import { addEventData, EventFlowTypes } from "./events/manage.event";
import ContextMenu, {
  ContextMenuRef,
} from "./components/menuContext/context-menu";
import OnConnectEdge from "./edges/on-connect-event";

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([] as AppNode[]); //useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]); //useEdgesState(initialEdges);

  const [loading, setLoading] = React.useState(true);
  const menu = React.useRef<ContextMenuRef>(null);
  const connectEdges = React.useRef<{ onConnect: OnConnect }>(null);

  //se cargan los nodos y conexiones desde el servicio
  useEffect(() => {
    console.info("[GRAPH] init");
    setLoading(true);
    // window.top.postMessage({ type: EventFlowTypes.LOAD_DATA });
    addEventData(EventFlowTypes.LOAD_DATA, (msj) => {
      console.info("[GRAPH] postMessage load data");
      setNodes(msj.data.nodes);
      setEdges(msj.data.conections);
      setLoading(msj.data.nodes?.length === 0 ? true : false);
    });
    getDataGraph().then((data) => {
      console.info("[GRAPH] Se carga los nodos y conexiones desde el servicio");
      // setTimeout(() => {
      setNodes(data.data.nodes);
      setEdges(data.data.conections);
      setLoading(data.data.nodes?.length === 0 ? true : false);
      // }, 3000);
    });
  }, []); // Array vacío = solo en el primer render (como ngOnInit)

  const onContextMenuNode: NodeMouseHandler<AppNode> = useCallback(
    (evt, node) => {
      menu.current?.handleContextMenu(evt, node, "Node");
    },
    []
  );

  const onContextMenuEdge: EdgeMouseHandler = useCallback((evt, edge) => {
    menu.current?.handleContextMenu(evt, edge, "Edge");
  }, []);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={connectEdges?.current?.onConnect}
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
