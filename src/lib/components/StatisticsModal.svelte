<!-- Statistics Page Component -->
<script lang="ts">
	import type { JobStats } from '$lib/types.js';
	
	export let stats: JobStats;
	export let onClose: () => void;

	// Removed company filters/sorting; keep only locations
	let locationSortKey: 'jobs' | 'name' = 'jobs';
	let locationSortDir: 'asc' | 'desc' = 'desc';
	let locationSearch = '';
	let locationMinJobs: number = 0;

	// Locations: filter + sort
	$: locationsArray = Object.entries(stats.locationsData)
		.map(([location, count]) => ({ location, count }))
		.filter(({ location, count }) => {
			const q = locationSearch.trim().toLowerCase();
			const matchesQuery = q === '' || location.toLowerCase().includes(q);
			const meetsMin = count >= (Number.isFinite(locationMinJobs) ? locationMinJobs : 0);
			return matchesQuery && meetsMin;
		})
		.sort((a, b) => {
			let cmp = 0;
			if (locationSortKey === 'jobs') {
				cmp = a.count === b.count ? a.location.localeCompare(b.location) : a.count - b.count;
			} else {
				cmp = a.location.localeCompare(b.location);
			}
			return locationSortDir === 'asc' ? cmp : -cmp;
		});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="fixed inset-0 bg-white/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50" on:click={onClose} role="dialog" aria-modal="true" tabindex="-1">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<div class="relative top-16 mx-auto w-11/12 max-w-6xl rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-50 shadow-sm" on:click|stopPropagation role="document">
		<div class="p-6">
			<!-- Header -->
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-2xl font-semibold text-gray-900">Job Statistics</h2>
				<button
					on:click={onClose}
					class="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
					aria-label="Close statistics modal"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			<!-- Jobs per Location only -->
			<div class="max-w-3xl mx-auto">
				<h3 class="text-xl font-semibold text-gray-900 mb-3">Jobs per Location</h3>
				<div class="bg-white border border-gray-200 rounded-lg">
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border-b border-gray-100">
						<div class="flex items-center gap-3 flex-1 min-w-0">
							<div class="relative w-full sm:w-72">
								<input
									class="w-full h-8 pl-3 pr-3 rounded-md border border-gray-300 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
									type="text"
									placeholder="Search locations..."
									bind:value={locationSearch}
									aria-label="Search locations"
								/>
							</div>
							<div class="flex items-center gap-2 shrink-0">
								<label class="text-xs text-gray-500" for="minLocationJobs">Min jobs</label>
								<input
									id="minLocationJobs"
									class="h-8 w-20 rounded-md border border-gray-300 bg-white text-sm text-gray-700 px-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
									type="number"
									min="0"
									bind:value={locationMinJobs}
									aria-label="Minimum jobs filter for locations"
								/>
								<button
									class="inline-flex items-center h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-50 transition-colors"
									on:click={() => { locationSearch = ''; locationMinJobs = 0; }}
									aria-label="Clear location filters"
								>
									Clear
								</button>
							</div>
						</div>
						<div class="flex items-center gap-2 shrink-0 p-3 border-t border-gray-100 sm:justify-end">
							<div class="text-xs text-gray-500">Sort</div>
							<button
								class="inline-flex items-center h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-50 transition-colors {locationSortKey === 'jobs' ? 'bg-gray-50' : ''}"
								on:click={() => locationSortKey = 'jobs'}
							>
								By jobs
							</button>
							<button
								class="inline-flex items-center h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-50 transition-colors {locationSortKey === 'name' ? 'bg-gray-50' : ''}"
								on:click={() => locationSortKey = 'name'}
							>
								By name
							</button>
							<button
								class="inline-flex items-center h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-50 transition-colors"
								on:click={() => locationSortDir = locationSortDir === 'asc' ? 'desc' : 'asc'}
								aria-label="Toggle location sort direction"
							>
								{#if locationSortDir === 'asc'}
									<svg class="w-3.5 h-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M3 12l7-8 7 8H3z"/></svg>
									Asc
								{:else}
									<svg class="w-3.5 h-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M17 8l-7 8-7-8h14z"/></svg>
									Desc
								{/if}
							</button>
						</div>
					</div>
					<div class="max-h-96 overflow-y-auto">
						<div class="divide-y divide-gray-100" role="list">
							{#each locationsArray as { location, count }}
								<div class="flex items-center justify-between px-4 py-3 hover:bg-gray-50" role="listitem">
									<span class="text-sm font-medium text-gray-900 truncate">{location}</span>
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">{count} jobs</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Summary Stats -->
			<div class="mt-8 grid grid-cols-3 gap-4">
				<div class="text-center p-4 bg-white border border-gray-200 rounded-lg">
					<div class="text-2xl font-semibold text-gray-900">{stats.totalJobs}</div>
					<div class="text-sm text-gray-600">Total Jobs</div>
				</div>
				<div class="text-center p-4 bg-white border border-gray-200 rounded-lg">
					<div class="text-2xl font-semibold text-gray-900">{stats.totalCompanies}</div>
					<div class="text-sm text-gray-600">Companies</div>
				</div>
				<div class="text-center p-4 bg-white border border-gray-200 rounded-lg">
					<div class="text-2xl font-semibold text-gray-900">{locationsArray.length}</div>
					<div class="text-sm text-gray-600">Locations</div>
				</div>
			</div>
		</div>
	</div>
</div>
