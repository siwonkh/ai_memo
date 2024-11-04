<script lang="ts">
	import { fly } from 'svelte/transition';
	import { useTodos } from '$lib/use-todos';
	import TodoItem from '@components/todo/todo-item.svelte';
	import TodoForm from '@components/todo/todo-form.svelte';

	const todos = useTodos();
</script>

<div class="px-4 min-h-screen" in:fly={{ x: -100, duration: 500 }} out:fly={{ x: -100, duration: 100 }}>
	<header class="py-3 flex justify-between" in:fly={{ x: -50, duration: 500, delay: 50 }}>
		<button class="p-1 text-stone-500"></button>
		<a href="/memo" class="p-1 text-stone-500">Memo →</a>
	</header>
	<div class="py-4">
		<h1 class="text-3xl font-bold">Todo</h1>
	</div>
	{#if $todos?.length}
		<div
			class="grid grid-cols-[auto,auto,auto,auto] gap-3 justify-items-start"
		>
			{#each $todos || [] as todo (todo.id)}
				<TodoItem {todo} />
			{/each}
		</div>
	{:else}
		<p><b>Add your first todo item!</b></p>
	{/if}
</div>

<TodoForm />
