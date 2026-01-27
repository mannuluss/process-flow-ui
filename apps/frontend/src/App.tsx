import '@xyflow/react/dist/style.css';
import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { designSystem } from './theme/designSystem';

export default function App() {
  return (
    <ConfigProvider theme={designSystem}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}
