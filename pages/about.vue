<template>
	<section class="prose prose-stone dark:prose-invert max-w-none">
		<h1 class="font-extrabold text-4xl py-2">About</h1>
		<p>
			<span class="font-bold">Countrw</span>, or also <span class="italic">Counter Web</span>, is a free open-source platform to track and
			manage counters, built with <NuxtLink href="https://nuxt.com">Nuxt v3</NuxtLink> and
			<NuxtLink href="https://tailwindcss.com/">TailwindCSS</NuxtLink>, this utility aims to provide a privacy-first fast and responsive website
			to manage time-sensitive data.
		</p>
		<p>Some of the valid use-cases for this tool are:</p>
		<ul>
			<li>Tracking sessions that need to be done every period of time.</li>
			<li>Tracking how many days has been since a treatment started.</li>
			<li>Tracking how many times a task has been repeated.</li>
		</ul>
		<hr />

		<p>
			All data is stored exclusively in your browser's
			<NuxtLink href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">Local Storage</NuxtLink>, please keep in mind that
			while this website does not upload any data to any server, I cannot guarantee that the data will remain safe if your PC were to be
			compromised. Furthermore, data is not synchronized between computers, if you desire to save, back-up, or transfer your data, simply copy
			the JSON data from your Application → Local Storage → https://countrw.kyra.dev.
		</p>
		<hr />

		<p>
			If this website lacks of a tool that you wish to use, or you encounter a problem, please open a new issue or Pull Request in the
			<NuxtLink href="https://github.com/kyranet/countrw.kyra.dev">GitHub repository</NuxtLink>.
		</p>
	</section>
</template>
