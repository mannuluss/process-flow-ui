import { CommandHandler } from '@commands/interfaces/command.interfaces';
import { sendMessage } from '@core/services/message.service';
import { EventFlowTypes } from '@core/types/message';
import { MenuActionEventContext } from 'src/app/components/menuContext/interface/contextActionEvent';
import { CustomNodeApp } from 'src/app/customs/nodes/types';

// const strategyInitialNodeOnlyOne = (nodes, evt) => {
//   return nodes.map((n) => {
//     if (n.id !== evt.object.id) {
//       return { ...n, type: "default", initial: false } as any;
//     }
//     return n;
//   });
// };

const updateInitialNodeAndEdges = (
  evt: MenuActionEventContext<CustomNodeApp>,
  isInitial: boolean
) => {
  const node = JSON.parse(JSON.stringify(evt.object)) as any; // Use any for flexibility or a more specific type if possible
  //node.type = newType;
  node.data.initial = isInitial;

  evt.state.updateNode(evt.object.id, node);

  //evt.state.setEdges((eds) => eds.filter((e) => e.target !== evt.object.id));

  sendMessage({
    type: EventFlowTypes.ALL_DATA,
    payload: {
      nodes: evt.state.getNodes(),
      connections: evt.state.getEdges(),
    },
  });
};

export const setInitialNodeCommand: CommandHandler<
  MenuActionEventContext<CustomNodeApp>
> = evt => {
  updateInitialNodeAndEdges(evt, true);
};

export const unSetInitialNodeCommand: CommandHandler<
  MenuActionEventContext<CustomNodeApp>
> = evt => {
  updateInitialNodeAndEdges(evt, false);
};
