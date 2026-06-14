import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Brands } from '@/collections/brands'
import { Categories } from '@/collections/categories'
import { Media } from '@/collections/media'
import { Orders } from '@/collections/orders'
import { Products } from '@/collections/products'
import { PromoCodes } from '@/collections/promo-codes'
import { Users } from '@/collections/users'
import { Banners } from '@/globals/banners'
import { Reviews } from '@/globals/reviews'
import { SiteSettings } from '@/globals/site-settings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const trustedOrigins = [serverURL]

export default buildConfig({
	serverURL,
	cors: trustedOrigins,
	csrf: trustedOrigins,
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname)
		}
	},
	collections: [Users, Media, Categories, Brands, Products, PromoCodes, Orders],
	globals: [SiteSettings, Reviews, Banners],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || '',
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts')
	},
	db: postgresAdapter({
		pool: {
			connectionString: process.env.DATABASE_URI || ''
		}
	}),
	email: process.env.RESEND_API_KEY
		? resendAdapter({
				defaultFromAddress: process.env.ORDER_EMAIL_FROM || 'noreply@detal.ru',
				defaultFromName: 'Деталь',
				apiKey: process.env.RESEND_API_KEY
			})
		: undefined,
	sharp
})
