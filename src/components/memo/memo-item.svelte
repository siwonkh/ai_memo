<script lang="ts">
	import { goto } from '$app/navigation';
	import {tick} from "svelte";

	export let memo: Memo;

	// const date = memo.createdAt;
	const date = memo.updatedAt;

	let formattedDate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;

	const goToMemo = async () => {
		await goto(`/memo/${memo.id}`)
		await tick()
	};
</script>

<button type="button" class="w-full p-2 text-left bg-white" on:click={goToMemo}>
	<div class="font-bold mb-1">{memo.title}</div>
	<div class="flex text-sm text-gray-500 mb-1 space-x-3">
		<span>{formattedDate}</span>
		<span class="truncate">{memo.text}</span>
	</div>
</button>
