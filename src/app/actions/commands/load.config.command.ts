import { CommandHandler } from 'src/exported-types';

export const loadDataCommand: CommandHandler = (context) => {
  context.state.setNodes(context.object?.nodes ?? []);
  context.state.setEdges(context.object?.connections ?? []);
};
