import { insertPlanSchema } from "@/server/db/schema";

export const selectPlanFormSchema = insertPlanSchema.pick({
  type: true,
});
