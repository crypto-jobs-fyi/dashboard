# 🚀 Crypto Job Finder Dashboard

A comprehensive and interactive dashboard for finding crypto and blockchain job opportunities. Built with SvelteKit, TypeScript, and Tailwind CSS.

## Features

### ✅ Functional Requirements Implemented

- **FR001**: Interactive dashboard landing page with search capabilities
- **FR002**: Job cards displaying Title, Company name, and Location with clickable application links
- **FR003**: Aggregated information showing total jobs and companies with clickable cards
- **FR004**: Advanced filtering by Company, Location, and Title
- **FR005**: Statistics page accessible via total jobs card showing jobs per company and location
- **FR006**: Companies directory accessible via total companies card with comprehensive company information

## Key Features

### 📊 Dashboard Overview
- Real-time job statistics with total jobs and companies
- Interactive cards that open detailed views
- Clean, modern design with responsive layout

### 🔍 Advanced Filtering
- Filter jobs by company name, location, or job title
- Real-time search results
- Clear filters functionality
- Case-insensitive search

### 📈 Interactive Statistics
- Jobs per company breakdown
- Jobs per location analysis
- Summary statistics with averages
- Sortable data displays

### 🏢 Companies Directory
- Complete list of all hiring companies
- Direct links to company websites
- Career page links
- Job count per company

### 🎯 Job Listings
- Clean job cards with essential information
- Direct "Apply" buttons linking to original job postings
- Company and location information
- Responsive grid layout

## Technology Stack

- **Frontend**: SvelteKit 2.0 with TypeScript
- **Styling**: Tailwind CSS 4.0 with custom components
- **Data Source**: Live API from crypto-jobs-fyi crawler
- **Build System**: Vite 7.0
- **Testing**: Playwright for E2E testing
- **Code Quality**: Prettier for formatting

## Data Source

The dashboard pulls real-time job data from:
```
https://raw.githubusercontent.com/crypto-jobs-fyi/crawler/refs/heads/main/jobs.json
```

This ensures the most up-to-date job listings from top crypto companies including:
- Coinbase, Base, Binance, Kraken
- Phantom, BitGo, dYdX, OpenSea
- Uniswap Labs, Avalanche, Stellar
- And many more...

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation
```bash
# Clone or navigate to the project
cd dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:5173
```

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run check      # Type check the project
npm run lint       # Check code formatting
npm run format     # Format code with Prettier
npm run test       # Run E2E tests
```

## Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable Svelte components
│   │   ├── StatsCards.svelte
│   │   ├── JobFiltersComponent.svelte
│   │   ├── JobCard.svelte
│   │   ├── JobGrid.svelte
│   │   ├── StatisticsModal.svelte
│   │   └── CompaniesModal.svelte
│   ├── jobsData.ts         # Data fetching and processing
│   └── types.ts            # TypeScript type definitions
├── routes/
│   └── +page.svelte        # Main dashboard page
├── app.html                # HTML template
└── app.css                 # Global styles
```

## API Integration

The dashboard integrates with the crypto-jobs-fyi API to fetch real-time job data:

```typescript
// Fetches latest job data
const jobs = await fetchJobsData();

// Processes data for statistics
const stats = processJobsData(jobs);

// Filters jobs based on user input
const filteredJobs = filterJobs(jobs, filters);
```

## Component Architecture

### StatsCards
Interactive cards showing total jobs and companies with click handlers for detailed views.

### JobFiltersComponent
Real-time filtering interface with company, location, and title search.

### JobGrid
Responsive grid display of job cards with loading and empty states.

### StatisticsModal
Modal displaying job statistics per company and location with sortable data.

### CompaniesModal
Modal showing comprehensive company directory with website and career page links.

### JobCard
Individual job display component with company info and direct apply links.

## Performance Features

- **Lazy Loading**: Components load on demand
- **Optimized Filtering**: Efficient search algorithms
- **Responsive Design**: Mobile-first approach
- **Fast Navigation**: Client-side routing
- **Caching**: Intelligent data caching

## Accessibility

- Full keyboard navigation support
- Screen reader compatible
- ARIA labels and roles
- Focus management
- Color contrast compliance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is built for demonstration purposes as part of a coding challenge.

## Contributing

This is a demonstration project. For questions or feedback, please reach out through the appropriate channels.
