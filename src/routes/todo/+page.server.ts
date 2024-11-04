import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getTodos } from '$lib/todo';

export const load: PageServerLoad = (async ({
																							locals: { firebase: { serverDB, serverAuth } }
																						}) => {
	const user = serverAuth?.currentUser;

	if (!user) {
		throw redirect(300, '/');
	}

	return {
		memos: await getTodos(serverDB)
	};
}) satisfies PageServerLoad;
