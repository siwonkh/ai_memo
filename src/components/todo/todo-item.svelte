<script lang="ts">
	import { useDeleteTodo, useUpdateTodo } from '$lib/use-todos';
	import { TrashBinOutline } from 'flowbite-svelte-icons';
	import { Drawer } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';

	export let todo: Todo;
	export let recommendation: Recommendation | null;

	const { deleteTodo } = useDeleteTodo();
	const { updateTodo } = useUpdateTodo();

	let preColoring = false;

	let hidden8 = true;
	let transitionParamsBottom = {
		y: 320,
		duration: 200,
		easing: sineIn
	};

	function remove() {
		deleteTodo(todo.id);
	}

	function toggleStatus() {
		preColoring = !todo.complete;

		setTimeout(() => {
			preColoring = false;
			updateTodo(todo.id, !todo.complete);
		}, 100);
	}
</script>

<div class="todo-item flex flex-col">
	<div class="flex items-center gap-3">
		<button class={`${todo.complete || preColoring ? "bg-blue-500 border-white border-2 ring-2 ring-blue-500" : ""} my-3 circle border border-gray-400 rounded-full w-5 h-5 flex-shrink-0`} on:click={toggleStatus}></button>
		<div class="flex w-full py-3 border-gray-300 border-b">
			<span class="w-full text-gray-900 text-base">{todo.text}</span>
			{#if todo.complete}
				<button class="text-gray-400" on:click={remove}>
					<TrashBinOutline />
				</button>
			{/if}
		</div>
	</div>
	{#if !todo.complete && recommendation}
	<button class="flex w-full ml-7 pt-2 space-x-2" on:click={() => (hidden8 = false)}>
		<svg class="w-5" fill="#000000" viewBox="0 0 512 512" id="icons" xmlns="http://www.w3.org/2000/svg"><path d="M208,512,155.62,372.38,16,320l139.62-52.38L208,128l52.38,139.62L400,320,260.38,372.38Z"/><path d="M88,176,64.43,111.57,0,88,64.43,64.43,88,0l23.57,64.43L176,88l-64.43,23.57Z"/><path d="M400,256l-31.11-80.89L288,144l80.89-31.11L400,32l31.11,80.89L512,144l-80.89,31.11Z"/></svg>
		<span class="text-stone-600">{recommendation.toolName}</span>
	</button>
	{/if}
</div>

{#if !todo.complete && recommendation}
<Drawer class="rounded-t-3xl" placement="bottom" width="w-full" transitionType="fly" transitionParams={transitionParamsBottom} bind:hidden={hidden8} id="sidebar8">
	<div class="flex justify-center">
		<span class="mb-10 w-20 h-1 border-0 border-slate-500 bg-slate-500 rounded-full"></span>
	</div>
	<div class="flex justify-center">
		<img class="w-10 h-10" src="/icon.png" alt="icon" />
	</div>
	<div class="py-3 font-bold">{todo.text} 작업을 할때 유용할 기술로 {recommendation.toolName} 툴을 추천합니다</div>
	<div class="mt-3 text-lg font-bold">{recommendation.toolName}</div>
	<div class="pt-3">
		<div class="font-bold">설명</div>
		<span>{recommendation.description}</span>
	</div>
	<div class="pt-3">
		<div class="font-bold">주요기능</div>
		<span>{recommendation.functions}</span>
	</div>
	<div class="pt-3">
		<span class="font-bold">바로가기:</span>
		<a class=" underline" href={recommendation.website} target="_blank">{recommendation.toolName}</a>
	</div>
	<p class="py-4 mb-6 text-sm text-gray-500">
		{recommendation.whyRecommend}
	</p>
</Drawer>
{/if}
