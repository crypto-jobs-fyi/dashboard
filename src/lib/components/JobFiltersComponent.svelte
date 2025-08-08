<!-- Job Filter Component -->
<script lang="ts">
    import type { JobFilters } from '$lib/types.js';
    
    export let filters: JobFilters;
    export let onFiltersChange: (filters: JobFilters) => void;

    function handleFilterChange() {
        onFiltersChange(filters);
    }
</script>

<div class="bg-white p-6 rounded-lg shadow-lg mb-8">
	<!-- Header row: title, modern info icon, clear button -->
	<div class="mb-3 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<h2 class="text-lg font-semibold text-gray-900">Filter Jobs</h2>
			<div class="relative group" aria-describedby="filters-help">
				<button
					type="button"
					class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
					aria-label="How to use filters"
				>
					<span aria-hidden="true" class="text-sm font-semibold leading-none select-none">i</span>
				</button>
				<div class="absolute left-1/2 -translate-x-1/2 mt-2 z-10 hidden group-hover:block group-focus-within:block w-80">
					<div class="rounded-md border border-gray-200 bg-white p-3 shadow-lg text-xs text-gray-700">
						<p class="font-medium text-gray-900 mb-1" id="filters-help">Multi-keyword tips</p>
						<ul class="list-disc pl-4 space-y-1">
							<li>Separate multiple values with commas or new lines.</li>
							<li>Match is OR within a field, AND across fields.</li>
							<li>Examples:
								<ul class="list-disc pl-4 mt-1">
									<li>Title: "QA, SDET"</li>
									<li>Location: "NY, Remote"</li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		{#if filters.company || filters.location || filters.title}
			<button
				on:click={() => {
					filters.company = '';
					filters.location = '';
					filters.title = '';
					handleFilterChange();
				}}
				class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			>
				Clear Filters
			</button>
		{/if}
	</div>

	<!-- Filters row: always on second line -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<!-- Title Filter -->
		<div>
			<label for="title" class="block text-sm font-medium text-gray-700 mb-2">
				Job Title
			</label>
			<input
				id="title"
				type="text"
				bind:value={filters.title}
				on:input={handleFilterChange}
				placeholder="Search by job title..."
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			/>
		</div>

		<!-- Company Filter -->
		<div>
			<label for="company" class="block text-sm font-medium text-gray-700 mb-2">
				Company
			</label>
			<input
				id="company"
				type="text"
				bind:value={filters.company}
				on:input={handleFilterChange}
				placeholder="Search by company name..."
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			/>
		</div>

		<!-- Location Filter -->
		<div>
			<label for="location" class="block text-sm font-medium text-gray-700 mb-2">
				Location
			</label>
			<input
				id="location"
				type="text"
				bind:value={filters.location}
				on:input={handleFilterChange}
				placeholder="Search by location..."
				class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			/>
		</div>
	</div>
</div>
