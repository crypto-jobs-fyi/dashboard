// Test script to verify extractApplicationLink function works with different formats
// Run with: node test-apply-links.js

function extractApplicationLink(linkHtml) {
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

// Test cases
const testCases = [
    {
        input: 'https://www.coinbase.com/careers/positions/6925926',
        expected: 'https://www.coinbase.com/careers/positions/6925926',
        description: 'Direct HTTPS URL (new format)'
    },
    {
        input: 'http://example.com/job',
        expected: 'http://example.com/job',
        description: 'Direct HTTP URL'
    },
    {
        input: '<a href="https://jobs.ashbyhq.com/phantom/c3d84622-8c9c-4fcb-b3db-ee77c0054160">Apply</a>',
        expected: 'https://jobs.ashbyhq.com/phantom/c3d84622-8c9c-4fcb-b3db-ee77c0054160',
        description: 'Legacy HTML anchor tag format'
    },
    {
        input: '<a href=\'https://apply.workable.com/coinlist/j/B8FE60E913/\'>Apply Here</a>',
        expected: 'https://apply.workable.com/coinlist/j/B8FE60E913/',
        description: 'Legacy HTML with single quotes'
    },
    {
        input: '',
        expected: '#',
        description: 'Empty string'
    },
    {
        input: null,
        expected: '#',
        description: 'Null input'
    },
    {
        input: 'invalid-link',
        expected: '#',
        description: 'Invalid link format'
    }
];

// Run tests
console.log('Testing extractApplicationLink function...\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
    const result = extractApplicationLink(testCase.input);
    const success = result === testCase.expected;
    
    console.log(`Test ${index + 1}: ${testCase.description}`);
    console.log(`Input: ${JSON.stringify(testCase.input)}`);
    console.log(`Expected: ${testCase.expected}`);
    console.log(`Got: ${result}`);
    console.log(`Status: ${success ? '✅ PASS' : '❌ FAIL'}`);
    console.log('---');
    
    if (success) {
        passed++;
    } else {
        failed++;
    }
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed === 0) {
    console.log('🎉 All tests passed!');
} else {
    console.log('❌ Some tests failed.');
}
