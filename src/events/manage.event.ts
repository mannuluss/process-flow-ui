import { Edge } from "@xyflow/react";
import { AppNode } from "../nodes/types";

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

export type MessageEventFlowApp = MessageEvent<{
  type: EventFlowTypes;
  nodes?: AppNode[];
  conections?: Edge[];
  actions: any[];
}>;

const mapEventFlow: Map<EventFlowTypes, (event: MessageEventFlowApp) => void> =
  new Map();
// el evento que es llamado desde afuera por la pagina que esta enveviendo el iframe
// window.parent.postMessage({ type: "DATA", data: "Hola desde el iframe" }, "*");
window.addEventListener("message", (event) => {
  if (event.data?.type && mapEventFlow.get(event.data.type)) {
    console.log("[Event graph] ", event.data.type);
    mapEventFlow.get(event.data.type)(event);
  }
});

export function addEventData(
  type: EventFlowTypes,
  callback: (event: MessageEventFlowApp) => void
) {
  console.log("[ADD Event] addEventData", type);
  mapEventFlow.set(type, callback);
}
