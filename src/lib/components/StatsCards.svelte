<!-- Dashboard Stats Cards Component -->
<script lang="ts">
    import type { JobStats } from '$lib/types.js';
    
    export let stats: JobStats;
    export let onTotalJobsClick: () => void;
    export let onTotalCompaniesClick: () => void;
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <!-- Total Jobs Card -->
    <button 
        class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-left border-2 border-transparent hover:border-blue-500"
        on:click={onTotalJobsClick}
    >
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Jobs</p>
                <p class="text-3xl font-bold text-gray-900">{stats.totalJobs.toLocaleString()}</p>
                <p class="text-sm text-gray-500 mt-1">Click to view statistics</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5M6 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6v12a2 2 0 002 2h8a2 2 0 002-2V6"></path>
                </svg>
            </div>
        </div>
    </button>

    <!-- Total Companies Card -->
    <button 
        class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-left border-2 border-transparent hover:border-green-500"
        on:click={onTotalCompaniesClick}
    >
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Companies</p>
                <p class="text-3xl font-bold text-gray-900">{stats.totalCompanies.toLocaleString()}</p>
                <p class="text-sm text-gray-500 mt-1">Click to view companies list</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
            </div>
        </div>
    </button>
</div>
