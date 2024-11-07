import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { getMemo } from '$lib/memo';


export const load: PageServerLoad = (async ({
																							params,
																							locals: { firebase: { serverDB, serverAuth } }
																						}) => {
	const user = serverAuth?.currentUser;

	const memoId = params.id;

	if (!user) {
		throw redirect(302, '/');
	}

	if (memoId === "new") {
		const newMemo: Memo = {
			uid: "",
			createdAt: new Date(),
			id: "new",
			text: "",
			title: "",
			updatedAt: new Date()
		}
		return { memo: newMemo };
	}

	const memo = await getMemo(serverDB, user, memoId);

	if (!memo) {
		throw error(404, "No memo found.");
	}

	return { memo };
}) satisfies PageServerLoad;
