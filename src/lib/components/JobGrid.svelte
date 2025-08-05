<!-- Job Cards Grid Component -->
<script lang="ts">
    import type { Job } from '$lib/types.js';
    import JobCard from './JobCard.svelte';
    
    export let jobs: Job[];
    export let title: string = 'Job Listings';
</script>

<div class="mb-8">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">{title}</h2>
        <span class="text-sm text-gray-500">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
        </span>
    </div>
    
    {#if jobs.length === 0}
        <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
            <p class="mt-1 text-sm text-gray-500">Try adjusting your search filters.</p>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each jobs as job, index (job.company + job.title + job.location + job.link + index)}
                <JobCard {job} />
            {/each}
        </div>
    {/if}
</div>
