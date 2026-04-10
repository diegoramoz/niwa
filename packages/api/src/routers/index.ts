import type { RouterClient } from "@orpc/server";
import { db } from "@oss/db";
import {
	address as addressTable,
	bug as bugTable,
	creditCard as creditCardTable,
	insertAddressSchema,
	insertBugSchema,
	insertCreditCardSchema,
	insertInvoiceSchema,
	insertPlanSchema,
	insertUserSchema,
	insertWidgetSchema,
	invoice as invoiceTable,
	plan as planTable,
	user as userTable,
	widget as widgetTable,
} from "@oss/db/schema";
import { extractInvoiceFromOllama } from "@oss/llm/extract";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { protectedProcedure, publicProcedure } from "..";

// export const appRouter = {
// 	healthCheck: publicProcedure.handler(() => {
// 		return "OK";
// 	}),
// 	privateData: protectedProcedure.handler(({ context }) => {
// 		return {
// 			message: "This is private",
// 			user: context.session?.user,
// 		};
// 	}),
// };

const widgetRouter = {
	create: protectedProcedure
		.input(insertWidgetSchema)
		.handler(async ({ input }) => {
			const [widget] = await db.insert(widgetTable).values(input).returning();
			if (!widget) {
				throw new Error("Failed to create widget");
			}
			return { widget };
		}),

	list: publicProcedure.handler(async () => {
		return await db.select().from(widgetTable).orderBy(widgetTable.createdAt);
	}),

	get: publicProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ input }) => {
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
	create: protectedProcedure
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

	list: protectedProcedure.handler(async () => {
		return await db.select().from(userTable).orderBy(userTable.createdAt);
	}),

	get: protectedProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ input }) => {
			const [user] = await db
				.select()
				.from(userTable)
				.where(eq(userTable.nanoId, input.id));
			if (!user) {
				throw new Error("User not found");
			}
			return { user };
		}),

	updateEmail: protectedProcedure
		.input(z.object({ email: z.email() }))
		.handler(async ({ input }) => {
			const [firstUser] = await db.select().from(userTable).limit(1);
			if (!firstUser) {
				throw new Error("No user found");
			}
			const [updated] = await db
				.update(userTable)
				.set({ email: input.email })
				.where(eq(userTable.id, firstUser.id))
				.returning();
			if (!updated) {
				throw new Error("Failed to update email");
			}
			return { user: updated };
		}),
};

const bugRouter = {
	create: protectedProcedure
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
	create: protectedProcedure
		.input(insertPlanSchema.pick({ type: true, userId: true }))
		.handler(async ({ input }) => {
			const [planRecord] = await db.insert(planTable).values(input).returning();
			if (!planRecord) {
				throw new Error("Failed to create plan");
			}
			return { plan: planRecord };
		}),
};

const addressRouter = {
	create: protectedProcedure
		.input(
			insertAddressSchema
				.omit({
					updatedAt: true,
					createdAt: true,
					nanoId: true,
					creditCardId: true,
				})
				.extend({ creditCardNanoId: z.string() })
		)
		.handler(async ({ input }) => {
			const { creditCardNanoId, ...addressData } = input;
			const [card] = await db
				.select({ id: creditCardTable.id })
				.from(creditCardTable)
				.where(eq(creditCardTable.nanoId, creditCardNanoId));
			if (!card) {
				throw new Error("Credit card not found");
			}
			const [addr] = await db
				.insert(addressTable)
				.values({ ...addressData, creditCardId: card.id })
				.returning();
			if (!addr) {
				throw new Error("Failed to save address");
			}
			return { address: addr };
		}),
};

