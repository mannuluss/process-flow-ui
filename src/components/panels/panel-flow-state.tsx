import { Panel } from "@xyflow/react";

import "./panel-flow-state.scss";
import AddNodeButton from "./add-node/add-node.component";

export default function PanelFlowState() {
  return (
    <Panel position="top-right">
      <div className="panel-container">
        <AddNodeButton />
      </div>
    </Panel>
  );
}
