CREATE TYPE "public"."plan_type" AS ENUM('basic', 'pro');--> statement-breakpoint
CREATE TABLE "plan" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "plan_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"nano_id" varchar(11) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"type" "plan_type" NOT NULL,
	"user_id" bigint NOT NULL,
	CONSTRAINT "plan_nano_id_unique" UNIQUE("nano_id")
);
--> statement-breakpoint
ALTER TABLE "bug" ALTER COLUMN "description" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "plan" ADD CONSTRAINT "plan_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "plan_nano_id_idx" ON "plan" USING btree ("nano_id");--> statement-breakpoint
CREATE INDEX "plan_user_id_idx" ON "plan" USING btree ("user_id");