const permissions = {
  create_board: ["OWNER", "ADMIN"],
  delete_board: ["OWNER", "ADMIN"],
  create_list: ["OWNER", "ADMIN", "MEMBER"],
  delete_list: ["OWNER", "ADMIN"],
  create_card: ["OWNER", "ADMIN", "MEMBER"],
  delete_card: ["OWNER", "ADMIN"],
};
export type PermissionAction = keyof typeof permissions
export default permissions;
