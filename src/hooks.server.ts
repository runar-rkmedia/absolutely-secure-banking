import db from '$lib/server/db'
import type { Handle } from '@sveltejs/kit'
import { nanoid } from 'nanoid'

const createId = (prefix: string) => prefix + nanoid(12)

export const handle: Handle = async ({ event, resolve }) => {
	const cookieScope = event.cookies.get('scope')
	let scope = event.url.searchParams.get('scope') || cookieScope || createId('scope')
	if (scope === 'random') {
		scope = createId('scope')
	}
	if (!event.cookies.get('scope') || event.cookies.get('scope') !== scope) {
		event.cookies.set('scope', scope, { path: '/' })
	}
	event.locals.db = await db(scope)

	const response = await resolve(event)
	return response
}
