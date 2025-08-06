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
        .sort((a, b) => b.count - a.count); // Sort by job count descending (most jobs first)
    
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
<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" on:click={onClose} role="dialog" aria-modal="true" tabindex="-1">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white" on:click|stopPropagation role="document">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Companies Directory</h2>
            <button
                on:click={onClose}
                class="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close companies directory"
            >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <!-- Companies Table -->
        <div class="overflow-x-auto">
            {#if loading}
                <div class="flex justify-center items-center h-32">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span class="ml-3 text-gray-600">Loading companies data...</span>
                </div>
            {:else}
                <table class="min-w-full bg-white">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Company Name
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jobs Available
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Website
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Careers Page
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {#each companiesArray as { company, count, companyUrl, jobsUrl, logoUrl }}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-8 w-8 mr-3">
                                            <img 
                                                src={logoUrl} 
                                                alt="{company} logo"
                                                class="h-8 w-8 rounded-sm object-contain"
                                                on:error={(e) => {
                                                    // Fallback to building icon if logo fails to load
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
                                        <div class="text-sm font-medium text-gray-900 capitalize">
                                            {company}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {count} open positions
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <a
                                        href={companyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                    >
                                        Visit Website
                                        <svg class="w-3 h-3 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                        </svg>
                                    </a>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <a
                                        href={jobsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-green-600 hover:text-green-900 text-sm font-medium"
                                    >
                                        Careers Page
                                        <svg class="w-3 h-3 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                        </svg>
                                    </a>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/if}
        </div>

        <!-- Summary -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
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
