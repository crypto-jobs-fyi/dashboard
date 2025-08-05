<script lang="ts">
	import { onMount } from 'svelte';
	
	let status = 'Starting...';
	let data: any = null;
	let error: any = null;

	onMount(async () => {
		status = 'Fetching data...';
		try {
			const url = 'https://raw.githubusercontent.com/crypto-jobs-fyi/crawler/refs/heads/main/jobs.json';
			console.log('Fetching from:', url);
			
			const response = await fetch(url);
			console.log('Response received:', response.status, response.statusText);
			
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			
			const jsonData = await response.json();
			console.log('JSON parsed, data.data length:', jsonData.data?.length);
			
			data = jsonData;
			status = 'Success!';
		} catch (err) {
			error = err;
			status = 'Error occurred';
			console.error('Fetch error:', err);
		}
	});
</script>

<h1>API Test Page</h1>
<p>Status: {status}</p>

{#if error}
	<div style="color: red;">
		<h2>Error:</h2>
		<pre>{JSON.stringify(error, null, 2)}</pre>
	</div>
{/if}

{#if data}
	<div style="color: green;">
		<h2>Success!</h2>
		<p>Total jobs: {data.data?.length || 'No data'}</p>
		{#if data.data?.[0]}
			<h3>First job:</h3>
			<pre>{JSON.stringify(data.data[0], null, 2)}</pre>
		{/if}
	</div>
{/if}
