import { prisma } from "../../lib/prisma.js";

class RuleService {
  async getRulesByTrigger(trigger: string) {
    return prisma.automationRule.findMany({
      where: {
        trigger,
      },
    });
  }
}

export const ruleService = new RuleService();