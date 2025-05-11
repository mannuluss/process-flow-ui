import { Button } from "@mui/material";
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { sendMessage } from '@core/services/message.service'; // Add this
import { EventFlowTypes } from '@core/types/message'; // Add this

export default function EditEdgeButton() {
    const selectedEdge = useSelector((state: RootState) => state.selection.selectedEdge);

    const handleEditEdge = () => {
        if (selectedEdge) {
            sendMessage({
                type: EventFlowTypes.UPDATE_EDGE,
                payload: selectedEdge,
            });
        }
    };

    return (
        <>
            {selectedEdge && (
                <Button onClick={handleEditEdge}> {/* Add onClick handler */}
                    Edit Edge
                </Button>
            )}
        </>
    )
}