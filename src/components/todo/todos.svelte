<script lang="ts">
	import { fly } from 'svelte/transition';
	import { useTodos } from '$lib/use-todos';
	import TodoItem from '@components/todo/todo-item.svelte';
	import { useAddTodo } from '$lib/use-todos';
	import {Dropdown, DropdownItem} from "flowbite-svelte";
	import {DotsVerticalOutline, UndoOutline} from "flowbite-svelte-icons";

	const { addTodo } = useAddTodo();
	let text = "";

	export let todosExp: Todo[];

	let openInput = false;
	let loading = false;
	let loadingError = false;

	const todos = useTodos(todosExp);

	let recommendations: Recommendation[] = [];

	function resetRecommendations() {
		recommendations = [];
	}

	$: if (!loading && $todos && $todos.filter(todo => !todo.complete).length !== recommendations.length) {
		resetRecommendations();
	}

	async function getRecommendations() {
		loading = true;
		recommendations = [];
		const recs = [];
		for (const todo of $todos || []) {
			if (!todo.complete) {
				const recommendation = await getRecommendation(todo.text);
				recs.push(recommendation);
			}
			recommendations = recs;
		}
		loading = false;
	}

	async function getRecommendation(todoText: string) {
		try {
			const response = await fetch('/api/prompt/todo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ conversation: [{ role: 'user', content: todoText }] })
			});

			const data = await response.json();
			if (response.status !== 200) {
				throw data.error || new Error(`Request failed with status ${response.status}`);
			}

			return data.result;

		} catch (error) {
			loadingError = true;
			console.error(error);
			return {
				toolName: "",
				description: "",
				functions: "",
				website: "",
				whyRecommend: "",
			}
		}
	}

	function add() {
		openInput = false;
		addTodo(text);
		text = "";
	}
</script>

<div class="fixed w-full flex flex-col pb-0 min-h-screen h-screen">
	<div class="px-4">
		<div class="py-3 flex justify-between">
			<a href="/memo" class="p-1 text-stone-500" in:fly={{ x: 50, duration: 500, delay: 50 }}>← Home</a>
<!--			<a href="/memo" class="p-1 text-stone-500">Memo →</a>-->
			<div class="flex space-x-6">
				<div class="spinner-wrapper">
					<button on:click={getRecommendations} class={`${loading ? "ai-button-pulse" : ""} ai-button w-7 h-7 p-1 block rounded-full text-sm font-bold shadow-lg transition-all duration-200 ease-in-out`} type="button">
						AI
					</button>
					{#if loading}
						<div class={`${loadingError ? "loader-err" : "loader"}`}></div>
					{/if}
				</div>
				<div class="block m-auto">
					<DotsVerticalOutline class="dots-menu w-7 h-7 focus:ring-0 focus:outline-0 active:bg-gray-200 rounded-full" />
					<Dropdown triggeredBy=".dots-menu">
						<DropdownItem on:click={resetRecommendations}>
							<div class="flex space-x-2">
								<UndoOutline/>
								<span>Reset</span>
							</div>
						</DropdownItem>
					</Dropdown>
				</div>
			</div>
		</div>
		<div class="py-4">
			<h1 class="text-3xl font-bold">Todo</h1>
		</div>
		{#if $todos?.length}
			<div class="flex flex-col justify-items-start">
				{#each ($todos || []).filter(todo => !todo.complete) as todo, index (todo.id)}
					<TodoItem {todo} recommendation={recommendations[index] || null} />
				{/each}
			</div>
			{#if ($todos || []).filter(todo => todo.complete).length}
			<h1 class="pt-5 text-gray-700">완료됨</h1>
			<div class="flex flex-col justify-items-start">
				{#each ($todos || []).filter(todo => todo.complete) as todo, index (todo.id)}
					<TodoItem {todo} recommendation={null} />
				{/each}
			</div>
			{/if}
		{:else}
			<p><b>Todo를 추가해주세요!</b></p>
		{/if}
	</div>
	{#if openInput}
		<div class="w-full">
			<form class="fixed flex bottom-0 w-full border p-2 mb-5 rounded-lg shadow" on:submit|preventDefault={add}>
				<input class="w-full p-2 bg-white ring-0 focus:outline-none focus:ring-0" bind:value={text} />
				<button class="p-2 font-semibold" type="submit">
					Add
				</button>
			</form>
		</div>
	{:else}
		<button on:click={() => {openInput = true}} class="w-14 h-14 fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-3 rounded-full shadow-lg">
			+
		</button>
	{/if}

</div>

<style>
	.ai-button {
		background: linear-gradient(135deg, #6b73ff, #9b5cff);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		border: none;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
		z-index: 2;
	}

	.ai-button-pulse {
		animation: pulse 1s infinite ease-in-out;
	}

	.ai-button:active {
		transform: scale(0.95);
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	.spinner-wrapper {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.loader {
		z-index: 1;
	}

	.loader-err::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 10px;
		height: 10px;
		background-color: rgba(255, 0, 0, 0.8);
		border-radius: 50%;
		transform: translate(-50%, -50%) scale(1);
		animation: ripple 1s infinite ease-out;
	}

	.loader::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 10px;
		height: 10px;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 50%;
		transform: translate(-50%, -50%) scale(1);
		animation: ripple 1s infinite ease-out;
	}

	@keyframes ripple {
		0% {
			transform: translate(-50%, -50%) scale(3);
			opacity: 0.6;
		}
		100% {
			transform: translate(-50%, -50%) scale(6);
			opacity: 0;
		}
	}
</style>
