// See https://kit.svelte.dev/docs/types#app

import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore/lite";

// for information about these interfaces
declare global {

	type UserType = {
		displayName: string | null
		photoURL: string | null;
		uid: string;
		email: string | null;
	};

	type Todo = {
		id: string;
		uid: string;
		text: string;
		complete: boolean;
		createdAt: Date;
	};

	type Memo = {
		id: string;
		uid: string;
		title: string;
		text: string;
		createdAt: Date;
		updatedAt: Date;
	}

	type Suggestion = {
		text: string;
	};

	type Recommendation = {
		toolName: string;
		description: string;
		functions: string;
		website: string;
		whyRecommend: string;
	}
	
	namespace App {
		// interface Error {}
		interface Locals {
			firebase: {
				serverDB: Firestore,
				serverAuth: Auth | null
			};			
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
