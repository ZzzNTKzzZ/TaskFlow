// rule.engine.ts
import { ruleService } from "./rule.service.js";
import { evaluateCondition } from "./condition.evaluator.js";
import { executeAction } from "./action.executor.js";

class RuleEngine {
  async handle(event: string, payload: any) {
    const rules = await ruleService.getRulesByTrigger(event);

    for (const rule of rules) {
      const isValid = evaluateCondition(rule.condition, payload);

      if (!isValid) continue;

      await executeAction(rule.action, payload);
    }
  }
}

export const ruleEngine = new RuleEngine();