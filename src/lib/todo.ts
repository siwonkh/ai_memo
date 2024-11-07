import {
	collection,
	getDocs,
	type Firestore
} from "firebase/firestore/lite";

export const getTodos = async (serverDB: Firestore) => {
	const todosSnap = await getDocs(collection(serverDB, '/todos'));

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
