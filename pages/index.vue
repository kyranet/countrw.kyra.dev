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
				<time-counter v-else :value="new Date(entry.value)" />
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
