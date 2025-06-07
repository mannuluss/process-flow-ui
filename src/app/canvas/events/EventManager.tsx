import { sendMessage, subscribeMenssage } from "@core/services/message.service";
import { useStore } from "@xyflow/react";
import { useEffect } from "react";
import { EventFlowTypes } from "@core/types/message";
import { setLoading } from "src/store/configSlice";
import { useAppDispatch } from "src/store/store";

/**
 * EventManager component listens for specific events in the application
 * and dispatches actions to update the application state accordingly.
 * It currently listens for loading data events and updates the loading state.
 */
export function EventManager() {
  const nodes = useStore<any[]>((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sub = subscribeMenssage(EventFlowTypes.LOADING_DATA, (state) => {
      console.log("EventManager: Loading data", state);
      dispatch(setLoading(state.payload));
    });
    return () => {
      sub.unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    sendMessage({
      type: EventFlowTypes.ALL_DATA,
      payload: {
        nodes,
        connections: edges,
      },
    });
    dispatch(setLoading({ open: false, message: "" }));
  }, [nodes, edges, dispatch]); //TODO: cambiar de lugar, este boton no deberia ser responsable de esto, sino el canvas o el store

  // This function is a placeholder for the EventManager logic.
  // It can be expanded to handle various events and manage the event flow in the application.
  // Currently, it does not perform any operations.
  return <></>;
}
