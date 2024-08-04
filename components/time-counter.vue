<template>
	<span class="pl-2 align-super dark:text-stone-300">{{ formatDate(value) }}</span>

	<div class="counter text-right" :class="times.positive ? 'positive' : 'negative'">
		<span v-if="times.years">
			<span class="font-extrabold text-2xl">{{ times.years }}</span> year{{ times.years === 1 ? '' : 's' }}
		</span>
		<span v-if="times.months">
			<span class="font-extrabold text-2xl">{{ times.months }}</span> month{{ times.months === 1 ? '' : 's' }}
		</span>
		<span v-if="times.days">
			<span class="font-extrabold text-2xl">{{ times.days }}</span> day{{ times.days === 1 ? '' : 's' }}
		</span>
		<span v-if="times.hours">
			<span class="font-extrabold text-2xl">{{ times.hours }}</span> hour{{ times.hours === 1 ? '' : 's' }}
		</span>
		<span v-if="times.minutes">
			<span class="font-extrabold text-2xl">{{ times.minutes }}</span> minute{{ times.minutes === 1 ? '' : 's' }}
		</span>
		<span v-if="times.seconds">
			<span class="font-extrabold text-2xl">{{ times.seconds }}</span> second{{ times.seconds === 1 ? '' : 's' }}
		</span>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{ value: Date }>();

const times = reactive({
	positive: false,
	years: 0,
	months: 0,
	days: 0,
	hours: 0,
	minutes: 0,
	seconds: 0
});

useIntervalFn(
	() => {
		const a = props.value.getTime();
		const b = Date.now();
		const difference = new Date(Math.abs(a - b));
		times.positive = a >= b;
		times.years = difference.getUTCFullYear() - 1970;
		times.months = difference.getUTCMonth();
		times.days = difference.getUTCDate() - 1;
		times.hours = difference.getUTCHours();
		times.minutes = difference.getUTCMinutes();
		times.seconds = difference.getUTCSeconds();
	},
	1000,
	{ immediate: true, immediateCallback: true }
);
</script>

<style scoped lang="css">
.counter > :not(:last-child)::after {
	content: ', ';
}

.counter > :last-child::before {
	content: 'and ';
}

.counter > :only-of-type::before {
	content: '';
}

.counter.positive::before {
	content: 'In '
}

.counter.positive::after {
	content: '.'
}

.counter.negative::after {
	content: ' ago.'
}
</style>
