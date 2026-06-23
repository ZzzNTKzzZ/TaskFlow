// condition.evaluator.ts
export function evaluateCondition(condition: any, payload: any): boolean {
  if (!condition) return true;

  // ví dụ đơn giản
  if (condition.toListId) {
    return payload.toListId === condition.toListId;
  }

  return true;
}