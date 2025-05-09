import { Button } from "@mui/material";
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { sendMessage } from '../../../core/services/message.service'; // Add this
import { EventFlowTypes } from '../../../core/types/message'; // Add this

export default function EditNode() {
    const selectedNode = useSelector((state: RootState) => state.selection.selectedNode);

    const handleEditNode = () => {
        if (selectedNode) {
            sendMessage({
                type: EventFlowTypes.UPDATE_NODE,
                payload: selectedNode,
            });
        }
    };

    return (
        <>
            {selectedNode && (
                <Button onClick={handleEditNode}> {/* Add onClick handler */}
                    Edit Node
                </Button>
            )}
        </>
    )
}