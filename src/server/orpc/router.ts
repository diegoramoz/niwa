import { os } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/server/db";
import {
  bug as bugTable,
  insertBugSchema,
  insertPlanSchema,
  insertUserSchema,
  insertWidgetSchema,
  plan as planTable,
  user as userTable,
  widget as widgetTable,
} from "@/server/db/schema";

const widgetRouter = {
  create: os.input(insertWidgetSchema).handler(async ({ input }) => {
    const [widget] = await db.insert(widgetTable).values(input).returning();
    if (!widget) {
      throw new Error("Failed to create widget");
    }
    return { widget };
  }),

  list: os.handler(async () => {
    return await db.select().from(widgetTable).orderBy(widgetTable.createdAt);
  }),

  get: os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    const [widget] = await db
      .select()
      .from(widgetTable)
      .where(eq(widgetTable.nanoId, input.id));
    if (!widget) {
      throw new Error("Widget not found");
    }
    return { widget };
  }),
};

const userRouter = {
  create: os
    .input(
      insertUserSchema.omit({ updatedAt: true, createdAt: true, nanoId: true })
    )
    .handler(async ({ input }) => {
      const [user] = await db.insert(userTable).values(input).returning();
      if (!user) {
        throw new Error("Failed to create user");
      }
      return { user };
    }),

  list: os.handler(async () => {
    return await db.select().from(userTable).orderBy(userTable.createdAt);
  }),

  get: os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.nanoId, input.id));
    if (!user) {
      throw new Error("User not found");
    }
    return { user };
  }),
};

const bugRouter = {
  create: os
    .input(insertBugSchema.pick({ title: true, description: true }))
    .handler(async ({ input }) => {
      const [bug] = await db.insert(bugTable).values(input).returning();
      if (!bug) {
        throw new Error("Failed to create bug report");
      }
      return { bug };
    }),
};

const planRouter = {
  create: os
    .input(insertPlanSchema.pick({ type: true, userId: true }))
    .handler(async ({ input }) => {
      const [planRecord] = await db.insert(planTable).values(input).returning();
      if (!planRecord) {
        throw new Error("Failed to create plan");
      }
      return { plan: planRecord };
    }),
};

export const appRouter = {
  widget: widgetRouter,
  user: userRouter,
  bug: bugRouter,
  plan: planRouter,
};

export type AppRouter = typeof appRouter;
