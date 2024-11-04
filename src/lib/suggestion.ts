import { collection, type Firestore, getDocs } from "firebase/firestore";

export const getSuggestions = async (serverDB: Firestore) => {
  const suggestionSnap = await getDocs(collection(serverDB, "/suggestions"));

  if (suggestionSnap.empty) {
    throw "Documents not exist!";
  }

  const suggestions: Suggestion[] = suggestionSnap.docs.map((doc) => ({
    ...(doc.data() as Suggestion),
  }));

	return suggestions.sort(() => Math.random() - 0.5).slice(0, 3);
};