import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()

		const username = formData.get('username')?.toString()
		const password = formData.get('password')?.toString()
		if (!username || !password) {
			return fail(400, { message: 'username password required' })
		}

		const [user, errv] = await locals.db.login(username, password)
		if (errv) {
			return fail(400, { message: errv.message })
		}

		if (!user) {
			return fail(400, { message: 'Username/password not found' })
		}
		redirect(302, '/account/' + user.id)
	}
} satisfies Actions
