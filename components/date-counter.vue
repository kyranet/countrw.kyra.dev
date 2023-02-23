<template>
	<span class="pl-2 align-super dark:text-stone-300">{{ values.length }}</span>

	<div class="flex flex-wrap pt-4 gap-2">
		<div v-for="(value, index) of values" class="flex">
			<button class="danger font-extrabold px-2 py-1 rounded-l-lg" title="Remove date" @click="values.splice(index, 1)">×</button>
			<span class="bg-white dark:bg-stone-800 px-2 py-1 rounded-r-lg">{{
				formatDate(new Date(value[0], value[1] - 1, value[2], 0, 0, 0))
			}}</span>
		</div>
	</div>

	<form @submit.prevent="add" class="flex pt-4 gap-[2px]">
		<input
			type="date"
			required
			v-model="date"
			class="dark:bg-stone-700 border-0 rounded-l-lg flex-auto dark:[color-scheme:dark]"
		/>
		<button type="submit" class="bg-green-500 dark:bg-green-600 border-0 rounded-r-lg px-4">Add</button>
	</form>
</template>

<script setup lang="ts">
const emit = defineEmits<{
	(event: 'update:values', value: DateValue[]): void;
}>();
const props = defineProps<{ values: DateValue[] }>();

const values = reactive(props.values);
watch(values, (values) => emit('update:values', values));

type DateValue = readonly [year: number, month: number, day: number];

const date = ref<string>('');
function add() {
	const [year, month, day] = date.value.split('-');
	const entry = [Number(year), Number(month), Number(day)] satisfies DateValue;

	const index = values.findIndex((value) => gte(value, entry));
	console.log({ values: [...values], index });
	if (index === -1) values.push(entry);
	else values.splice(index, 0, entry);

	date.value = '';
}

function gte([y0, m0, d0]: DateValue, [y1, m1, d1]: DateValue) {
	// Compare years
	if (y0 > y1) return true;
	if (y0 < y1) return false;
	// Same year — compare months
	if (m0 > m1) return true;
	if (m0 < m1) return false;
	// Same year and month — compare days
	return d0 >= d1;
}
</script>
