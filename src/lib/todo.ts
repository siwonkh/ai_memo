import {
	collection,
	getDocs,
	type Firestore, query, where, orderBy
} from "firebase/firestore/lite";
import type { User } from "firebase/auth";

export const getTodos = async (serverDB: Firestore, user: User) => {
	const todosSnap = await getDocs(
		query(
			collection(serverDB, '/todos'),
			where('uid', '==', user.uid),
			orderBy('createdAt')
		)
	);

	if (todosSnap.empty) {
		return [];
	}

	const todos: Todo[] = todosSnap.docs.map(doc => ({
		...(doc.data() as Todo),
		id: doc.id,
		createdAt: doc.data().createdAt.toDate()
	}));

	return todos;
};
