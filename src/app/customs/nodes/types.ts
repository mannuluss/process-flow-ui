import type { Node, BuiltInNode } from "@xyflow/react";

export type CustomNodeApp = Node<{
  label: string; //nombre del nodo que se muestra en la interfaz
  initial?: boolean; // indica si el nodo es el inicial
  end?: boolean; // indica si el nodo es el final
}>;

export type ProcesoCustomNode = Node<
  {
    metadata?: any; // informacion adicional del nodo que le da sus caracteristicas
  },
  "proceso"
> &
  CustomNodeApp;

export type AppNode = ProcesoCustomNode | BuiltInNode;
