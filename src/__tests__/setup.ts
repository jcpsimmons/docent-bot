// Jest setup file to suppress console errors during tests
// This prevents expected error logs from cluttering test output

const originalConsoleError = console.error;

beforeEach(() => {
  // Mock console.error to suppress expected error messages during tests
  console.error = jest.fn();
});

afterEach(() => {
  // Restore original console.error after each test
  console.error = originalConsoleError;
});