import {
	collection,
	getDocs,
	type Firestore
} from "firebase/firestore/lite";

export const getTodos = async (serverDB: Firestore) => {
	const todosSnap = await getDocs(collection(serverDB, '/todos'));

	if (todosSnap.empty) {
		throw 'No todos found!';
	}

	const todos: Todo[] = todosSnap.docs.map(doc => ({
		...(doc.data() as Todo),
		createdAt: doc.data().createdAt.toDate()
	}));

	return todos;
};
