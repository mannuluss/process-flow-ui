import { Drawer } from 'antd';
import { useAppDispatch, useAppSelector } from 'src/store/store';
import { closeSidePanel } from 'src/store/sidePanelSlice';
import { findPanelDefinition } from './side-panel/registry';

export default function EditorSidePanel(): JSX.Element | null {
  const dispatch = useAppDispatch();
  const sidePanel = useAppSelector(state => (state as any).sidePanel);

  if (!sidePanel?.open || !sidePanel.payload) return null;

  const payload = sidePanel.payload;
  const panelDef = findPanelDefinition(payload);

  if (!panelDef) return null;

  const handleClose = () => dispatch(closeSidePanel());

  const Component = panelDef.component;

  return (
    <Drawer
      title={null}
      placement="right"
      width={400}
      onClose={handleClose}
      open
      destroyOnClose
      styles={{
        body: { padding: 0, overflow: 'hidden' },
        header: { display: 'none' },
      }}
      closeIcon={null}
      mask={false}
    >
      <Component payload={payload} onClose={handleClose} />
    </Drawer>
  );
}
