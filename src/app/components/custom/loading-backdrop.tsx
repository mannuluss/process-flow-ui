import React from 'react';
import { useAppSelector } from 'src/store/store';

import GradientCircularProgress from './circular-gradiant'; // Assuming GradientCircularProgress is in the same folder or adjust path

const LoadingBackdrop: React.FC = () => {
  const loading = useAppSelector(state => state.config.loading);

  if (!loading.open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
      }}
    >
      <GradientCircularProgress />
      {loading.message && (
        <div style={{ marginTop: 20, color: '#fff' }}>{loading.message}</div>
      )}
    </div>
  );
};

export default LoadingBackdrop;
