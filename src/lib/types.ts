// Type definitions for job data
export interface Job {
    company: string;
    title: string;
    location: string;
    link: string;
}

export interface Company {
    company_name: string;
    company_url: string;
    jobs_url: string;
}

export interface JobStats {
    totalJobs: number;
    totalCompanies: number;
    companiesData: Record<string, number>;
    locationsData: Record<string, number>;
    jobsByCompany: Record<string, Job[]>;
    jobsByLocation: Record<string, Job[]>;
}

export interface JobFilters {
    company?: string;
    location?: string;
    title?: string;
}
