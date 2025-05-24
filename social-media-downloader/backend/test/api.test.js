const assert = require('assert');
const app = require('../server'); // Import the Express app

// --- Test Runner Setup (Minimal) ---
let tests = [];
let passedTests = 0;
let failedTests = 0;

function describe(description, fn) {
  console.log(`\n${description}`);
  fn();
}

function it(description, fn) {
  tests.push({ description, fn });
}

async function runTests() {
  for (const test of tests) {
    try {
      await test.fn(); // Support async tests if needed, though these are sync
      console.log(`  ✔ ${test.description}`);
      passedTests++;
    } catch (error) {
      console.error(`  ✘ ${test.description}`);
      console.error(`    ${error.message}`);
      if (error.stack) {
          console.error(`    Stack: ${error.stack.split('\n').slice(1).join('\n')}`);
      }
      failedTests++;
    }
  }
  console.log(`\nSummary: ${passedTests} passed, ${failedTests} failed.`);
  if (failedTests > 0) {
    process.exitCode = 1; // Indicate failure
  }
}

// --- Mock Request and Response Objects ---
function mockRequest(query = {}, params = {}, body = {}, ip = '127.0.0.1') {
  return {
    query,
    params,
    body,
    ip, // For logging
  };
}

function mockResponse() {
  let status = 200; // Default status
  let jsonResponse = null;
  let sentResponse = null;

  const res = {
    status: (s) => {
      status = s;
      return res; // Allow chaining like res.status(400).json(...)
    },
    json: (data) => {
      jsonResponse = data;
      return res;
    },
    send: (data) => {
        sentResponse = data;
        return res;
    },
    // For retrieving what was sent
    _getStatus: () => status,
    _getJSON: () => jsonResponse,
    _getSent: () => sentResponse,
  };
  return res;
}

// --- Actual Tests ---

// Find the route handler for a given method and path
// This is a simplified way to get the handler without a full router.
// It assumes routes are added in a specific order and doesn't handle complex routing like path parameters well without more logic.
// For this specific app structure, it should work for simple GET routes.
function getRouteHandler(method, path) {
    const layer = app._router.stack.find(
        (r) => r.route && r.route.path === path && r.route.methods[method.toLowerCase()]
    );
    return layer ? layer.route.stack[0].handle : null; // Get the actual handler function
}


describe('API Endpoint Tests', () => {
  describe('/api/test', () => {
    it('should return {"message": "Backend is running"} with status 200', () => {
      const handler = getRouteHandler('get', '/api/test');
      assert.ok(handler, 'Handler for /api/test not found');

      const req = mockRequest();
      const res = mockResponse();
      handler(req, res);

      assert.strictEqual(res._getStatus(), 200, 'Status should be 200');
      assert.deepStrictEqual(res._getJSON(), { message: 'Backend is running' }, 'JSON response mismatch');
    });
  });

  describe('/api/download/youtube Input Validation', () => {
    const youtubeHandler = getRouteHandler('get', '/api/download/youtube');
    
    it('should return 400 if URL is missing', () => {
      assert.ok(youtubeHandler, 'Handler for /api/download/youtube not found');
      const req = mockRequest({}); // No query params
      const res = mockResponse();
      youtubeHandler(req, res);

      assert.strictEqual(res._getStatus(), 400, 'Status should be 400 for missing URL');
      assert.deepStrictEqual(res._getJSON(), { error: 'URL is required' }, 'Error JSON for missing URL mismatch');
    });

    it('should return 400 if URL format is invalid', () => {
      assert.ok(youtubeHandler, 'Handler for /api/download/youtube not found');
      const req = mockRequest({ url: 'invalid-youtube-url' });
      const res = mockResponse();
      youtubeHandler(req, res);

      assert.strictEqual(res._getStatus(), 400, 'Status should be 400 for invalid URL');
      assert.deepStrictEqual(res._getJSON(), { error: 'Invalid URL format' }, 'Error JSON for invalid URL mismatch');
    });
  });

  describe('/api/download/twitter Input Validation', () => {
    const twitterHandler = getRouteHandler('get', '/api/download/twitter');

    it('should return 400 if URL is missing', () => {
      assert.ok(twitterHandler, 'Handler for /api/download/twitter not found');
      const req = mockRequest({}); // No query params
      const res = mockResponse();
      twitterHandler(req, res);

      assert.strictEqual(res._getStatus(), 400, 'Status should be 400 for missing URL');
      assert.deepStrictEqual(res._getJSON(), { error: 'URL is required' }, 'Error JSON for missing URL mismatch');
    });

    it('should return 400 if URL format is invalid', () => {
      assert.ok(twitterHandler, 'Handler for /api/download/twitter not found');
      const req = mockRequest({ url: 'invalid-twitter-url' });
      const res = mockResponse();
      twitterHandler(req, res);

      assert.strictEqual(res._getStatus(), 400, 'Status should be 400 for invalid URL');
      assert.deepStrictEqual(res._getJSON(), { error: 'Invalid URL format' }, 'Error JSON for invalid URL mismatch');
    });
  });
});

// --- Run the tests ---
runTests();
