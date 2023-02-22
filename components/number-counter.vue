<template>
	<div class="text-center pt-4 grid grid-cols-5 gap-[2px]">
		<button class="bg-red-600 hover:bg-red-700 py-1 rounded-l-lg" @click="$emit('update:value', value - 10)">-10</button>
		<button
			class="bg-red-500 hover:bg-red-600 py-1 border-stone-200 dark:border-stone-800"
			@click="$emit('update:value', value - 1)"
		>
			-1
		</button>
		<span class="font-extrabold text-2xl dark:bg-stone-800">{{ value }}</span>
		<button
			class="bg-green-500 hover:bg-green-600 py-1 border-stone-200 dark:border-stone-800"
			@click="$emit('update:value', value + 1)"
		>
			-1
		</button>
		<button class="bg-green-600 hover:bg-green-700 py-1 rounded-r-lg" @click="$emit('update:value', value + 10)">-10</button>
	</div>
</template>

<script setup lang="ts">
defineEmits<{
	(event: 'update:value', value: number): void;
}>();
defineProps<{ value: number }>();
</script>
