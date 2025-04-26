import type { Edge, EdgeTypes } from "@xyflow/react";

export const initialEdges: Edge[] = [
  { id: "a->c", source: "1", target: "3", animated: true, label: "conectado" },
  { id: "b->d", source: "1", target: "2", data: { id: 1, algomas: "xd" } },
  { id: "c->d", source: "start", target: "end", animated: true }, //animated es que tiene lineas como animadas
];

export const edgeTypes = {
  // Add your custom edge types here!
} satisfies EdgeTypes;
