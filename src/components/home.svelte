<script lang="ts">
	import { useAuth } from '$lib/use-user';
	import Todos from '@components/todo/todos.svelte';
	import Profile from '@components/profile.svelte';
	import { useUser } from '$lib/use-user';
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';
	import Memos from '@components/memo/memos.svelte';

	let show = false;

	export let memos: Memo[];

	// 1초 대기 후 요소 표시
	async function reveal() {
		await tick(); // DOM 업데이트 대기
		setTimeout(() => {
			show = true;
		}, 1000);
	}

	reveal();

	const user = useUser();

	const { loginWithGoogle, logout } = useAuth();
</script>

{#if $user}
	<Memos memosExported={memos} />
<!--	<Profile />-->
<!--	<a href="/memo">TO memo</a>-->
<!--	<button-->
<!--		class="border bg-blue-600 text-white w-fit p-3 rounded-lg font-semibold"-->
<!--		on:click={logout}>Logout</button-->
<!--	>-->
<!--	<hr />-->
<!--	<Todos />-->
{:else}
	<section class="flex flex-col gap-3 p-5 items-center h-screen">
	<div class="h-full flex flex-col items-center justify-between p-5 py-20">
		<div class="mt-32 flex flex-col items-center gap-3">
			<img class="w-24 h-24" src="/icon.png" alt="ai memo" />
			<h1 class="text-4xl font-bold">Ai Memo</h1>
			<p class="text-xs">누구나 쉽고 자유롭게 AI를 누리다</p>
		</div>
		{#if show}
		<button transition:fade={{ duration: 1000 }} on:click={loginWithGoogle} class="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150">
			<img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo">
			<span>Login with Google</span>
		</button>
		{/if}
	</div>
	</section>
{/if}

