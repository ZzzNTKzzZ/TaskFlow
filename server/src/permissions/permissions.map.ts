export const permissions = {
  // workspace
  "workspace:create": ["OWNER"],
  "workspace:delete": ["OWNER"],
  "workspace:update": ["OWNER", "ADMIN"],
  "workspace:invite": ["OWNER", "ADMIN"],
  "workspace:change-role": ["OWNER"],

  // board
  "board:create": ["OWNER", "ADMIN"],
  "board:delete": ["OWNER", "ADMIN"],
  "board:update": ["OWNER", "ADMIN"],
  "board:view": ["OWNER", "ADMIN", "MEMBER", "VIEWER"],

  // list
  "list:create": ["OWNER", "ADMIN", "MEMBER"],
  "list:update": ["OWNER", "ADMIN", "MEMBER"],
  "list:delete": ["OWNER", "ADMIN"],
  "list:reorder": ["OWNER", "ADMIN", "MEMBER"],

  // card
  "card:create": ["OWNER", "ADMIN", "MEMBER"],
  "card:update": ["OWNER", "ADMIN", "MEMBER"],
  "card:delete": ["OWNER", "ADMIN"],
  "card:move": ["OWNER", "ADMIN", "MEMBER"],
  "card:assign": ["OWNER", "ADMIN", "MEMBER"],

  // checklist
  "checklist:create": ["OWNER", "ADMIN", "MEMBER"],
  "checklist:update": ["OWNER", "ADMIN", "MEMBER"],
  "checklist:delete": ["OWNER", "ADMIN"],
  "checklist:item:complete": ["OWNER", "ADMIN", "MEMBER"],

  // comment
  "comment:create": ["OWNER", "ADMIN", "MEMBER"],
  "comment:update-own": ["OWNER", "ADMIN", "MEMBER"],
  "comment:delete-own": ["OWNER", "ADMIN", "MEMBER"],
  "comment:delete-any": ["OWNER", "ADMIN"],

  // automation
  "automation:create": ["OWNER", "ADMIN"],
  "automation:update": ["OWNER", "ADMIN"],
  "automation:delete": ["OWNER"],
};
export type PermissionAction = keyof typeof permissions;
export default permissions;
