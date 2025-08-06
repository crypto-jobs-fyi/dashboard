// Job data fetcher and processor
import type { Job, JobStats, JobFilters, Company } from './types.js';

const JOBS_DATA_URL = 'https://raw.githubusercontent.com/crypto-jobs-fyi/crawler/refs/heads/main/jobs.json';
const COMPANIES_DATA_URL = 'https://raw.githubusercontent.com/crypto-jobs-fyi/crawler/refs/heads/main/companies.json';

// Cache for companies data
let companiesCache: Company[] | null = null;
let companiesCachePromise: Promise<Company[]> | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cacheTimestamp = 0;

export async function fetchJobsData(): Promise<Job[]> {
    try {
        // Add cache busting parameter
        const cacheBuster = `?t=${Date.now()}`;
        const url = JOBS_DATA_URL + cacheBuster;
        console.log('Fetching jobs from:', url);
        
        // Try with fetch first
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-cache'
        });
        
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data received:', data.data ? data.data.length : 'No data array', 'jobs');
        
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('Invalid data format received');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching jobs data:', error);
        
        // Fallback to XMLHttpRequest if fetch fails
        try {
            console.log('Trying XMLHttpRequest fallback...');
            const cacheBuster = `?t=${Date.now()}`;
            const data = await fetchWithXHR(JOBS_DATA_URL + cacheBuster);
            return data.data || [];
        } catch (xhrError) {
            console.error('XMLHttpRequest also failed:', xhrError);
            return [];
        }
    }
}

function fetchWithXHR(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        resolve(data);
                    } catch (parseError) {
                        reject(new Error('Failed to parse JSON: ' + parseError));
                    }
                } else {
                    reject(new Error(`XHR failed with status: ${xhr.status}`));
                }
            }
        };
        xhr.onerror = () => reject(new Error('XHR network error'));
        xhr.send();
    });
}

export async function fetchCompaniesData(): Promise<Company[]> {
    // Check if we have a valid cache
    const now = Date.now();
    if (companiesCache && (now - cacheTimestamp) < CACHE_DURATION) {
        console.log('✅ CACHE HIT: Returning companies data from cache (age:', Math.round((now - cacheTimestamp) / 1000), 'seconds)');
        return companiesCache;
    }

    // If there's already a pending request, return that promise
    if (companiesCachePromise) {
        console.log('🔄 PENDING REQUEST: Returning existing companies fetch promise');
        return companiesCachePromise;
    }

    // Create a new fetch promise
    console.log('🌐 CACHE MISS: Fetching companies data from API');
    companiesCachePromise = fetchCompaniesDataFromAPI();
    
    try {
        const result = await companiesCachePromise;
        companiesCache = result;
        cacheTimestamp = now;
        console.log('✅ CACHE UPDATED: Companies data cached successfully');
        return result;
    } catch (error) {
        // Reset promise on error so we can retry
        companiesCachePromise = null;
        throw error;
    } finally {
        // Clear the promise after completion (success or failure)
        companiesCachePromise = null;
    }
}

async function fetchCompaniesDataFromAPI(): Promise<Company[]> {
    try {
        console.log('Fetching companies from API:', COMPANIES_DATA_URL);
        
        const cacheBuster = `?t=${Date.now()}`;
        const url = COMPANIES_DATA_URL + cacheBuster;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-cache'
        });
        
        console.log('Companies response status:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Companies data received:', Array.isArray(data) ? data.length : 'Not an array', 'companies');
        
        if (!Array.isArray(data)) {
            throw new Error('Invalid companies data format received');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching companies data:', error);
        return [];
    }
}

export function processJobsData(jobs: Job[]): JobStats {
    const stats: JobStats = {
        totalJobs: jobs.length,
        totalCompanies: new Set(jobs.map(job => job.company)).size,
        companiesData: {},
        locationsData: {},
        jobsByCompany: {},
        jobsByLocation: {}
    };

    // Process company data
    const companyCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};

    jobs.forEach(job => {
        // Company processing
        const company = job.company;
        if (!companyCounts[company]) {
            companyCounts[company] = 0;
        }
        companyCounts[company]++;

        // Location processing
        const location = job.location;
        if (!locationCounts[location]) {
            locationCounts[location] = 0;
        }
        locationCounts[location]++;

        // Store jobs by company
        if (!stats.jobsByCompany[company]) {
            stats.jobsByCompany[company] = [];
        }
        stats.jobsByCompany[company].push(job);

        // Store jobs by location
        if (!stats.jobsByLocation[location]) {
            stats.jobsByLocation[location] = [];
        }
        stats.jobsByLocation[location].push(job);
    });

    stats.companiesData = companyCounts;
    stats.locationsData = locationCounts;

    return stats;
}

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
    return jobs.filter(job => {
        const matchesCompany = !filters.company || 
            job.company.toLowerCase().includes(filters.company.toLowerCase());
        
        const matchesLocation = !filters.location || 
            job.location.toLowerCase().includes(filters.location.toLowerCase());
        
        const matchesTitle = !filters.title || 
            job.title.toLowerCase().includes(filters.title.toLowerCase());

        return matchesCompany && matchesLocation && matchesTitle;
    });
}

export function extractApplicationLink(linkHtml: string): string {
    if (!linkHtml) return '#';
    
    // Check if the link is already a direct URL (new format)
    // This handles both http and https URLs
    if (linkHtml.match(/^https?:\/\//)) {
        return linkHtml;
    }
    
    // Fallback: Extract href from HTML anchor tag (legacy format)
    const hrefMatch = linkHtml.match(/href=['"]([^'"]*)['"]/);
    return hrefMatch ? hrefMatch[1] : '#';
}

// Cache management functions
export function clearCompaniesCache(): void {
    companiesCache = null;
    companiesCachePromise = null;
    cacheTimestamp = 0;
    console.log('Companies cache cleared');
}

export function clearAllCaches(): void {
    clearCompaniesCache();
    // Clear any browser cache for the specific URLs if possible
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                if (cacheName.includes('jobs') || cacheName.includes('companies')) {
                    caches.delete(cacheName);
                }
            });
        }).catch(err => console.log('Cache clearing failed:', err));
    }
    console.log('All caches cleared');
}

export function getCachedCompaniesData(): Company[] | null {
    const now = Date.now();
    if (companiesCache && (now - cacheTimestamp) < CACHE_DURATION) {
        return companiesCache;
    }
    return null;
}

export function isCacheValid(): boolean {
    const now = Date.now();
    return companiesCache !== null && (now - cacheTimestamp) < CACHE_DURATION;
}
