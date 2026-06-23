import { createTodoAction } from "./actions/create-todo.action.js";
import { assignUserAction } from "./actions/assign-user.action.js";

const ACTION_MAP: Record<string, Function> = {
  create_todo: createTodoAction,
  assign_user: assignUserAction,
};

export async function executeAction(action: any, payload: any) {
  const handler = ACTION_MAP[action.type];

  if (!handler) return;

  await handler(action.data, payload);
}