const creditCardRouter = {
	create: protectedProcedure
		.input(
			insertCreditCardSchema.omit({
				updatedAt: true,
				createdAt: true,
				nanoId: true,
			})
		)
		.handler(async ({ input }) => {
			const [card] = await db.insert(creditCardTable).values(input).returning();
			if (!card) {
				throw new Error("Failed to save credit card");
			}
			return { creditCard: card };
		}),

	createWithAddress: protectedProcedure
		.input(
			z.object({
				cardholderName: insertCreditCardSchema.shape.cardholderName,
				lastFourDigits: insertCreditCardSchema.shape.lastFourDigits,
				expiryMonth: insertCreditCardSchema.shape.expiryMonth,
				expiryYear: insertCreditCardSchema.shape.expiryYear,
				brand: insertCreditCardSchema.shape.brand,
				line1: insertAddressSchema.shape.line1,
				line2: insertAddressSchema.shape.line2,
				city: insertAddressSchema.shape.city,
				state: insertAddressSchema.shape.state,
				postalCode: insertAddressSchema.shape.postalCode,
				country: insertAddressSchema.shape.country,
			})
		)
		.handler(async ({ input }) => {
			const { line1, line2, city, state, postalCode, country, ...cardData } =
				input;
			const [card] = await db
				.insert(creditCardTable)
				.values(cardData)
				.returning();
			if (!card) {
				throw new Error("Failed to save credit card");
			}
			const [addr] = await db
				.insert(addressTable)
				.values({
					line1,
					line2,
					city,
					state,
					postalCode,
					country,
					creditCardId: card.id,
				})
				.returning();
			if (!addr) {
				throw new Error("Failed to save address");
			}
			return { creditCard: card, address: addr };
		}),
};

const INVOICE_ACCEPTED_MIME_TYPES = [
	"application/pdf",
	"image/jpeg",
	"image/png",
	"image/webp",
];

const invoiceRouter = {
	extract: protectedProcedure
		.input(z.object({ fileBase64: z.string(), mimeType: z.string() }))
		.handler(async ({ input }) => {
			if (!INVOICE_ACCEPTED_MIME_TYPES.includes(input.mimeType)) {
				throw new Error(
					`Unsupported file type "${input.mimeType}". Accepted: PDF, JPG, PNG, WEBP.`
				);
			}
			const buffer = Buffer.from(input.fileBase64, "base64");
			const extracted = await extractInvoiceFromOllama(buffer, input.mimeType);
			return {
				merchant: extracted.merchant,
				date: extracted.date || new Date().toISOString().slice(0, 10),
				amount: extracted.amount || "0.00",
				currency: extracted.currency || "USD",
				category: extracted.category,
				description: extracted.description,
				tax: extracted.tax || "0.00",
			};
		}),

	create: protectedProcedure
		.input(
			insertInvoiceSchema.omit({
				createdAt: true,
				updatedAt: true,
				nanoId: true,
			})
		)
		.handler(async ({ input }) => {
			try {
				const [record] = await db
					.insert(invoiceTable)
					.values(input)
					.returning();
				if (!record) {
					throw new Error("Failed to create invoice");
				}
				return { invoice: record };
			} catch (error) {
				console.error("Error creating invoice:", error);
			}
		}),

	list: publicProcedure.handler(async () => {
		return await db
			.select()
			.from(invoiceTable)
			.orderBy(desc(invoiceTable.date));
	}),

	update: protectedProcedure
		.input(
			z.object({
				nanoId: z.string(),
				data: insertInvoiceSchema
					.omit({ createdAt: true, updatedAt: true })
					.partial(),
			})
		)
		.handler(async ({ input }) => {
			const [record] = await db
				.update(invoiceTable)
				.set(input.data)
				.where(eq(invoiceTable.nanoId, input.nanoId))
				.returning();
			if (!record) {
				throw new Error("Invoice not found");
			}
			return { invoice: record };
		}),

	delete: protectedProcedure
		.input(z.object({ nanoId: z.string() }))
		.handler(async ({ input }) => {
			const [record] = await db
				.delete(invoiceTable)
				.where(eq(invoiceTable.nanoId, input.nanoId))
				.returning();
			if (!record) {
				throw new Error("Invoice not found");
			}
			return { invoice: record };
		}),
};

export const appRouter = {
	widget: widgetRouter,
	user: userRouter,
	bug: bugRouter,
	plan: planRouter,
	creditCard: creditCardRouter,
	address: addressRouter,
	invoice: invoiceRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
