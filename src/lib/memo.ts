import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	where,
	type Firestore
} from "firebase/firestore/lite";
import type { User } from 'firebase/auth';

export const getMemos = async (serverDB: Firestore, user: User) => {
	const memosSnap = await getDocs(
		query(
			collection(serverDB, 'memos'),
			where('uid', '==', user.uid),
			orderBy('updatedAt', 'desc')
		)
	);

	if (memosSnap.empty) {
		// throw 'No memos found!';
		return [];
	}

	const memos: Memo[] = memosSnap.docs.map(doc => ({
		...(doc.data() as Memo),
		id: doc.id,
		createdAt: doc.data().createdAt.toDate(),
		updatedAt: doc.data().updatedAt.toDate()
	}));

	return memos;
};

export const getMemo = async (serverDB: Firestore, user: User, memoId: string) => {
	const memoSnap = await getDoc(
		doc(serverDB, `/memos/${memoId}`)
	);

	if (!memoSnap.exists()) {
		// throw 'Memo does not exist!';
		return null;
	}

	if (memoSnap.data().uid !== user.uid) {
		// throw 'Memo does not exist!';
		return null;
	}

	return {
		...(memoSnap.data() as Memo),
		id: memoSnap.id,
		createdAt: memoSnap.data().createdAt.toDate(),
		updatedAt: memoSnap.data().updatedAt.toDate()
	};
};
