import { Spin } from 'antd';
import React from 'react';

// From https://github.com/mui/material-ui/issues/9496#issuecomment-959408221
export default function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <Spin size="large" style={{ color: 'url(#my_gradient)' }} />
    </React.Fragment>
  );
}
