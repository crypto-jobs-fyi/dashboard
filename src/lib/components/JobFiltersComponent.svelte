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
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Filter Jobs</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>

    <!-- Clear Filters Button -->
    {#if filters.company || filters.location || filters.title}
        <div class="mt-4 flex justify-end">
            <button
                on:click={() => {
                    filters.company = '';
                    filters.location = '';
                    filters.title = '';
                    handleFilterChange();
                }}
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Clear Filters
            </button>
        </div>
    {/if}
</div>
