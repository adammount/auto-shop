import * as migration_20260612_174110_initial from './20260612_174110_initial'
import * as migration_20260612_190641_image_url_fields from './20260612_190641_image_url_fields'
import * as migration_20260614_090516_warehouse_photo from './20260614_090516_warehouse_photo'
import * as migration_20260616_141532_is_popular from './20260616_141532_is_popular'

export const migrations = [
	{
		up: migration_20260612_174110_initial.up,
		down: migration_20260612_174110_initial.down,
		name: '20260612_174110_initial'
	},
	{
		up: migration_20260612_190641_image_url_fields.up,
		down: migration_20260612_190641_image_url_fields.down,
		name: '20260612_190641_image_url_fields'
	},
	{
		up: migration_20260614_090516_warehouse_photo.up,
		down: migration_20260614_090516_warehouse_photo.down,
		name: '20260614_090516_warehouse_photo'
	},
	{
		up: migration_20260616_141532_is_popular.up,
		down: migration_20260616_141532_is_popular.down,
		name: '20260616_141532_is_popular'
	}
]
