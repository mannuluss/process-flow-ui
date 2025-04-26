import type { Node, BuiltInNode } from "@xyflow/react";

export type CustomNodeEnd = Node<{ label: string }, "end">;
export type CustomNodeStart = Node<{ label: string }, "start">;
export type AppNode = BuiltInNode | CustomNodeEnd | CustomNodeStart;
