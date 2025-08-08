<!-- Companies List Component -->
<script lang="ts">
    import type { JobStats, Company } from '$lib/types.js';
    import { fetchCompaniesData, getCachedCompaniesData } from '$lib/jobsData';
    import { onMount } from 'svelte';
    
    export let stats: JobStats;
    export let onClose: () => void;

    let companiesData: Company[] = [];
    let loading = true;

    onMount(async () => {
        try {
            // First check if we have valid cached data
            const cachedData = getCachedCompaniesData();
            if (cachedData) {
                console.log('🚀 CompaniesModal: Using cached companies data (no API call needed)');
                companiesData = cachedData;
                loading = false;
                return;
            }
            
            // If no cache, fetch the data (this will cache it for other components)
            console.log('📡 CompaniesModal: No cache available, fetching companies data');
            companiesData = await fetchCompaniesData();
        } catch (error) {
            console.error('Error loading companies data:', error);
        } finally {
            loading = false;
        }
    });

    let sortKey: 'jobs' | 'name' = 'jobs';
    let sortDir: 'asc' | 'desc' = 'desc';
    let searchQuery = '';
    let minJobs: number = 0;

    // Convert companies data to sorted array with job counts and company info
    $: companiesArray = Object.entries(stats.companiesData)
        .map(([companyName, count]) => {
            // Find matching company data
            const companyInfo = companiesData.find(c => 
                c.company_name.toLowerCase() === companyName.toLowerCase()
            );
            return {
                company: companyName,
                count,
                companyUrl: companyInfo?.company_url || `https://www.google.com/search?q=${encodeURIComponent(companyName + ' crypto company')}`,
                jobsUrl: companyInfo?.jobs_url || `https://www.google.com/search?q=${encodeURIComponent(companyName + ' crypto jobs careers')}`,
                logoUrl: getCompanyLogo(companyName, companyInfo?.company_url)
            };
        })
        .filter(({ company, count }) => {
            const q = searchQuery.trim().toLowerCase();
            const matchesQuery = q === '' || company.toLowerCase().includes(q);
            const meetsMin = count >= (Number.isFinite(minJobs) ? minJobs : 0);
            return matchesQuery && meetsMin;
        })
        .sort((a, b) => {
            let cmp = 0;
            if (sortKey === 'jobs') {
                cmp = a.count === b.count ? a.company.localeCompare(b.company) : a.count - b.count;
            } else {
                cmp = a.company.localeCompare(b.company);
            }
            return sortDir === 'asc' ? cmp : -cmp;
        });
    
    // Function to get company logo URL using real company data
    function getCompanyLogo(companyName: string, companyUrl?: string): string {
        if (!loading && companyUrl) {
            // Extract domain from company URL
            const domain = extractDomainFromUrl(companyUrl);
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        }
        
        // Fallback: try to construct domain from company name
        return `https://www.google.com/s2/favicons?domain=${companyName.toLowerCase().replace(/\s+/g, '')}.com&sz=32`;
    }
    
    // Helper function to extract domain from URL
    function extractDomainFromUrl(url: string): string {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch {
            return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
        }
    }
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
                <h2 class="text-2xl font-semibold text-gray-900">Companies Directory</h2>
                <button
                    on:click={onClose}
                    class="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                    aria-label="Close companies directory"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- Companies List (Notion-like) -->
            <div class="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 border-b border-gray-100">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <div class="relative w-full sm:w-72">
                            <input
                                class="w-full h-8 pl-3 pr-3 rounded-md border border-gray-300 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                type="text"
                                placeholder="Search companies..."
                                bind:value={searchQuery}
                                aria-label="Search companies"
                            />
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <label class="text-xs text-gray-500" for="minJobs">Min jobs</label>
                            <input
                                id="minJobs"
                                class="h-8 w-20 rounded-md border border-gray-300 bg-white text-sm text-gray-700 px-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                type="number"
                                min="0"
                                bind:value={minJobs}
                                aria-label="Minimum jobs filter"
                            />
                            <button
                                class="inline-flex items-center h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-50 transition-colors"
                                on:click={() => { searchQuery = ''; minJobs = 0; }}
                                aria-label="Clear filters"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <div class="text-xs text-gray-500">Sort</div>
                        <button
                            class="inline-flex items-center h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-50 transition-colors {sortKey === 'jobs' ? 'bg-gray-50' : ''}"
                            on:click={() => sortKey = 'jobs'}
                        >
                            By jobs
                        </button>
                        <button
                            class="inline-flex items-center h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-50 transition-colors {sortKey === 'name' ? 'bg-gray-50' : ''}"
                            on:click={() => sortKey = 'name'}
                        >
                            By name
                        </button>
                        <button
                            class="inline-flex items-center h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-50 transition-colors"
                            on:click={() => sortDir = sortDir === 'asc' ? 'desc' : 'asc'}
                            aria-label="Toggle sort direction"
                        >
                            {#if sortDir === 'asc'}
                                <svg class="w-3.5 h-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M3 12l7-8 7 8H3z"/></svg>
                                Asc
                            {:else}
                                <svg class="w-3.5 h-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M17 8l-7 8-7-8h14z"/></svg>
                                Desc
                            {/if}
                        </button>
                    </div>
                </div>
                {#if loading}
                    <div class="flex justify-center items-center h-32">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                        <span class="ml-3 text-gray-600">Loading companies data...</span>
                    </div>
                {:else}
                    <div class="divide-y divide-gray-100" role="list">
                        {#each companiesArray as { company, count, companyUrl, jobsUrl, logoUrl }}
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 hover:bg-gray-50" role="listitem">
                                <div class="flex items-center min-w-0">
                                    <div class="flex-shrink-0 h-8 w-8 mr-3">
                                        <img 
                                            src={logoUrl} 
                                            alt="{company} logo"
                                            class="h-8 w-8 rounded-sm object-contain"
                                            on:error={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                if (target && target.nextElementSibling) {
                                                    target.style.display = 'none';
                                                    (target.nextElementSibling as HTMLElement).style.display = 'block';
                                                }
                                            }}
                                        />
                                        <svg class="h-6 w-6 text-gray-400 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                        </svg>
                                    </div>
                                    <div class="truncate">
                                        <div class="text-sm font-medium text-gray-900 capitalize truncate">{company}</div>
                                    </div>
                                </div>
                                <div class="mt-2 sm:mt-0 flex items-center gap-3">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                                        {count} open positions
                                    </span>
                                    <div class="flex items-center gap-2">
                                        <a
                                            href={companyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-50 transition-colors"
                                        >
                                            Website
                                            <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                            </svg>
                                        </a>
                                        <a
                                            href={jobsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-50 transition-colors"
                                        >
                                            Careers
                                            <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Summary -->
            <div class="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
                <div class="text-center">
                    <p class="text-lg font-semibold text-gray-900">
                        {companiesArray.length} Companies Hiring
                    </p>
                    <p class="text-sm text-gray-600 mt-1">
                        Total of {stats.totalJobs} open positions across all companies
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
