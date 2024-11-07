<script>
	import Bubble from '@components/ai/bubble.svelte';
	export let conversation;
</script>


{#each conversation.slice().reverse() as message}
	<Bubble content={message.content} role={message.role} />
{/each}
