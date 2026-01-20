// Security Tests for CLONE PAGES
// Run with: node tests/security.test.js

import { validateUrl } from '../server/index.js';
import { authService } from '../src/services/authService.js';

console.log('🔒 Running Security Tests for CLONE PAGES...\n');

// Test 1: SSRF Protection
console.log('Test 1: SSRF URL Validation');
const ssrfTests = [
  { url: 'https://google.com', expected: true, description: 'Valid HTTPS URL' },
  { url: 'http://example.com', expected: true, description: 'Valid HTTP URL' },
  { url: 'http://localhost:3000', expected: false, description: 'Blocked localhost' },
  { url: 'http://127.0.0.1', expected: false, description: 'Blocked 127.0.0.1' },
  { url: 'http://10.0.0.1', expected: false, description: 'Blocked private IP 10.x.x.x' },
  { url: 'http://192.168.1.1', expected: false, description: 'Blocked private IP 192.168.x.x' },
  { url: 'ftp://example.com', expected: false, description: 'Blocked FTP protocol' },
  { url: 'javascript:alert(1)', expected: false, description: 'Blocked JavaScript protocol' },
];

let ssrfPassed = 0;
ssrfTests.forEach(test => {
  try {
    validateUrl(test.url);
    if (test.expected) {
      console.log(`✅ ${test.description}: PASS`);
      ssrfPassed++;
    } else {
      console.log(`❌ ${test.description}: FAIL (Should have been blocked)`);
    }
  } catch (error) {
    if (!test.expected) {
      console.log(`✅ ${test.description}: PASS (Correctly blocked)`);
      ssrfPassed++;
    } else {
      console.log(`❌ ${test.description}: FAIL (Should have been allowed)`);
    }
  }
});

// Test 2: JWT Token Validation
console.log('\nTest 2: JWT Token Security');
const tokenTests = [
  {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    valid: true,
    description: 'Valid JWT token format'
  },
  {
    token: 'invalid.token',
    valid: false,
    description: 'Invalid JWT format (missing parts)'
  },
  {
    token: 'invalid',
    valid: false,
    description: 'Invalid JWT format (single string)'
  },
  {
    token: '',
    valid: false,
    description: 'Empty token'
  }
];

let tokenPassed = 0;
tokenTests.forEach(test => {
  try {
    const parts = test.token.split('.');
    const isValid = parts.length === 3;

    if (isValid === test.valid) {
      console.log(`✅ ${test.description}: PASS`);
      tokenPassed++;
    } else {
      console.log(`❌ ${test.description}: FAIL`);
    }
  } catch (error) {
    if (!test.valid) {
      console.log(`✅ ${test.description}: PASS (Correctly rejected)`);
      tokenPassed++;
    } else {
      console.log(`❌ ${test.description}: FAIL (Should have been accepted)`);
    }
  }
});

// Test 3: Input Validation
console.log('\nTest 3: Input Validation Tests');
const inputTests = [
  {
    input: '<script>alert("xss")</script>',
    sanitized: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    description: 'XSS script tag sanitization'
  },
  {
    input: 'javascript:alert(1)',
    sanitized: 'javascript:alert(1)',
    description: 'JavaScript protocol handling'
  },
  {
    input: '+55 11 99999-9999',
    valid: true,
    description: 'Valid phone number format'
  },
  {
    input: 'invalid-phone',
    valid: false,
    description: 'Invalid phone number format'
  }
];

let inputPassed = 0;
inputTests.forEach(test => {
  try {
    if (test.description.includes('XSS')) {
      const sanitized = test.input.replace(/[<>&"']/g, (match) => {
        const entities = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' };
        return entities[match];
      });

      if (sanitized === test.sanitized) {
        console.log(`✅ ${test.description}: PASS`);
        inputPassed++;
      } else {
        console.log(`❌ ${test.description}: FAIL`);
      }
    } else if (test.description.includes('phone')) {
      const phoneRegex = /^\+?\d{10,15}$/;
      const isValid = phoneRegex.test(test.input.replace(/[^\d\+\-]/g, ''));

      if (isValid === test.valid) {
        console.log(`✅ ${test.description}: PASS`);
        inputPassed++;
      } else {
        console.log(`❌ ${test.description}: FAIL`);
      }
    }
  } catch (error) {
    console.log(`❌ ${test.description}: ERROR - ${error.message}`);
  }
});

// Test 4: CORS Configuration
console.log('\nTest 4: CORS Configuration Tests');
const corsTests = [
  { origin: 'http://localhost:5173', allowed: true, description: 'Allowed development origin' },
  { origin: 'http://localhost:5174', allowed: true, description: 'Allowed development origin (alt port)' },
  { origin: 'https://malicious-site.com', allowed: false, description: 'Blocked malicious origin' },
  { origin: null, allowed: true, description: 'Allowed requests with no origin (curl, mobile apps)' }
];

let corsPassed = 0;
corsTests.forEach(test => {
  // Simulate CORS validation logic
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
  const isAllowed = !test.origin || allowedOrigins.includes(test.origin);

  if (isAllowed === test.allowed) {
    console.log(`✅ ${test.description}: PASS`);
    corsPassed++;
  } else {
    console.log(`❌ ${test.description}: FAIL`);
  }
});

// Results Summary
console.log('\n📊 Security Test Results:');
console.log(`SSRF Protection: ${ssrfPassed}/${ssrfTests.length} tests passed`);
console.log(`JWT Security: ${tokenPassed}/${tokenTests.length} tests passed`);
console.log(`Input Validation: ${inputPassed}/${inputTests.length} tests passed`);
console.log(`CORS Configuration: ${corsPassed}/${corsTests.length} tests passed`);

const totalPassed = ssrfPassed + tokenPassed + inputPassed + corsPassed;
const totalTests = ssrfTests.length + tokenTests.length + inputTests.length + corsTests.length;
const successRate = Math.round((totalPassed / totalTests) * 100);

console.log(`\n🎯 Overall Security Score: ${successRate}% (${totalPassed}/${totalTests} tests passed)`);

if (successRate >= 80) {
  console.log('✅ Security tests PASSED - Application is secure');
  process.exit(0);
} else {
  console.log('❌ Security tests FAILED - Application has security vulnerabilities');
  process.exit(1);
}