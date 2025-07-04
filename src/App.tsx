import '@xyflow/react/dist/style.css';

import { useEffect } from 'react';

import Canvas from './app/canvas/Canvas';
import { subscribeMenssage } from './app/core/services/message.service';
import { EventFlowTypes } from './app/core/types/message';
import { setConfig } from './store/configSlice';
import { useAppDispatch } from './store/store';

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
