import { sendMessage, subscribeMenssage } from '@core/services/message.service';
import { EventFlowTypes } from '@core/types/message';
import { useStore } from '@xyflow/react';
import { useEffect } from 'react';
import { setLoading } from 'src/store/configSlice';
import { useAppDispatch } from 'src/store/store';

/**
 * EventManager component listens for specific events in the application
 * and dispatches actions to update the application state accordingly.
 * It currently listens for loading data events and updates the loading state.
 */
export function EventManager() {
  const nodes = useStore<any[]>(s => s.nodes);
  const edges = useStore(s => s.edges);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sub = subscribeMenssage(EventFlowTypes.LOADING_DATA, state => {
      console.log('EventManager: Loading data', state);
      dispatch(setLoading(state.payload));
    });
    return () => {
      sub.unsubscribe();
    };
  }, [dispatch]);

  // This effect sends the current nodes and edges to the message service
  // whenever they change, allowing other parts of the application to react to these changes.
  useEffect(() => {
    sendMessage({
      type: EventFlowTypes.ALL_DATA,
      payload: {
        nodes,
        connections: edges,
      },
    });
  }, [nodes, edges]);

  // This function is a placeholder for the EventManager logic.
  // It can be expanded to handle various events and manage the event flow in the application.
  // Currently, it does not perform any operations.
  return <></>;
}
