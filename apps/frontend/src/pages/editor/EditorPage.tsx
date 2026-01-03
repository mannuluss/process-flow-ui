import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Canvas from '../../app/canvas/Canvas';
import { useAppDispatch } from '../../store/store';
import { subscribeMenssage } from '../../app/core/services/message.service';
import { EventFlowTypes } from '../../app/core/types/message';
import { setConfig } from '../../store/configSlice';
import { Box } from '@mui/material';

export default function EditorPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // TODO: Load flow by ID
    console.log('Loading flow:', id);

    // Existing subscription logic
    const unsubscribe = subscribeMenssage(
      EventFlowTypes.CONFIG_APP,
      ({ payload }) => {
        dispatch(setConfig(payload));
      }
    );

    return () => {
      // TODO: Implement unsubscribe if subscribeMenssage returns one,
      // or if the service handles it differently.
    };
  }, [dispatch, id]);

  return (
    <Box sx={{ width: '100vw', height: '100vh' }}>
      <Canvas />
    </Box>
  );
}
