<template>
	<h1 class="font-extrabold text-4xl py-2 px-4 sm:px-0">Counters</h1>
	<ClientOnly>
		<div v-for="(entry, index) of entries" :key="entry.name" class="card">
			<div class="action">
				<button title="Move Up" :disabled="index === 0" @click="moveUp(index)">↑</button>
				<button title="Move Down" :disabled="index === entries.length - 1" @click="moveDown(index)">↓</button>
				<button class="danger" title="Remove" @click="remove(index)">×</button>
			</div>
			<div class="flex-auto w-full">
				<h2 class="font-extrabold text-2xl underline decoration-stone-200 dark:decoration-stone-600 inline">{{ entry.name }}</h2>
				<number-counter v-if="entry.type === Type.Number" v-model:value="entry.value" />
				<date-counter v-else-if="entry.type === Type.Date" v-model:values="entry.values" />
				<time-counter v-else-if="entry.type === Type.Time" :value="new Date(entry.value)" />
			</div>
		</div>
	</ClientOnly>

	<div class="bg-stone-100 dark:bg-stone-900 p-4 sm:rounded-xl shadow-md mt-4">
		<h1 class="font-extrabold text-2xl pb-2">Add New</h1>
		<form @submit.prevent="add" class="flex gap-[2px] [&>*]:border-0 [&>*]:dark:[color-scheme:dark]">
			<ClientOnly>
				<select v-model="type" class="dark:bg-stone-700 rounded-l-lg">
					<option :value="Type.Number">Number</option>
					<option :value="Type.Date">Date</option>
					<option :value="Type.Time">Time</option>
				</select>
				<input v-if="type === Type.Time" type="datetime-local" required v-model="date" class="dark:bg-stone-700" />
				<input type="text" v-model="name" required class="dark:bg-stone-700 flex-auto shrink w-full border-stone-200 dark:border-stone-800" />
				<button type="submit" class="bg-green-500 dark:bg-green-600 border-0 rounded-r-lg px-4">Add</button>
			</ClientOnly>
		</form>
	</div>

	<details class="bg-stone-100 dark:bg-stone-900 sm:rounded-lg p-4 mt-4">
		<summary class="font-extrabold text-2xl">Management</summary>

		<div class="prose prose-stone dark:prose-invert max-w-none">
			<hr>

			<h2>Download</h2>
			<div class="flex flex-col sm:flex-row text-center sm:text-left sm:gap-4 items-center">
				<p class="w-full flex-auto">
					Click on the above button to download the data as a JSON file. This will create a dump from your
					<NuxtLink href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" class="underline">Local Storage</NuxtLink>
					which you can use to save or transfer from devices.
				</p>
				<button class="bg-stone-200 dark:bg-stone-500 p-2 rounded-lg max-w-xs w-full h-fit" title="Download data as JSON" @click="download">
					Download
				</button>
			</div>

			<h2>Upload</h2>
			<div class="flex flex-col sm:flex-row text-center sm:text-left sm:gap-4 items-center">
				<p class="w-full flex-auto">
					This button will replace the data from your
					<NuxtLink href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" class="underline">Local Storage</NuxtLink>
					with the one uploaded.
					<span class="font-bold">This is a destructive action and cannot be reverted. Consider creating a backup beforehand.</span>
				</p>
				<div class="flex gap-[2px] max-w-xs w-full">
					<ClientOnly>
						<input
							type="file"
							accept=".json"
							class="bg-stone-200 dark:bg-stone-500 p-1 w-full h-fit"
							:class="loaded ? 'rounded-l-lg' : 'rounded-lg'"
							title="Upload data from JSON"
							@change="handleUploadChange"
						/>
						<button v-if="loaded" class="danger p-2 rounded-r-lg" title="Replace current data" @click="confirmUpload">Replace</button>
					</ClientOnly>
				</div>
			</div>

			<h2>Reset</h2>
			<div class="flex flex-col sm:flex-row text-center sm:text-left sm:gap-4 items-center">
				<p class="w-full flex-auto">
					This button will purge the data from your
					<NuxtLink href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" class="underline">Local Storage</NuxtLink>,
					cleaning all of the counters.
					<span class="font-bold">This is a destructive action and cannot be reverted. Consider creating a backup beforehand.</span>
				</p>
				<button class="danger p-2 rounded-lg max-w-xs w-full h-fit" title="Reset all data" @click="reset">Reset</button>
			</div>
		</div>
	</details>
</template>

<script setup lang="ts">
const entries = useLocalStorage<Data[]>('data', []);

enum Type {
	Number,
	Date,
	Time
}

const type = ref<Type>(Type.Number);
const name = ref<string>('');
const date = ref<string>('');
function add() {
	switch (type.value) {
		case Type.Number:
			entries.value.push({ type: Type.Number, name: name.value, value: 0 });
			break;
		case Type.Date:
			entries.value.push({ type: Type.Date, name: name.value, values: [] });
			break;
		case Type.Time:
			entries.value.push({ type: Type.Time, name: name.value, value: Date.parse(date.value!) });
			break;
	}

	type.value = Type.Number;
	name.value = '';
	date.value = '';
}

function moveUp(index: number) {
	if (index <= 0) return;

	swap(index, index - 1);
}

function moveDown(index: number) {
	if (index >= entries.value.length - 1) return;

	swap(index, index + 1);
}

function remove(index: number) {
	entries.value.splice(index, 1);
}

function swap(i0: number, i1: number) {
	const a = entries.value[i0];
	const b = entries.value[i1];

	entries.value[i0] = b;
	entries.value[i1] = a;
}

function download() {
	const url = URL.createObjectURL(new Blob([JSON.stringify(entries.value)], { type: 'application/json' }));
	const a = document.createElement('a') as HTMLAnchorElement;
	a.href = url;
	a.download = 'countrw-data.json';
	a.target = '_blank';
	a.click();
	URL.revokeObjectURL(url);
}

const loaded = ref<Data[] | null>(null);
async function handleUploadChange(event: Event) {
	const input = event.target as HTMLInputElement;
	loaded.value = input.files!.length === 1 ? JSON.parse(await input.files!.item(0)!.text()) : null;
}

function confirmUpload() {
	entries.value = [];

	nextTick(() => {
		entries.value = loaded.value;
		loaded.value = null;
	});
}

function reset() {
	entries.value = [];
}

type Data = NumberCounter | DateCounter | TimeCounter;

interface NumberCounter {
	type: Type.Number;
	name: string;
	value: number;
}

interface DateCounter {
	type: Type.Date;
	name: string;
	values: [year: number, month: number, day: number][];
}

interface TimeCounter {
	type: Type.Time;
	name: string;
	value: number;
}
</script>

<style scoped lang="css">
.card {
	@apply bg-stone-100 dark:bg-stone-900 sm:pl-4 pr-4 pt-2 sm:pt-4 pb-4 sm:rounded-xl shadow-md mb-2 flex gap-2;
}

.card > .action {
	@apply shrink-0 flex flex-col px-2 sm:pl-0 gap-1 border-r-2 border-stone-200 dark:border-stone-800;
}

.card > .action > button {
	@apply rounded-lg px-3 py-1;
}

.card > .action > button:not(.danger) {
	@apply bg-stone-300 hover:bg-stone-200 hover:disabled:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 dark:hover:disabled:bg-stone-800 disabled:opacity-30;
}
</style>
