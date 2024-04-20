import { error, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async (p) => {
	const userId = p.params.id
	const [users, err] = await p.locals.db.getUsers('where id = ' + userId)
	if (err) {
		return error(500, { ...err })
	}
	const user = users[0]
	return {
		user
	}
}

export const actions = {
	default: async ({ request, locals, params }) => {
		const userId = params.id
		const [users] = await locals.db.getUsers()
		const formData = await request.formData()
		const amount = Number(formData.get('amount'))
		const accountTo = Number(formData.get('to-account'))
		const user = users?.find((u) => u.id == userId)
		if (!user) {
			return fail(400, { message: 'user not found' })
		}
		const result = await locals.db.updateUser({ ...user, credit: user.credit - amount })
		console.debug({ amount, accountTo, userId, result, user })
	}
} satisfies Actions
