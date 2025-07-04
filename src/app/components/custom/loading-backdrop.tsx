import Backdrop from '@mui/material/Backdrop';
import React from 'react';
import { useAppSelector } from 'src/store/store';

import GradientCircularProgress from './circular-gradiant'; // Assuming GradientCircularProgress is in the same folder or adjust path

const LoadingBackdrop: React.FC = () => {
  const loading = useAppSelector(state => state.config.loading);
  return (
    <Backdrop
      sx={theme => ({
        color: '#fff',
        zIndex: theme.zIndex.drawer + 9999,
        flexDirection: 'column',
      })}
      open={loading.open}
    >
      <GradientCircularProgress color="primary" />
      {loading.message && (
        <div style={{ marginTop: 20, color: '#fff' }}>{loading.message}</div>
      )}
    </Backdrop>
  );
};

export default LoadingBackdrop;
