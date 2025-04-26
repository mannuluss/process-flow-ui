import { Handle, Position, type NodeProps } from "@xyflow/react";
import { AppNode } from "./types";

export function StartNode({
  // positionAbsoluteX,
  // positionAbsoluteY,
  data,
}: NodeProps<AppNode>) {
  // const x = `${Math.round(positionAbsoluteX)}px`;
  // const y = `${Math.round(positionAbsoluteY)}px`;

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div
      className="react-flow__node-default"
      style={{ backgroundColor: "#4fcf4f" }}
    >
      {data.label && <div>{data.label}</div>}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
