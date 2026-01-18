import type { BuiltInNode, Node } from '@xyflow/react';
import type { NodeHandler } from '@process-flow/common';

export type CustomNodeApp = Node<{
  label: string; //nombre del nodo que se muestra en la interfaz
  initial?: boolean; // indica si el nodo es el inicial
  //end?: boolean; // indica si el nodo es el final
  handlers?: NodeHandler[]; // salidas del nodo
}>;

export type ProcesoCustomNode = Node<
  {
    metadata?: any; // informacion adicional del nodo que le da sus caracteristicas
    handlers?: NodeHandler[]; // salidas del nodo
  },
  'proceso'
> &
  CustomNodeApp;

export type AppNode = ProcesoCustomNode | BuiltInNode;
