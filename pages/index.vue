<template>
	<h1 class="font-extrabold text-4xl py-2">Counters</h1>
	<ClientOnly>
		<div
			v-for="(entry, index) of entries"
			:key="entry.name"
			class="bg-stone-100 dark:bg-stone-900 sm:pl-4 pr-4 pt-2 sm:pt-4 pb-4 sm:rounded-xl shadow-md mb-2"
		>
			<div class="grid grid-cols-12 gap-2">
				<div class="flex flex-col col-span-2 sm:col-span-1 px-1 sm:px-2 gap-1 border-r-2 border-stone-200 dark:border-stone-800">
					<button
						class="bg-stone-300 hover:bg-stone-200 hover:disabled:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 dark:hover:disabled:bg-stone-800 disabled:opacity-30 rounded-lg p-1"
						:disabled="index === 0"
						@click="moveUp(index)"
					>
						↑
					</button>
					<button
						class="bg-stone-300 hover:bg-stone-200 hover:disabled:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 dark:hover:disabled:bg-stone-800 disabled:opacity-30 rounded-lg p-1"
						:disabled="index === entries.length - 1"
						@click="moveDown(index)"
					>
						↓
					</button>
				</div>
				<div class="col-span-10 sm:col-span-11">
					<h2 class="font-extrabold text-2xl underline decoration-stone-200 dark:decoration-stone-600 inline">{{ entry.name }}</h2>
					<number-counter v-if="entry.type === Type.Number" v-model:value="entry.value" />
					<template v-else>
						<span class="pl-2 align-super dark:text-stone-300">{{ entry.values.length }}</span>
						<date-counter v-model:values="entry.values" />
					</template>
				</div>
			</div>
		</div>
	</ClientOnly>

	<div class="bg-stone-100 dark:bg-stone-900 p-4 sm:rounded-xl shadow-md mt-4">
		<h1 class="font-extrabold text-2xl pb-2">Add New</h1>
		<form @submit.prevent="add" class="flex">
			<select v-model="type" class="dark:bg-stone-700 border-0 rounded-l-lg">
				<option :value="Type.Number">Number</option>
				<option :value="Type.Date">Date</option>
			</select>
			<input
				type="text"
				v-model="name"
				required
				class="dark:bg-stone-700 border-0 flex-auto shrink border-x-2 w-full border-stone-200 dark:border-stone-800"
			/>
			<button type="submit" class="bg-green-500 dark:bg-green-600 border-0 rounded-r-lg px-4">Add</button>
		</form>
	</div>
</template>

<script setup lang="ts">
const entries = useLocalStorage<Data[]>('data', []);

enum Type {
	Number,
	Date
}

const type = ref<Type>(Type.Number);
const name = ref<string>('');
function add() {
	switch (type.value) {
		case Type.Number:
			entries.value.push({ type: Type.Number, name: name.value, value: 0 });
			break;
		case Type.Date:
			entries.value.push({ type: Type.Date, name: name.value, values: [] });
			break;
	}

	type.value = Type.Number;
	name.value = '';
}

function moveUp(index: number) {
	if (index <= 0) return;

	swap(index, index - 1);
}

function moveDown(index: number) {
	if (index >= entries.value.length - 1) return;

	swap(index, index + 1);
}

function swap(i0: number, i1: number) {
	const a = entries.value[i0];
	const b = entries.value[i1];

	entries.value[i0] = b;
	entries.value[i1] = a;
}

type Data = NumberCounter | DateCounter;

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
</script>
