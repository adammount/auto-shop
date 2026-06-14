import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TABLE "products_image_urls" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "categories" ADD COLUMN "image_url" varchar;
  ALTER TABLE "banners_slides" ADD COLUMN "image_url" varchar;
  ALTER TABLE "banners_slides" ADD COLUMN "media_label" varchar;
  ALTER TABLE "products_image_urls" ADD CONSTRAINT "products_image_urls_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_image_urls_order_idx" ON "products_image_urls" USING btree ("_order");
  CREATE INDEX "products_image_urls_parent_id_idx" ON "products_image_urls" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   DROP TABLE "products_image_urls" CASCADE;
  ALTER TABLE "categories" DROP COLUMN "image_url";
  ALTER TABLE "banners_slides" DROP COLUMN "image_url";
  ALTER TABLE "banners_slides" DROP COLUMN "media_label";`)
}
