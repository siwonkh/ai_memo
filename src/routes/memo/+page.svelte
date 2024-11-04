<script lang="ts">
	import Memos from '@components/memo/memos.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Memos memosExported={data.memos} />
