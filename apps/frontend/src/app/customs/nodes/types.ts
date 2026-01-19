import type { BuiltInNode, Node } from '@xyflow/react';
import type { NodeHandler } from '@process-flow/common';

export type CustomNodeApp = Node<{
  label: string; //nombre del nodo que se muestra en la interfaz
  code?: string; // código/ID del estado (ej: de DS_STATUS)
  icon?: string; // nombre del icono de Material Design
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

/**
 * Nodo inicial del workflow.
 * Es el punto de entrada y determina hacia dónde ir según el trigger.
 */
export type InitialCustomNode = Node<
  {
    handlers?: NodeHandler[]; // handlers que determinan el path inicial
  },
  'initial'
>;

export type AppNode = ProcesoCustomNode | InitialCustomNode | BuiltInNode;
