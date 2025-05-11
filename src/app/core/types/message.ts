import { Connection, Edge } from "@xyflow/react";
import { AppNode } from "../../../nodes/types";
import { ConfigStateReduxApp } from "../../../store/configSlice";

export enum EventFlowTypes {
  //graph
  CONFIG_APP = "CONFIG_APP",
  /**
   * Evento emitido cuando se da click en la accion de guardar el grafo.
   * @param {GraphData} payload - Objeto que representa el grafo a guardar
   */
  SAVE_GRAPH = "SAVE_GRAPH",
  
  LOAD_DATA = "LOAD_DATA",
  /**Evento emitido cuando se da click en la accion de crear nodo (aqui no se ha agregado el nodo a la interfaz) */
  CREATE_NODE = "CREATE_NODE",
  /**
   * Se le indica al flujo que se debe agregar un nuevo nodo a la interfaz
   * @param {AppNode} payload - Objeto que representa el nodo a agregar
   */
  ADD_NODE = "ADD_NODE",
  UPDATE_NODE = "UPDATE_NODE",
  SELECT_NODE = "SELECT_NODE",
  /**
   * Se le indica al flujo que se debe eliminar un nodo de la interfaz
   * @param {AppNode} payload - Objeto que representa el nodo a eliminar
   */
  DELETE_NODE = "DELETE_NODE",
  //========================= edges =========================

  /**
   * Evento emitido cuando se da click en la accion de crear edge (aqui no se ha agregado el edge a la interfaz)
   * @param {Connection} payload - Objeto que representa el edge a agregar
   */
  CREATE_EDGE = "CREATE_EDGE",
  /**
   * Se le indica al flujo que se debe agregar un nuevo edge a la interfaz
   * @param {Connection} payload - Objeto que representa el edge a agregar
   */
  ADD_EDGE = "ADD_EDGE",
  DELETE_EDGE = "DELETE_EDGE",
  UPDATE_EDGE = "UPDATE_EDGE",
  SELECT_EDGE = "SELECT_EDGE",
  /*@deprecated*/
  LOAD_ACTIONS = "LOAD_ACTIONS",
}

//export type TypeEventCrossApp = keyof typeof EventFlowTypes;

// --- Inicio: Definiciones de Payload para cada type de mensaje ---
type AppConfig = ConfigStateReduxApp;
type GraphData = {
  nodes: any[];
  edges: any[] /* ... estructura de datos del grafo ... */;
};
type NewNodePayload = AppNode;
type DeleteNodePayload = any; //TODO definir
type NewEdgePayload = Connection;
type DeleteEdgePayload = Edge;
type UpdateNodePayload = { data: any /* ... datos parciales del nodo ... */ };
type UpdateEdgePayload = Edge;
type SelectNodePayload = AppNode;
type SelectEdgePayload = Edge;
type SaveGraphPayload = { nodes: AppNode[]; conections: Edge[] };
type LoadActionsPayload = {
  actions: any[] /* ... estructura de acciones ... */;
};
// --- Fin: Definiciones de Payload ---

// 1. Mapeo de Tipos de Evento a Tipos de Payload
//    Usa 'never' si un evento no tiene payload.
interface EventPayloadMap {
  [EventFlowTypes.CONFIG_APP]: AppConfig;
  [EventFlowTypes.LOAD_DATA]: GraphData;
  [EventFlowTypes.CREATE_NODE]: NewNodePayload;
  [EventFlowTypes.ADD_NODE]: NewNodePayload;
  [EventFlowTypes.DELETE_NODE]: DeleteNodePayload;
  [EventFlowTypes.CREATE_EDGE]: NewEdgePayload;
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
type KeysWithPayload<T> = {
  [K in keyof T]: T[K] extends never ? never : K;
}[keyof T];
type KeysWithoutPayload<T> = {
  [K in keyof T]: T[K] extends never ? K : never;
}[keyof T];

// 3. Crear la Unión Discriminada
//    Parte para eventos CON payload
export type MessageWithPayload = {
  [K in KeysWithPayload<EventPayloadMap>]: {
    type: K;
    payload: EventPayloadMap[K]; // Payload es requerido
  };
}[KeysWithPayload<EventPayloadMap>];

//    Parte para eventos SIN payload
type MessageWithoutPayload = {
  [K in KeysWithoutPayload<EventPayloadMap>]: {
    type: K;
    payload?: never; // Payload es opcional y 'undefined' o 'never'
  };
}[KeysWithoutPayload<EventPayloadMap>];

//    Combinar ambas partes en el tipo final
export type CrossAppMessage = MessageWithPayload | MessageWithoutPayload;
