<script lang="ts">
	import { onMount } from 'svelte';
	import type { Job, JobStats, JobFilters } from '$lib/types.js';
	import { fetchJobsData, processJobsData, filterJobs, fetchCompaniesData, clearAllCaches } from '$lib/jobsData';
	import StatsCards from '$lib/components/StatsCards.svelte';
	import JobFiltersComponent from '$lib/components/JobFiltersComponent.svelte';
	import JobGrid from '$lib/components/JobGrid.svelte';
	import StatisticsModal from '$lib/components/StatisticsModal.svelte';
	import CompaniesModal from '$lib/components/CompaniesModal.svelte';
	import CryptoBanner from '$lib/components/CryptoBanner.svelte';

	let jobs: Job[] = [];
	let filteredJobs: Job[] = [];
	let stats: JobStats = {
		totalJobs: 0,
		totalCompanies: 0,
		companiesData: {},
		locationsData: {},
		jobsByCompany: {},
		jobsByLocation: {}
	};
	let loading = true;
	let error = '';
	
	let filters: JobFilters = {
		company: '',
		location: '',
		title: ''
	};

	let showStatistics = false;
	let showCompanies = false;

	onMount(async () => {
		console.log('=== MOUNT START ===');
		console.log('Initial loading state:', loading);
		
		// Set a timeout to prevent infinite loading
		const timeoutId = setTimeout(() => {
			console.log('=== TIMEOUT TRIGGERED ===');
			if (loading) {
				error = 'Request timed out. Please check your internet connection and try again.';
				loading = false;
				console.log('Timeout: setting loading to false and error message');
			}
		}, 10000); // 10 second timeout

		try {
			console.log('=== FETCH START ===');
			loading = true;
			console.log('Set loading to true');
			
			// Fetch both jobs and companies data in parallel to populate cache
			const [jobsResult] = await Promise.allSettled([
				fetchJobsData(),
				fetchCompaniesData() // This will populate the cache for other components
			]);
			
			if (jobsResult.status === 'fulfilled') {
				jobs = jobsResult.value;
			} else {
				throw new Error('Failed to fetch jobs data');
			}
			
			console.log('=== FETCH COMPLETE ===');
			console.log('Jobs fetched:', jobs.length);
			
			if (jobs.length === 0) {
				throw new Error('No jobs data received');
			}
			
			console.log('=== PROCESSING DATA ===');
			stats = processJobsData(jobs);
			console.log('Stats processed:', stats.totalJobs, 'jobs,', stats.totalCompanies, 'companies');
			
			filteredJobs = [...jobs];
			console.log('Filtered jobs set:', filteredJobs.length);
			
			// Clear timeout since we succeeded
			clearTimeout(timeoutId);
			console.log('=== SUCCESS ===');
		} catch (err) {
			console.log('=== ERROR OCCURRED ===');
			console.error('Error in onMount:', err);
			error = 'Failed to load job data. Please try again later.';
			clearTimeout(timeoutId);
		} finally {
			console.log('=== FINALLY BLOCK ===');
			loading = false;
			console.log('Set loading to false, final state:', loading);
		}
	});

	function handleFiltersChange(newFilters: JobFilters) {
		filters = newFilters;
		filteredJobs = filterJobs(jobs, filters);
	}

	function handleTotalJobsClick() {
		showStatistics = true;
	}

	function handleTotalCompaniesClick() {
		showCompanies = true;
	}

	async function handleRefresh() {
		console.log('=== REFRESH INITIATED ===');
		loading = true;
		error = '';
		
		// Set a timeout for the refresh operation
		const timeoutId = setTimeout(() => {
			console.log('=== REFRESH TIMEOUT ===');
			if (loading) {
				error = 'Refresh timed out. Please check your internet connection and try again.';
				loading = false;
			}
		}, 15000); // 15 second timeout for refresh
		
		try {
			console.log('Clearing caches...');
			// Clear all caches to ensure fresh data
			clearAllCaches();
			
			console.log('Fetching fresh data...');
			// Fetch both jobs and companies data in parallel to refresh cache
			const [jobsResult, companiesResult] = await Promise.allSettled([
				fetchJobsData(),
				fetchCompaniesData() // This will refresh the cache for other components
			]);
			
			if (jobsResult.status === 'fulfilled') {
				jobs = jobsResult.value;
				console.log('Fresh jobs data loaded:', jobs.length, 'jobs');
			} else {
				console.error('Failed to fetch jobs:', jobsResult.reason);
				throw new Error('Failed to fetch jobs data');
			}
			
			if (companiesResult.status === 'rejected') {
				console.warn('Companies data fetch failed:', companiesResult.reason);
				// Don't fail the entire refresh if companies data fails
			}
			
			if (jobs.length === 0) {
				throw new Error('No jobs data received');
			}
			
			// Reprocess and filter data
			stats = processJobsData(jobs);
			filteredJobs = filterJobs(jobs, filters); // Apply current filters
			
			console.log('=== REFRESH SUCCESS ===');
			console.log('Refreshed data:', stats.totalJobs, 'jobs,', stats.totalCompanies, 'companies');
			
			// Clear timeout since we succeeded
			clearTimeout(timeoutId);
		} catch (err) {
			console.log('=== REFRESH ERROR ===');
			console.error('Error during refresh:', err);
			error = 'Failed to refresh data. Please try again later.';
			clearTimeout(timeoutId);
		} finally {
			loading = false;
			console.log('=== REFRESH COMPLETE ===');
		}
	}
</script>

<svelte:head>
	<title>Crypto Job Finder Dashboard</title>
	<meta name="description" content="Find the latest crypto and blockchain job opportunities across top companies" />
</svelte:head>

<main class="min-h-screen bg-gray-100">
	<!-- Header -->
	<header class="bg-white shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">
						🚀 Crypto Job Finder
					</h1>
				</div>
				<div class="text-right">
					<p class="text-sm text-gray-500">
						Data updated daily from top crypto companies
					</p>
					<button 
						on:click={handleRefresh}
						class="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={loading}
					>
						{loading ? 'Refreshing...' : 'Refresh Data'}
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Crypto Banner -->
	<CryptoBanner />

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if loading}
			<div class="flex justify-center items-center h-64">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				<span class="ml-3 text-lg text-gray-600">Loading job data...</span>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-md p-4">
				<div class="flex">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
					<div class="ml-3">
						<p class="text-sm text-red-800">{error}</p>
					</div>
				</div>
			</div>
		{:else}
			<!-- Dashboard Stats -->
			<StatsCards 
				{stats} 
				onTotalJobsClick={handleTotalJobsClick}
				onTotalCompaniesClick={handleTotalCompaniesClick}
			/>

			<!-- Job Filters -->
			<JobFiltersComponent 
				{filters} 
				onFiltersChange={handleFiltersChange}
			/>

			<!-- Job Grid -->
			<JobGrid 
				jobs={filteredJobs} 
				title="Available Positions"
			/>
		{/if}
	</div>

	<!-- Modals -->
	{#if showStatistics}
		<StatisticsModal 
			{stats} 
			onClose={() => showStatistics = false}
		/>
	{/if}

	{#if showCompanies}
		<CompaniesModal 
			{stats} 
			onClose={() => showCompanies = false}
		/>
	{/if}
</main>
