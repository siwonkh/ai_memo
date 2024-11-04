<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { useFirebase } from '$lib/use-firebase';
	import { getSuggestions } from '$lib/suggestion';
	import { useAddMemo, useUpdateMemo, useDeleteMemo } from '$lib/use-memos';
	import Conversation from '@components/ai/conversation.svelte';
	import Suggestions from '@components/ai/suggestions.svelte';
	import { Modal } from 'flowbite-svelte';
	import { Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
	import { DotsVerticalOutline, PaperPlaneOutline, TrashBinOutline, UndoOutline, RedoOutline, ReplyOutline } from 'flowbite-svelte-icons';
	import DiffMatchPatch from 'diff-match-patch';

	const { addMemo } = useAddMemo();
	const { updateMemo } = useUpdateMemo();
	const { deleteMemo } = useDeleteMemo();
	const { db } = useFirebase();

	const dmp = new DiffMatchPatch();

	export let memo: Memo;
	const memoId = memo.id;

	let textHistory: string[] = [memo.text];

	const AUTO_SAVE_DELAY = 5000;

	let suggestions: Suggestion[] = [];

	async function loadSuggestions() {
		suggestions = await getSuggestions(db);
	}

	let popupModal = false;
	let dropdownOpen = false;

	let autoSaveTimeout: any;

	// let memo = useMemo(memoExported.id, memoExported);

	let highlightedContent = '';
	let showHighlight = false;

	function highlightDifferences(oldText: string, newText: string) {
		const diff = dmp.diff_main(oldText, newText);
		dmp.diff_cleanupSemantic(diff);

		return diff
			.map(([type, text]) => {
				if (type === 1) {
					return `<span style="background-color: #86efac">${text}</span>`;
				} if (type === -1) {
					return `<span style="background-color: #f87171">${text}</span>`;
				} else {
					return text;
				}
			})
			.join('')
			.replace(/\n/g, '<br>');
	}

	type Message = {
		role: 'user' | 'assistant';
		content: string;
	};

	let conversation: Message[] = [];

	let loading = false;
	let promptInput: string = '';

	function addMessage(role: 'user' | 'assistant', content: string) {
		conversation = [...conversation, { role, content }];
	}

	async function handleSend() {
		const userInput = promptInput.trim();
		if (userInput != '') {
			promptInput = "";
			addMessage('user', userInput);
			try {
				const response = await fetch('/api/prompt', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ conversation: [...conversation, { role: 'user', content: memo.text }] })
				});

				const data = await response.json();
				if (response.status !== 200) {
					throw data.error || new Error(`Request failed with status ${response.status}`);
				} else {
					loading = false;
				}
				addMessage('assistant', data.result.changesReportMessage);

				highlightedContent = highlightDifferences(memo.text, data.result.newTextContent);
				showHighlight = true;

				setTimeout(() => {
					showHighlight = false;
				}, 2000);

				memo.text = data.result.newTextContent;
				autoSaveProcess()
			} catch (error) {
				// Consider implementing your own error handling logic here
				console.error(error);
			}
		}
	}

	function autoSaveProcess() {
		if (autoSaveTimeout) {
			clearTimeout(autoSaveTimeout);
		}

		autoSaveTimeout = setTimeout(async () => {
			if (memo.text || memo.title) {
				textHistory.push(memo.text);
				if (textHistory.length > 50) {
					textHistory = textHistory.slice(0, 50);
				}
				if (memoId !== "new") {
					await updateMemo(memoId, memo.title, memo.text);
				}
			}
		}, AUTO_SAVE_DELAY);
	}

	function onInputChange(event: any) {
		const textarea = event.target;
		if (textarea.scrollHeight > textarea.clientHeight) {
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
		if (textHistory.length < 1) {
			textHistory.push(memo.text);
		}

		autoSaveProcess()
	}

	onDestroy(() => {
		clearTimeout(autoSaveTimeout);
		if (memo.text || memo.title) {
			if (memoId === "new") {
				addMemo(memo.title, memo.text);
			} else {
				updateMemo(memoId, memo.title, memo.text);
			}
		}
	});

	const saveAndExit = () => {
		goto("/memo");
	};

	function remove() {
		if (memoId === "new") {
			memo.title = "";
			memo.text = "";
			goto("/memo");
		} else {
			deleteMemo(memoId);
			goto("/memo")
		}
	}

	function handleSuggest(event: any) {
		console.log('handle suggest')
		promptInput = event.detail.text;
	}

	function openModal() {
		popupModal = true;
		suggestions = [];
		loadSuggestions();
	}

	function undo() {
		if (textHistory.length > 0) {
			memo.text = textHistory.pop() || "";
		}

		dropdownOpen = false;
	}

</script>

<div class="p-4 pb-0 min-h-screen bg-white">
	<div class="flex justify-between items-center">
		<button on:click={saveAndExit} class="p-1 text-stone-500">← Memo</button>
		<div class="flex space-x-6">
			<button on:click={openModal} class="ai-button w-7 h-7 p-1 block rounded-full text-sm font-bold shadow-lg transition-all duration-200 ease-in-out" type="button">
				AI
			</button>
<!--			<button><UndoOutline /></button>-->
			<div class="block m-auto">
				<DotsVerticalOutline class="dots-menu w-7 h-7 focus:ring-0 focus:outline-0 active:bg-gray-200 rounded-full" />
				<Dropdown bind:open={dropdownOpen} triggeredBy=".dots-menu">
					{#if textHistory.length}
						<DropdownItem on:click={undo}>
							<div class="flex space-x-2">
								<UndoOutline/>
								<span>Undo</span>
							</div>
						</DropdownItem>
					{:else}
						<DropdownItem disabled class="text-stone-300">
							<div class="flex space-x-2">
								<UndoOutline/>
								<span>Undo</span>
							</div>
						</DropdownItem>
					{/if}
					<DropdownDivider />
					<DropdownItem on:click={remove} class="text-red-500">
						<div class="flex space-x-2">
							<TrashBinOutline/>
							<span>Delete</span>
						</div>
					</DropdownItem>
				</Dropdown>
			</div>

		</div>
	</div>

	<textarea
		bind:value={memo.title}
		on:input={onInputChange}
		placeholder="제목을 입력하세요..."
		class="w-full overflow-hidden h-12 text-2xl font-bold border-0 p-2 py-4 focus:ring-0 focus:outline-none resize-none"
	/>
	{#if showHighlight}
		<div
			class="p-2 text-lg font-medium"
			bind:innerHTML={highlightedContent}
			contenteditable="true"
		></div>
	{:else}
	<textarea
		bind:value={memo.text}
		on:input={onInputChange}
		placeholder="메모를 입력하세요..."
		class="w-full overflow-hidden h-screen text-lg font-medium p-2 pb-6 mb-6 border-0 focus:ring-0 focus:outline-none resize-none"
	/>
	{/if}

	<Modal dismissable={false} bind:open={popupModal} class="w-full bg-transparent shadow-none h-full flex flex-col justify-center items-center" size="xs" outsideclose>
		<div class="w-screen h-72 text-center space-y-3">
			<div class="h-10 flex bg-white mx-2 px-2 rounded">
				<label for="prompt"></label>
				<input bind:value={promptInput} id="prompt" name="prompt" type="text" class="py-3 px-5 text-sm w-full border-0 focus:ring-0" placeholder="AI에게 작업을 요청해보세요." />
				<button on:click={handleSend}><PaperPlaneOutline class={`w-7 h-7 rounded p-1 text-white ${promptInput.trim() ? 'bg-stone-800' : 'bg-stone-200'}`}></PaperPlaneOutline></button>
			</div>
			<!-- Modal body -->
			<div class="w-full px-2 md:px-1 text-center overflow-y-scroll">
				{#if conversation.length}
					<Conversation {conversation} />
				{:else}
					<Suggestions on:suggest={handleSuggest} {suggestions} />
				{/if}
			</div>
		</div>
	</Modal>
</div>

<style>
    .ai-button {
        background: linear-gradient(135deg, #6b73ff, #9b5cff);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    /* 클릭 효과 */
    .ai-button:active {
        transform: scale(0.95);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    }
</style>
