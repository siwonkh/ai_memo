import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getTodos } from '$lib/todo';

export const load: PageServerLoad = (async ({
																							locals: { firebase: { serverDB, serverAuth } }
																						}) => {
	const user = serverAuth?.currentUser;

	if (!user) {
		throw redirect(302, '/');
	}

	return {
		todos: await getTodos(serverDB, user)
	};
}) satisfies PageServerLoad;
