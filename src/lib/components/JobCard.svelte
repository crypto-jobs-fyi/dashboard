<!-- Job Card Component -->
<script lang="ts">
    import type { Job, Company } from '$lib/types.js';
    import { extractApplicationLink, fetchCompaniesData, getCachedCompaniesData, isCacheValid } from '$lib/jobsData';
    import { onMount } from 'svelte';
    
    export let job: Job;
    
    $: applicationUrl = extractApplicationLink(job.link);
    
    let companiesData: Company[] = [];
    let companiesLoaded = false;
    
    onMount(async () => {
        try {
            // First check if we have valid cached data
            const cachedData = getCachedCompaniesData();
            if (cachedData) {
                console.log('🚀 JobCard: Using cached companies data (no API call needed)');
                companiesData = cachedData;
                companiesLoaded = true;
                return;
            }
            
            // If no cache, fetch the data (this will cache it for other components)
            console.log('📡 JobCard: No cache available, fetching companies data');
            companiesData = await fetchCompaniesData();
            companiesLoaded = true;
        } catch (error) {
            console.error('Error loading companies data for logos:', error);
            companiesLoaded = true; // Still set to true to show fallback
        }
    });
    
    // Function to get company logo URL using real company data
    function getCompanyLogo(companyName: string): string {
        if (!companiesLoaded) return ''; // Return empty while loading
        
        // Find the matching company data
        const companyInfo = companiesData.find(c => 
            c.company_name.toLowerCase() === companyName.toLowerCase()
        );
        
        if (companyInfo?.company_url) {
            // Extract domain from company URL
            const domain = extractDomainFromUrl(companyInfo.company_url);
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

<div class="bg-white border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors">
    <!-- Level 1: Job Title -->
    <div class="mb-2 text-left h-12 flex items-center">
        <h3 class="text-lg font-semibold text-gray-900 line-clamp-2 leading-6 tracking-tight">
            {job.title}
        </h3>
    </div>
    
    <!-- Level 2: Company Name with Apply Button -->
    <div class="flex justify-between items-center mb-1">
        <div class="flex items-center text-[13px] text-gray-600">
            <div class="flex items-center mr-2">
                {#if companiesLoaded && getCompanyLogo(job.company)}
                    <img 
                        src={getCompanyLogo(job.company)} 
                        alt="{job.company} logo"
                        class="w-5 h-5 rounded-full object-cover mr-2"
                        on:error={(e) => {
                            // Fallback to building icon if logo fails to load
                            const target = e.target as HTMLImageElement;
                            if (target && target.nextElementSibling) {
                                target.style.display = 'none';
                                (target.nextElementSibling as HTMLElement).style.display = 'block';
                            }
                        }}
                    />
                    <svg class="w-4 h-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                {:else}
                    <!-- Show building icon while loading or as fallback -->
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                {/if}
            </div>
            <span class="font-medium capitalize">{job.company}</span>
        </div>
        
        <a
            href={applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center h-8 px-3 rounded-md border border-gray-300 bg-white text-gray-700 text-xs hover:bg-gray-50 transition-colors"
        >
            Apply
            <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
        </a>
    </div>
    
    <!-- Level 3: Location -->
    <div class="mt-3 pt-3 border-t border-gray-100 flex items-center text-sm text-gray-500">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <span>{job.location}</span>
    </div>
</div>
