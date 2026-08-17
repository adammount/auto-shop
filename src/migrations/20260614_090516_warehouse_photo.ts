import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TYPE "public"."enum_orders_delivery" AS ENUM('pickup', 'courier', 'transport');
  CREATE TYPE "public"."enum_orders_contact_method" AS ENUM('call', 'whatsapp', 'email');
  ALTER TABLE "orders" ADD COLUMN "delivery" "enum_orders_delivery";
  ALTER TABLE "orders" ADD COLUMN "contact_method" "enum_orders_contact_method";
  ALTER TABLE "site_settings" ADD COLUMN "warehouse_photo_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "warehouse_photo_url" varchar;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_warehouse_photo_id_media_id_fk" FOREIGN KEY ("warehouse_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_warehouse_photo_idx" ON "site_settings" USING btree ("warehouse_photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_warehouse_photo_id_media_id_fk";
  
  DROP INDEX "site_settings_warehouse_photo_idx";
  ALTER TABLE "orders" DROP COLUMN "delivery";
  ALTER TABLE "orders" DROP COLUMN "contact_method";
  ALTER TABLE "site_settings" DROP COLUMN "warehouse_photo_id";
  ALTER TABLE "site_settings" DROP COLUMN "warehouse_photo_url";
  DROP TYPE "public"."enum_orders_delivery";
  DROP TYPE "public"."enum_orders_contact_method";`)
}
