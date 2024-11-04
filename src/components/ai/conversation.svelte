<script>
	import Bubble from '@components/ai/bubble.svelte';
	export let conversation;
</script>

<div class="flex flex-col gap-2">
	{#each conversation.slice().reverse() as message}
		<Bubble content={message.content} role={message.role} />
	{/each}
</div>
