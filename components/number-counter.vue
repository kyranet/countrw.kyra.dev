<template>
	<div class="flex text-center pt-4">
		<button class="bg-red-600 hover:bg-red-700 py-1 px-6 rounded-l-lg" @click="$emit('update:value', value - 10)">-10</button>
		<button
			class="bg-red-500 hover:bg-red-600 py-1 px-6 border-x-2 border-stone-200 dark:border-stone-800"
			@click="$emit('update:value', value - 1)"
		>
			-1
		</button>
		<span class="px-4 font-extrabold text-2xl min-w-[3em] dark:bg-stone-800 flex-auto">{{ value }}</span>
		<button
			class="bg-green-500 hover:bg-green-600 py-1 px-6 border-x-2 border-stone-200 dark:border-stone-800"
			@click="$emit('update:value', value + 1)"
		>
			-1
		</button>
		<button class="bg-green-600 hover:bg-green-700 py-1 px-6 rounded-r-lg" @click="$emit('update:value', value + 10)">-10</button>
	</div>
</template>

<script setup lang="ts">
defineEmits<{
	(event: 'update:value', value: number): void;
}>();
defineProps<{ value: number }>();
</script>
