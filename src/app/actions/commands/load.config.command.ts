import { CommandHandler } from "@commands/interfaces/command.interfaces";

export const loadDataCommand: CommandHandler = (context) => {
  context.state.setNodes(context.object?.nodes ?? []);
  context.state.setEdges(context.object?.connections ?? []);
  context.state.fitView();
};
