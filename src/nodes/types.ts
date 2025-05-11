import type { Node, BuiltInNode } from "@xyflow/react";

export type CustomNodeEnd = Node<{ label: string; metadata?: any }, "end">;
export type CustomNodeStart = Node<
  {
    label: string; //nombre del nodo que se muestra en la interfaz
    initial: boolean; // indica si el nodo es el inicial
    end: boolean;   // indica si el nodo es el final
    metadata?: any; // informacion adicional del nodo que le da sus caracteristicas
  },
  "start"
>;
export type AppNode = BuiltInNode | CustomNodeEnd | CustomNodeStart;
