<script lang="ts">
import Todos from '@components/todo/todos.svelte';
import type { PageData } from './$types';

export let data: PageData;

</script>

<Todos todosExp={data.todos} />
