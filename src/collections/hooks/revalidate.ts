import { revalidateTag } from 'next/cache'
import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook,
	GlobalAfterChangeHook
} from 'payload'

export function makeCollectionRevalidate(tag: string): {
	afterChange: CollectionAfterChangeHook
	afterDelete: CollectionAfterDeleteHook
} {
	const run = (req: { context?: { disableRevalidate?: boolean } }) => {
		if (!req.context?.disableRevalidate) revalidateTag(tag, 'max')
	}

	return {
		afterChange: ({ req }) => run(req),
		afterDelete: ({ req }) => run(req)
	}
}

export function makeGlobalRevalidate(tag: string): GlobalAfterChangeHook {
	return ({ req }) => {
		if (!req.context?.disableRevalidate) revalidateTag(tag, 'max')
	}
}
