import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	getDoc,
	setDoc,
	where,
	QueryDocumentSnapshot,
	type SnapshotOptions,
	Timestamp,
	type PartialWithFieldValue,
	type SetOptions
} from "firebase/firestore";

import { derived, readable, type Readable } from 'svelte/store';
import { useUser } from "./use-user";
import { useFirebase } from "./use-firebase";
import { FirebaseError } from "firebase/app";

const memoConverter = {
	toFirestore(value: PartialWithFieldValue<Memo>, options?: SetOptions) {
		const isMerge = options && 'merge' in options;
		return {
			...value,
			[isMerge ? 'updatedAt' : 'createdAt']: serverTimestamp(),
			...(isMerge ? { updatedAt: serverTimestamp() } : {})
		};
	},
	fromFirestore(
		snapshot: QueryDocumentSnapshot,
		options: SnapshotOptions
	) {
		const data = snapshot.data(options);
		const createdAt = data.createdAt as Timestamp;
		const updatedAt = data.updatedAt as Timestamp;
		return {
			...data,
			id: snapshot.id,
			updatedAt: updatedAt?.toDate() || createdAt.toDate(),
			createdAt: createdAt.toDate()
		} as Memo;
	}
};

// 메모 리스트 가져오기
export const useMemos = (
	memos: Memo[] | null = null
) => {
	const { db } = useFirebase();
	const user = useUser();

	return derived<
		Readable<UserType | null>,
		Memo[] | null
	>(
		user, ($user, set) => {
			if (!$user) {
				set(null);
				return;
			}

			set(memos);

			return onSnapshot(
				query(
					collection(db, 'memos'),
					where('uid', '==', $user.uid),
					orderBy('updatedAt', 'desc')
				).withConverter<Memo>(memoConverter), (q) => {
					set(q.empty ? [] : q.docs.map(doc => doc.data({
						serverTimestamps: 'estimate'
					})));
				});
		}
	);
};

// 메모 추가하기
export const useAddMemo = () => {
		const { db, auth } = useFirebase();

		const addMemo = async (title: string, text: string) => {
				const user = auth.currentUser;
				if (!user) {
					throw 'No user!';
				}
				try {
						await setDoc(doc(collection(db, 'memos'))
								.withConverter(memoConverter), {
								uid: user.uid,
								title,
								text,
							createdAt: serverTimestamp(),
							updatedAt: serverTimestamp()
						});
				} catch (e) {
						if (e instanceof FirebaseError) {
								console.error(e);
								return {
									error: e.message
							};
						}
				}
			};

	return { addMemo };
};

// 특정 메모 아이디의 메모 찾기
// export const useGetMemo = () => {
// 	const { db } = useFirebase();
//
// 	const getMemo = async (id: string): Promise<{ data?: Memo; error?: string }> => {
// 		try {
// 			const docRef = doc(db, "memos", id);
// 			const docSnap = await getDoc(docRef);
//
// 			if (docSnap.exists()) {
// 				// 문서가 존재하면 데이터를 반환
// 				return { data: docSnap.data() as Memo };
// 			} else {
// 				// 문서가 존재하지 않으면 에러 반환
// 				console.warn("No such document!");
// 				return { error: "No such document!" };
// 			}
// 		} catch (e) {
// 			if (e instanceof FirebaseError) {
// 				console.error(e);
// 				return { error: e.message };
// 			}
// 			return { error: "An unknown error occurred" };
// 		}
// 	};
//
// 	return { getMemo };
// };
export const useMemo = (
	memoId: string | null,
	memo: Memo
) => {
	const { db } = useFirebase();
	const user = useUser();

	return derived<
		Readable<UserType | null>,
		Memo
	>(
		user, ($user, set) => {
			if (!$user || !memoId) {
				set(memo);
				return;
			}

			set(memo);

			return onSnapshot(
				doc(db, 'memos', memoId).withConverter<Memo>(memoConverter),
				(docSnap) => {
					if (docSnap.exists()) {
						set(docSnap.data() as Memo);
					} else {
						console.warn("No such document!");
						set(memo);
					}
				}
			);
		}
	);
};

// export const useMemo = (
// 	memoId: string | null
// ): Readable<Memo | null | { error: string }> => {
// 	const { db } = useFirebase();
// 	const user = useUser();
//
// 	return derived<Readable<UserType | null>, Memo | null | { error: string }>(
// 		user,
// 		($user, set) => {
// 			if (!$user || !memoId) {
// 				set(null);
// 				return;
// 			}
//
// 			return onSnapshot(
// 				doc(db, 'memos', memoId).withConverter<Memo>(memoConverter),
// 				(docSnap) => {
// 					if (docSnap.exists()) {
// 						// 문서가 존재하면 데이터를 설정
// 						set(docSnap.data() as Memo);
// 					} else {
// 						// 문서가 존재하지 않으면 null로 설정
// 						console.warn("No such document!");
// 						set(null);
// 					}
// 				},
// 				(error) => {
// 					console.error(error);
// 					set({ error: error.message });
// 				}
// 			);
// 		}
// 	);
// };

// 메모 업데이트하기
export const useUpdateMemo = () => {
	const { db } = useFirebase();

	const updateMemo = async (id: string, newTitle: string, newText: string) => {
		try {
			await setDoc(
				doc(db, 'memos', id),
				{ title: newTitle, text: newText, updatedAt: serverTimestamp() },
				{ merge: true }
			);
		} catch (e) {
			if (e instanceof FirebaseError) {
				console.error(e);
				return {
					error: e.message
				};
			}
		}
	};

	return { updateMemo };
};

// 메모 삭제하기
export const useDeleteMemo = () => {
	const { db } = useFirebase();

	const deleteMemo = async (id: string) => {
		try {
			await deleteDoc(doc(db, 'memos', id));
		} catch (e) {
			if (e instanceof FirebaseError) {
				console.error(e);
				return {
					error: e.message
				};
			}
		}
	};

	return { deleteMemo };
};
