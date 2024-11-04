<script>
import Todos from '@components/todo/todos.svelte';
import { useAuth } from '$lib/use-user';

const { logout } = useAuth();
</script>

<!--<button-->
<!--	class="border bg-blue-600 text-white w-fit p-3 rounded-lg font-semibold"-->
<!--	on:click={logout}>Logout</button-->
<!--&gt;-->
<hr />
<Todos />
