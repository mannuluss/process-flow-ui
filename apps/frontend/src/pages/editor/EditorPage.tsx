import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from 'antd';
import Canvas from '../../app/canvas/Canvas';
import { useAppDispatch } from '../../store/store';
import { subscribeMenssage } from '../../app/core/services/message.service';
import { EventFlowTypes } from '../../app/core/types/message';
import { setConfig } from '../../store/configSlice';
import { EditorHeader } from '../../features/workflow/components/EditorHeader';
import { WorkflowProvider } from '../../features/workflow/context/WorkflowContext';
import { WorkflowLoader } from '../../features/workflow/components/WorkflowLoader';

const { Content } = Layout;

export default function EditorPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Existing subscription logic
    const subscription = subscribeMenssage(
      EventFlowTypes.CONFIG_APP,
      ({ payload }) => {
        dispatch(setConfig(payload));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <WorkflowProvider workflowId={id}>
      <WorkflowLoader>
        <Layout style={{ height: '100vh', overflow: 'hidden' }}>
          <EditorHeader />
          <Content style={{ position: 'relative', flex: 1 }}>
            <Canvas />
          </Content>
        </Layout>
      </WorkflowLoader>
    </WorkflowProvider>
  );
}
