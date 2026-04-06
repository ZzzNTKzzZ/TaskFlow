import { createTodoAction } from "./actions/create-todo.action";
import { assignUserAction } from "./actions/assign-user.action";

const ACTION_MAP = {
  create_todo: createTodoAction,
  assign_user: assignUserAction,
};

export async function executeAction(action: any, payload: any) {
  const handler = ACTION_MAP[action.type];

  if (!handler) return;

  await handler(action.data, payload);
}