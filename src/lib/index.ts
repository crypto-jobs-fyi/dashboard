// place files you want to import through the `$lib` alias in this folder.

// Core data functions
export { 
    fetchJobsData, 
    fetchCompaniesData, 
    processJobsData, 
    filterJobs, 
    extractApplicationLink,
    clearCompaniesCache,
    clearAllCaches,
    getCachedCompaniesData,
    isCacheValid
} from './jobsData.js';

// Type definitions
export type { Job, JobStats, JobFilters, Company } from './types.js';

// Components (optional - Svelte components are typically imported directly)
// export { default as JobCard } from './components/JobCard.svelte';
// export { default as JobGrid } from './components/JobGrid.svelte';
// export { default as StatsCards } from './components/StatsCards.svelte';
