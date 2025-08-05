<script lang="ts">
	import { onMount } from 'svelte';
	
	let status = 'Loading...';
	let jobCount = 0;
	let errorMsg = '';

	onMount(async () => {
		try {
			console.log('Simple test starting...');
			const response = await fetch('https://raw.githubusercontent.com/crypto-jobs-fyi/crawler/refs/heads/main/jobs.json');
			const data = await response.json();
			jobCount = data.data.length;
			status = 'Success!';
			console.log('Simple test success:', jobCount, 'jobs');
		} catch (error) {
			console.error('Simple test error:', error);
			errorMsg = error instanceof Error ? error.message : String(error);
			status = 'Failed';
		}
	});
</script>

<h1>Simple API Test</h1>
<p>Status: {status}</p>
<p>Jobs found: {jobCount}</p>
{#if errorMsg}
	<p style="color: red;">Error: {errorMsg}</p>
{/if}

<a href="/">Back to main page</a>
