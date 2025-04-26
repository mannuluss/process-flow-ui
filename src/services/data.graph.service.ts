import axios from "axios";
import { AppNode } from "../nodes/types";
import { Edge } from "reactflow";

export interface GraphProcess {
  nodes: AppNode[];
  conections: Edge[];
}

export function getDataGraph() {
  //return fetch("node.json");
  return axios.get<GraphProcess>("example-config.json");
}