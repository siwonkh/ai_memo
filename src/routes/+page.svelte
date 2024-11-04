<script lang="ts">
	import Home from '@components/home.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Home memos={data.memos} />
