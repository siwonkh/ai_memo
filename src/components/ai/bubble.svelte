<script>
	import {Spinner} from "flowbite-svelte";

	export let content;
	export let role;
</script>

<!--<div class={`${role !== 'user' ? 'fade-in' : ''} max-w-xs px-3 p-2 rounded-lg ${role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}>-->
<!--	{content}-->
<!--</div>-->
<div class={`bubble ${role === 'user' ? 'user' : 'ai'}`}>
	{content}
	{#if role === 'loading'}
		<Spinner size={4} color="gray" />
	{/if}
</div>

<style>
    .bubble {
        max-width: 70%;
        padding: 0.8rem 1rem;
        margin: 0.2rem 0;
        border-radius: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        font-size: 0.9rem;
        line-height: 1.4;
        word-wrap: break-word;
    }

    /* 사용자 말풍선 */
    .bubble.user {
        background: #f1f3f5;
        color: #333;
        align-self: flex-end;
        text-align: right;
    }

    /* AI 말풍선 */
    .bubble.ai {
        background: linear-gradient(135deg, #6b73ff, #9b5cff);
        color: white;
        align-self: flex-start;
        text-align: left;
    }

    /* 애니메이션 효과 */
    .fade-in {
        animation: fadeIn 0.4s ease-in-out forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(7px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
