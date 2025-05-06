import "@xyflow/react/dist/style.css";
import Canvas from "./components/canvas/Canvas";
import { useAppDispatch } from "./store/store";
import { useEffect } from "react";
import { subscribeMenssage } from "./core/services/message.service";
import { EventFlowTypes } from "./core/types/message";
import { setConfig } from "./store/configSlice";

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
