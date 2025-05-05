import { Connection, Edge } from "@xyflow/react";
import { AppNode } from "../../nodes/types";

export enum EventFlowTypes {
  CONFIG_APP = "CONFIG_APP",
  LOAD_DATA = "LOAD_DATA",
  ADD_NODE = "ADD_NODE",
  DELETE_NODE = "DELETE_NODE",
  ADD_EDGE = "ADD_EDGE",
  DELETE_EDGE = "DELETE_EDGE",
  UPDATE_NODE = "UPDATE_NODE",
  UPDATE_EDGE = "UPDATE_EDGE",
  SELECT_NODE = "SELECT_NODE",
  SELECT_EDGE = "SELECT_EDGE",
  SAVE_GRAPH = "SAVE_GRAPH",
  LOAD_ACTIONS = "LOAD_ACTIONS",
}

//export type TypeEventCrossApp = keyof typeof EventFlowTypes;

// --- Inicio: Definiciones de Payload para cada type de mensaje ---
type AppConfig = { /* ... estructura de configuración ... */ };
type GraphData = { nodes: any[]; edges: any[] /* ... estructura de datos del grafo ... */ };
type NewNodePayload = AppNode;
type DeleteNodePayload = any;//TODO definir
type NewEdgePayload = Connection;
type DeleteEdgePayload = Edge;
type UpdateNodePayload = { data: any /* ... datos parciales del nodo ... */ };
type UpdateEdgePayload = {  data: any /* ... datos parciales del edge ... */ };
type SelectNodePayload = AppNode;
type SelectEdgePayload = Edge;
type SaveGraphPayload = { nodes: AppNode[]; conections: Edge[] };
type LoadActionsPayload = { actions: any[] /* ... estructura de acciones ... */ };
// --- Fin: Definiciones de Payload ---


// 1. Mapeo de Tipos de Evento a Tipos de Payload
//    Usa 'never' si un evento no tiene payload.
interface EventPayloadMap {
  [EventFlowTypes.CONFIG_APP]: AppConfig;
  [EventFlowTypes.LOAD_DATA]: GraphData;
  [EventFlowTypes.ADD_NODE]: NewNodePayload;
  [EventFlowTypes.DELETE_NODE]: DeleteNodePayload;
  [EventFlowTypes.ADD_EDGE]: NewEdgePayload;
  [EventFlowTypes.DELETE_EDGE]: DeleteEdgePayload;
  [EventFlowTypes.UPDATE_NODE]: UpdateNodePayload;
  [EventFlowTypes.UPDATE_EDGE]: UpdateEdgePayload;
  [EventFlowTypes.SELECT_NODE]: SelectNodePayload;
  [EventFlowTypes.SELECT_EDGE]: SelectEdgePayload;
  [EventFlowTypes.SAVE_GRAPH]: SaveGraphPayload;
  [EventFlowTypes.LOAD_ACTIONS]: LoadActionsPayload;
}

// 2. Tipos Auxiliares para separar eventos con y sin payload
type KeysWithPayload<T> = { [K in keyof T]: T[K] extends never ? never : K }[keyof T];
type KeysWithoutPayload<T> = { [K in keyof T]: T[K] extends never ? K : never }[keyof T];

// 3. Crear la Unión Discriminada
//    Parte para eventos CON payload
export type MessageWithPayload = {
  [K in KeysWithPayload<EventPayloadMap>]: {
    type: K;
    payload: EventPayloadMap[K]; // Payload es requerido
  }
}[KeysWithPayload<EventPayloadMap>];

//    Parte para eventos SIN payload
type MessageWithoutPayload = {
  [K in KeysWithoutPayload<EventPayloadMap>]: {
    type: K;
    payload?: never; // Payload es opcional y 'undefined' o 'never'
  }
}[KeysWithoutPayload<EventPayloadMap>];

//    Combinar ambas partes en el tipo final
export type CrossAppMessage = MessageWithPayload | MessageWithoutPayload;
