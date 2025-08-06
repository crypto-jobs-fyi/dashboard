<!-- Crypto Banner Component -->
<script lang="ts">
    // Banner component - no interactive behavior needed
</script>

<div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-8">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="crypto-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="2" fill="white" opacity="0.3"/>
                    <path d="M5 10 L15 10 M10 5 L10 15" stroke="white" stroke-width="0.5" opacity="0.2"/>
                </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#crypto-pattern)"/>
        </svg>
    </div>

    <!-- Floating Crypto Icons -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-4 left-10 animate-bounce" style="animation-delay: 0s;">
            <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm opacity-70">
                ₿
            </div>
        </div>
        <div class="absolute top-12 right-20 animate-bounce" style="animation-delay: 1s;">
            <div class="w-10 h-10 flex items-center justify-center opacity-60">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L6 10L12 14L18 10L12 2Z" fill="url(#ethGrad1)"/>
                    <path d="M6 10L12 14L12 22L6 10Z" fill="url(#ethGrad2)"/>
                    <path d="M12 14L18 10L12 22L12 14Z" fill="url(#ethGrad3)"/>
                    <defs>
                        <linearGradient id="ethGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#A78BFA;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="ethGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#60A5FA;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="ethGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#10B981;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#34D399;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
        <div class="absolute bottom-6 left-20 animate-bounce" style="animation-delay: 2s;">
            <div class="w-7 h-7 bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-sm opacity-50">
                ◊
            </div>
        </div>
        <div class="absolute top-8 left-1/3 animate-pulse">
            <div class="w-5 h-5 bg-purple-300 rounded-full opacity-40"></div>
        </div>
        <div class="absolute bottom-8 right-1/4 animate-pulse" style="animation-delay: 1.5s;">
            <div class="w-6 h-6 bg-pink-300 rounded-full opacity-40"></div>
        </div>
    </div>

    <!-- Main Banner Content -->
    <div class="relative px-6 py-4 sm:px-12 sm:py-6">
        <div class="max-w-7xl mx-auto">
            <div class="text-center">
                <!-- Main Heading -->
                <h2 class="text-xl sm:text-3xl font-bold text-white mb-2">
                    🌟 Your Gateway to the Crypto Future
                </h2>
                
                <!-- Subheading -->
                <p class="text-base sm:text-lg text-blue-100 mb-4 max-w-3xl mx-auto">
                    Join the revolution! Discover cutting-edge opportunities in blockchain, DeFi, Web3, and cryptocurrency from industry-leading companies.
                </p>

                <!-- Stats Row -->
                <div class="flex flex-wrap justify-center gap-4 sm:gap-8 mb-4">
                    <div class="text-center">
                        <div class="text-xl sm:text-2xl font-bold text-yellow-300">🚀</div>
                        <div class="text-xs text-blue-100">Innovation</div>
                    </div>
                    <div class="text-center">
                        <div class="text-xl sm:text-2xl font-bold text-green-300">💎</div>
                        <div class="text-xs text-blue-100">Premium Jobs</div>
                    </div>
                    <div class="text-center">
                        <div class="text-xl sm:text-2xl font-bold text-purple-300">🔗</div>
                        <div class="text-xs text-blue-100">Blockchain</div>
                    </div>
                    <div class="text-center">
                        <div class="text-xl sm:text-2xl font-bold text-pink-300">⚡</div>
                        <div class="text-xs text-blue-100">Fast Growing</div>
                    </div>
                </div>

                <!-- Trending Keywords -->
                <div class="mt-4 flex flex-wrap justify-center gap-2">
                    <span class="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-xs text-blue-100">
                        #Web3
                    </span>
                    <span class="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-xs text-blue-100">
                        #DeFi
                    </span>
                    <span class="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-xs text-blue-100">
                        #Blockchain
                    </span>
                    <span class="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-xs text-blue-100">
                        #SmartContracts
                    </span>
                    <span class="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-xs text-blue-100">
                        #NFT
                    </span>
                    <span class="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-xs text-blue-100">
                        #RemoteWork
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- Bottom Wave -->
    <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" class="w-full h-8 sm:h-12">
            <path fill="rgb(243, 244, 246)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
    </div>
</div>

<style>
    /* Custom animations for crypto banner */
</style>
