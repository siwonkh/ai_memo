<script lang="ts">
	import { useMemos } from '$lib/use-memos';
	import MemoItem from '@components/memo/memo-item.svelte';
	import { goto } from '$app/navigation';
	import { derived, writable } from 'svelte/store';
	import { useAuth } from '$lib/use-user';
	import { fly, fade } from 'svelte/transition'

	const { logout } = useAuth();

	export let memosExported: Memo[];

	const memos = useMemos(memosExported);

	let todayMemos: Memo[] = [];
	let yesterdayMemos: Memo[] = [];
	let otherMemos: Memo[] = [];

	function isToday(date: Date) {
		const today = new Date();
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	}

	function isYesterday(date: Date) {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		return (
			date.getDate() === yesterday.getDate() &&
			date.getMonth() === yesterday.getMonth() &&
			date.getFullYear() === yesterday.getFullYear()
		);
	}

	let search = writable("");

	// 검색어를 기준으로 필터링된 메모 리스트
	const filteredMemos = derived([memos, search], ([$memos, $search]) => {
		if (!$memos) {
			return null;
		}
		if (!$search) {
			todayMemos = $memos.filter(memo => isToday(memo.updatedAt));
			yesterdayMemos = $memos.filter(memo => isYesterday(memo.updatedAt));
			otherMemos = $memos.filter(
				memo => !isToday(memo.updatedAt) && !isYesterday(memo.updatedAt)
			);
			return $memos;
		}
		const memosTemp = $memos.filter(memo => memo.title.toLowerCase().includes($search.toLowerCase()));
		todayMemos = memosTemp.filter(memo => isToday(memo.updatedAt));
		yesterdayMemos = memosTemp.filter(memo => isYesterday(memo.updatedAt));
		otherMemos = memosTemp.filter(
			memo => !isToday(memo.updatedAt) && !isYesterday(memo.updatedAt)
		);
		return memosTemp;
	});

	const addNewMemo = () => {
		setTimeout(() => goto(`/memo/new`), 0);
	};

	const logoutRedirect = async () => {
		await logout();
		setTimeout(() => goto("/"), 0);
	}
</script>

<div class="px-4 min-h-screen" in:fade={{ duration: 300 }}>
	<header class="py-3 flex justify-between">
		<a href="/todo" class="p-1 text-stone-500" in:fly={{ x: 20, duration: 500, delay: 50 }}>← Todo</a>
		<button on:click={logoutRedirect} class="p-1 text-stone-500">Logout →</button>
	</header>
	<div class="py-4">
		<h1 class="text-3xl font-bold">Memo</h1>
	</div>

	<input
		type="text"
		placeholder="검색"
		class="w-full px-2 py-1 bg-stone-200 border rounded-lg border-stone-300 focus:outline-none focus:border-stone-400 focus:ring-0"
		bind:value={$search}
	/>

	{#if $filteredMemos?.length}
		{#if $search}
		<div class="py-4 space-y-2">
			<div class="text-xl font-bold">검색결과</div>
			<div class="flex flex-col items-center px-6 rounded-lg bg-white divide-y">
				{#each $filteredMemos as memo (memo.id)}
				<MemoItem {memo} />
				{/each}
			</div>
		</div>
		{:else}
			{#if todayMemos.length}
				<div class="py-4 space-y-2">
					<div class="text-xl font-bold">오늘</div>
					<div class="flex flex-col items-center px-6 rounded-lg bg-white divide-y">
						{#each todayMemos as memo (memo.id)}
							<MemoItem {memo} />
						{/each}
					</div>
				</div>
			{/if}
			{#if yesterdayMemos.length}
				<div class="py-4 space-y-2">
					<div class="text-xl font-bold">어제</div>
					<div class="flex flex-col items-center px-6 rounded-lg bg-white divide-y">
						{#each yesterdayMemos as memo (memo.id)}
							<MemoItem {memo} />
						{/each}
					</div>
				</div>
			{/if}
			{#if otherMemos.length}
				<div class="py-4 space-y-2">
					<div class="text-xl font-bold">이전</div>
					<div class="flex flex-col items-center px-6 rounded-lg bg-white divide-y">
						{#each otherMemos as memo (memo.id)}
							<MemoItem {memo} />
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	{/if}

	<button on:click={addNewMemo} class="w-14 h-14 fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-3 rounded-full shadow-lg">
		+
	</button>
</div>
