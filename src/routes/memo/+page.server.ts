import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getMemos } from '$lib/memo';

export const load: PageServerLoad = (async ({
																							locals: { firebase: { serverDB, serverAuth } }
																						}) => {
	const user = serverAuth?.currentUser;

	if (!user) {
		throw redirect(302, '/');
	}

	return {
		memos: await getMemos(serverDB, user)
	};
}) satisfies PageServerLoad;
