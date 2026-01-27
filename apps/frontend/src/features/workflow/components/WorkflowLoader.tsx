import React, { ReactNode } from 'react';
import { Spin, Alert, Flex } from 'antd';
import { useWorkflow } from '../context/WorkflowContext';

interface WorkflowLoaderProps {
  children: ReactNode;
}

/**
 * Componente que muestra el estado de carga del workflow como overlay.
 * Siempre renderiza los children para que el Canvas se monte y ejecute useWorkflowLoad.
 */
export const WorkflowLoader: React.FC<WorkflowLoaderProps> = ({ children }) => {
  const { isLoading, error } = useWorkflow();

  return (
    <>
      {/* Siempre renderizar children para que Canvas se monte */}
      {children}

      {/* Overlay de loading */}
      {isLoading && (
        <Flex
          align="center"
          justify="center"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(113, 113, 113, 0.17)',
            zIndex: 1000,
          }}
        >
          <Spin size="large" tip="Cargando workflow..." />
        </Flex>
      )}

      {/* Overlay de error */}
      {error && (
        <Flex
          align="center"
          justify="center"
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            zIndex: 1000,
            padding: 24,
          }}
        >
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ maxWidth: 500 }}
          />
        </Flex>
      )}
    </>
  );
};
