import { Panel } from "@xyflow/react";

import "./panel-flow-state.scss";
import AddNodeButton from "./add-node/add-node.component";
import EditNodeNutton from "./edit-node/edit-node.component";
import EditEdgeButton from "./edit-edge/edit-edge-button.component"; // Add this line

export default function PanelFlowState() {
  return (
    <Panel position="top-right">
      <div className="panel-container">
        <AddNodeButton />
        <EditNodeNutton />
        <EditEdgeButton />
      </div>
    </Panel>
  );
}
