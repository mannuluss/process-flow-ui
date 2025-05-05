export enum EventFlowTypes {
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

export type TypeEventCrossApp = keyof typeof EventFlowTypes;

export interface CrossAppMessage<T = any> {
  type: TypeEventCrossApp; // Identificador único del tipo de mensaje. Ej: 'LOAD_DATA', 'NODE_CLICKED'
  payload?: T; // Los datos asociados al mensaje
}
