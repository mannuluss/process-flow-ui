import { MenuActionEvent } from "../components/menuContext/interface/contextActionEvent";
import { AppNode } from "../nodes/types";

export default function setInitialCommand(context: MenuActionEvent<AppNode>) {
  let current = context.object;
  current.type = "start";
  current.data = {
    idAnterior: "",
  };
}
