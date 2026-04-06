export const removeUndefined = <T extends object>(
  payload: { [K in keyof T]: T[K] | undefined },
) =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
