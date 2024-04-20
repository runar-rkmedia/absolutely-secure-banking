import type db from '$lib/server/db'
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: NonNullable<Awaited<ReturnType<typeof db>>>
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { }
