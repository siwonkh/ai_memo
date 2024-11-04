<script lang="ts">
	import MemoWrite from '@components/memo/memo-write.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MemoWrite memo={data.memo} />
