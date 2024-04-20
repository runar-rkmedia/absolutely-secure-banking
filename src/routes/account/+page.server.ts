import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (p) => {
	const [users] = await p.locals.db.getUsers();

	return {
		users
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const username = formData.get('username')?.toString();
		const password = formData.get('password')?.toString();
		if (!username || !password) {
			return fail(400, { message: 'missing fields' });
		}
		await locals.db.inserUser({ username, password, credit: 0 });
	}
} satisfies Actions;
