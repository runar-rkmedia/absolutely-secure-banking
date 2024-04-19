import type { Actions } from './$types';

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
	}
} satisfies Actions;
