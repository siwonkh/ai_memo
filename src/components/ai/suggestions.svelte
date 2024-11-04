<script lang="ts">
import SuggestionItem from '@components/ai/suggestion-item.svelte';
import { createEventDispatcher } from 'svelte';

export let suggestions: Suggestion[] = []

const dispatch = createEventDispatcher();

function handleSuggest(suggestion: Suggestion) {
	console.log('dispatch')
	dispatch('suggest', { text: suggestion.text });
}
</script>

{#if suggestions.length}
	<h5 class="text-white font-bold">추천</h5>
	<div class="flex flex-col space-y-3 overflow-y-scroll">
	{#each suggestions as suggestion}
		<SuggestionItem on:click={() => {handleSuggest(suggestion)}} text={suggestion.text} />
	{/each}
	</div>
{:else}
	<div></div>
{/if}
