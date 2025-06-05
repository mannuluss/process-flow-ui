import "@xyflow/react/dist/style.css";
import Canvas from "./app/canvas/Canvas";
import { useAppDispatch } from "./store/store";
import { useEffect } from "react";
import { subscribeMenssage } from "./app/core/services/message.service";
import { setConfig } from "./store/configSlice";
import { EventFlowTypes } from "./app/core/types/message";

export default function App() {
  const dispatch = useAppDispatch();

  //se suscribe para recibir la configuracion de la app y guardarla en el store
  useEffect(() => {
    subscribeMenssage(EventFlowTypes.CONFIG_APP, ({ payload }) => {
      dispatch(setConfig(payload));
    });
  });
  return <Canvas />;
}
