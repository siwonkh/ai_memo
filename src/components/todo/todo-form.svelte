<script lang="ts">
	import { useGenerateText, useAddTodo } from '$lib/use-todos';

	const { generateText } = useGenerateText();

	let text = generateText();

	const { addTodo } = useAddTodo();

	function add() {
		addTodo(text);
		text = generateText();
	}
</script>

<form class="fixed flex bottom-0 w-full border border-3 border-gray-500 p-2 mb-5 rounded-lg shadow" on:submit|preventDefault={add}>
	<input class="w-full p-2 bg-white ring-0 focus:outline-none focus:ring-0" bind:value={text} />
	<button class="p-2 font-semibold" type="submit">
		Add
	</button>
</form>
