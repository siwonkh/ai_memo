<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let suggestions: Suggestion[] = []

const dispatch = createEventDispatcher();

function handleSuggest(suggestion: Suggestion) {
	dispatch('suggest', { text: suggestion.text });
}
</script>

{#if suggestions.length}
	<h5 class="text-white font-bold">추천</h5>
	<div class="flex flex-col space-y-3 overflow-y-scroll">
	{#each suggestions as suggestion}
		<button on:click={() => {handleSuggest(suggestion)}} class="text-xs p-2 py-3 rounded-full border-1 border-stone-500 bg-white text-black">{suggestion.text}</button>
	{/each}
	</div>
{:else}
	<div></div>
{/if}
