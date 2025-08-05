<!-- Statistics Page Component -->
<script lang="ts">
    import type { JobStats } from '$lib/types.js';
    
    export let stats: JobStats;
    export let onClose: () => void;

    // Convert data to sorted arrays for display
    $: companiesArray = Object.entries(stats.companiesData)
        .map(([company, count]) => ({ company, count }))
        .sort((a, b) => b.count - a.count);
    
    $: locationsArray = Object.entries(stats.locationsData)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" on:click={onClose} role="dialog" aria-modal="true" tabindex="-1">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white" on:click|stopPropagation role="document">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Job Statistics</h2>
            <button
                on:click={onClose}
                class="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close statistics modal"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Jobs per Company -->
            <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-4">Jobs per Company</h3>
                <div class="max-h-96 overflow-y-auto">
                    <div class="space-y-2">
                        {#each companiesArray as { company, count }}
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span class="font-medium text-gray-900 capitalize">{company}</span>
                                <span class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                    {count} jobs
                                </span>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Jobs per Location -->
            <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-4">Jobs per Location</h3>
                <div class="max-h-96 overflow-y-auto">
                    <div class="space-y-2">
                        {#each locationsArray as { location, count }}
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span class="font-medium text-gray-900">{location}</span>
                                <span class="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                    {count} jobs
                                </span>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <!-- Summary Stats -->
        <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{stats.totalJobs}</div>
                <div class="text-sm text-blue-600">Total Jobs</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{stats.totalCompanies}</div>
                <div class="text-sm text-green-600">Companies</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
                <div class="text-2xl font-bold text-purple-600">{locationsArray.length}</div>
                <div class="text-sm text-purple-600">Locations</div>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg">
                <div class="text-2xl font-bold text-orange-600">
                    {Math.round(stats.totalJobs / stats.totalCompanies * 100) / 100}
                </div>
                <div class="text-sm text-orange-600">Avg Jobs/Company</div>
            </div>
        </div>
    </div>
</div>
